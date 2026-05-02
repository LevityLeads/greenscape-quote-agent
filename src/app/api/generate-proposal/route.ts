import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { generateProposal } from '@/lib/anthropic';
import { generateProposalNumber } from '@/lib/format';
import { WARRANTY_TERMS, PAYMENT_TERMS, TAX_RATE } from '@/lib/constants';
import { sendSlackNotification, buildProposalNotification } from '@/lib/slack';
import type { SiteWalkFormData } from '@/types';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: SiteWalkFormData = await request.json();

    // Validate required fields
    if (!body.clientName || !body.scopeNotes) {
      return NextResponse.json(
        { error: 'Client name and scope notes are required' },
        { status: 400 },
      );
    }

    let clientId: string | undefined;
    let siteWalkId: string | undefined;

    // Save client and site walk to database if configured
    if (isSupabaseConfigured()) {
      // Create or find client
      if (body.existingClientId) {
        clientId = body.existingClientId;
      } else {
        const { data: client, error: clientError } = await supabaseAdmin
          .from('gs_clients')
          .insert({
            name: body.clientName,
            email: body.clientEmail || null,
            phone: body.clientPhone || null,
            address: body.clientAddress || null,
            city: body.clientCity || 'Phoenix',
            state: body.clientState || 'AZ',
            zip: body.clientZip || null,
            hoa_required: body.hoaRequired || false,
            hoa_name: body.hoaName || null,
            source: 'quotebot',
          })
          .select()
          .single();

        if (clientError) {
          console.error('[API] Failed to create client:', clientError);
        } else {
          clientId = client.id;
        }
      }

      // Create site walk record
      if (clientId) {
        const { data: siteWalk, error: swError } = await supabaseAdmin
          .from('gs_site_walks')
          .insert({
            client_id: clientId,
            walk_date: body.walkDate || new Date().toISOString(),
            project_types: body.projectTypes || [],
            scope_notes: body.scopeNotes,
            site_conditions: body.siteConditions || null,
            measurements: body.measurements || null,
            budget_discussed: body.budgetDiscussed || null,
            timeline_expectation: body.timelineExpectation || null,
            hoa_required: body.hoaRequired || false,
            render_needed: body.renderNeeded || false,
            raw_notes: body.rawNotes || null,
            status: 'processing',
          })
          .select()
          .single();

        if (swError) {
          console.error('[API] Failed to create site walk:', swError);
        } else {
          siteWalkId = siteWalk.id;
        }
      }
    }

    // Fetch pricing items
    let pricingItems = [];
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('gs_pricing_items')
        .select('*')
        .eq('is_active', true);

      if (!error && data) {
        pricingItems = data;
      }
    }

    // Generate proposal with AI
    const aiResult = await generateProposal({
      scopeNotes: body.scopeNotes,
      projectTypes: body.projectTypes || [],
      siteConditions: body.siteConditions,
      measurements: body.measurements,
      budgetDiscussed: body.budgetDiscussed,
      timelineExpectation: body.timelineExpectation,
      hoaRequired: body.hoaRequired,
      clientAddress: body.clientAddress,
      pricingItems,
    });

    const generationTime = Math.round((Date.now() - startTime) / 1000);

    // Calculate totals
    const subtotal = aiResult.lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const taxAmount = Math.round(subtotal * TAX_RATE * 100) / 100;
    const total = Math.round((subtotal + taxAmount) * 100) / 100;

    let proposalId: string | undefined;
    const proposalNumber = generateProposalNumber();

    // Save proposal to database if configured
    if (isSupabaseConfigured() && clientId && siteWalkId) {
      const { data: proposal, error: proposalError } = await supabaseAdmin
        .from('gs_proposals')
        .insert({
          site_walk_id: siteWalkId,
          client_id: clientId,
          proposal_number: proposalNumber,
          status: 'review',
          project_title: aiResult.projectTitle,
          project_description: aiResult.projectDescription,
          scope_of_work: aiResult.scopeOfWork,
          timeline_estimate: aiResult.timelineEstimate,
          warranty_terms: WARRANTY_TERMS,
          payment_terms: PAYMENT_TERMS,
          subtotal,
          tax_rate: TAX_RATE,
          tax_amount: taxAmount,
          total,
          ai_model_used: aiResult.modelUsed,
          ai_cost_cents: aiResult.estimatedCostCents,
          ai_generation_notes: aiResult.aiNotes,
          client_email: body.clientEmail || null,
          client_name: body.clientName,
          client_address: body.clientAddress || null,
        })
        .select()
        .single();

      if (proposalError) {
        console.error('[API] Failed to save proposal:', proposalError);
      } else {
        proposalId = proposal.id;

        // Save line items
        const lineItems = aiResult.lineItems.map((item, index) => ({
          proposal_id: proposal.id,
          pricing_item_id: item.pricingItemId || null,
          category: item.category,
          name: item.name,
          description: item.description,
          unit: item.unit,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          line_total: item.lineTotal,
          sort_order: index,
          ai_suggested: true,
          manually_adjusted: false,
        }));

        const { error: lineItemError } = await supabaseAdmin
          .from('gs_proposal_line_items')
          .insert(lineItems);

        if (lineItemError) {
          console.error('[API] Failed to save line items:', lineItemError);
        }

        // Update site walk status
        await supabaseAdmin
          .from('gs_site_walks')
          .update({ status: 'completed' })
          .eq('id', siteWalkId);

        // Log activity
        await supabaseAdmin.from('gs_activity_log').insert({
          proposal_id: proposal.id,
          action: 'ai_generated',
          details: {
            model: aiResult.modelUsed,
            cost_cents: aiResult.estimatedCostCents,
            generation_time_seconds: generationTime,
            line_items_count: aiResult.lineItems.length,
          },
        });

        // Slack notification (non-blocking)
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
        sendSlackNotification(
          buildProposalNotification('created', proposalNumber, body.clientName, total, appUrl),
        ).catch((err) => console.error('[Slack] Notification failed:', err));
      }
    }

    return NextResponse.json({
      proposalId,
      proposalNumber,
      ...aiResult,
      subtotal,
      taxRate: TAX_RATE,
      taxAmount,
      total,
      generationTimeSeconds: generationTime,
      warrantyTerms: WARRANTY_TERMS,
      paymentTerms: PAYMENT_TERMS,
    });
  } catch (error) {
    console.error('[API] Proposal generation failed:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error during proposal generation';

    return NextResponse.json(
      {
        error: 'Proposal generation failed',
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
