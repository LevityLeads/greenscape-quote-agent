import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const { id } = await params;

  try {
    // Fetch proposal
    const { data: proposal, error: proposalError } = await supabaseAdmin
      .from('gs_proposals')
      .select('*')
      .eq('id', id)
      .single();

    if (proposalError || !proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Fetch line items
    const { data: lineItems } = await supabaseAdmin
      .from('gs_proposal_line_items')
      .select('*')
      .eq('proposal_id', id)
      .order('sort_order');

    // Fetch activity log
    const { data: activity } = await supabaseAdmin
      .from('gs_activity_log')
      .select('*')
      .eq('proposal_id', id)
      .order('created_at', { ascending: false });

    return NextResponse.json({
      ...proposal,
      line_items: lineItems || [],
      activity_log: activity || [],
    });
  } catch (error) {
    console.error('[API] Failed to fetch proposal:', error);
    return NextResponse.json({ error: 'Failed to fetch proposal' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const { id } = await params;

  try {
    const body = await request.json();

    // If updating line items, handle separately
    if (body.line_items) {
      // Delete existing and re-insert
      await supabaseAdmin
        .from('gs_proposal_line_items')
        .delete()
        .eq('proposal_id', id);

      const lineItems = body.line_items.map((item: Record<string, unknown>, index: number) => ({
        proposal_id: id,
        pricing_item_id: item.pricing_item_id || null,
        category: item.category,
        name: item.name,
        description: item.description || '',
        unit: item.unit,
        quantity: item.quantity,
        unit_price: item.unit_price,
        line_total: Number(item.quantity) * Number(item.unit_price),
        sort_order: index,
        ai_suggested: item.ai_suggested ?? false,
        manually_adjusted: true,
      }));

      await supabaseAdmin
        .from('gs_proposal_line_items')
        .insert(lineItems);

      // Recalculate totals
      const subtotal = lineItems.reduce((sum: number, item: Record<string, unknown>) => sum + (Number(item.line_total) || 0), 0);
      const taxRate = body.tax_rate || 0.0856;
      const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
      const total = Math.round((subtotal + taxAmount) * 100) / 100;

      const { data: updated, error: updateError } = await supabaseAdmin
        .from('gs_proposals')
        .update({
          subtotal,
          tax_amount: taxAmount,
          total,
          ...(body.project_title && { project_title: body.project_title }),
          ...(body.project_description && { project_description: body.project_description }),
          ...(body.scope_of_work && { scope_of_work: body.scope_of_work }),
          ...(body.timeline_estimate && { timeline_estimate: body.timeline_estimate }),
          ...(body.status && { status: body.status }),
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Log activity
      await supabaseAdmin.from('gs_activity_log').insert({
        proposal_id: id,
        action: 'line_items_updated',
        details: { line_items_count: lineItems.length, new_total: total },
      });

      return NextResponse.json(updated);
    }

    // Simple field updates
    const allowedFields = ['project_title', 'project_description', 'scope_of_work', 'timeline_estimate', 'status', 'client_email', 'client_name', 'client_address'];
    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('gs_proposals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Log activity
    await supabaseAdmin.from('gs_activity_log').insert({
      proposal_id: id,
      action: 'updated',
      details: { fields: Object.keys(updates) },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[API] Failed to update proposal:', error);
    return NextResponse.json({ error: 'Failed to update proposal' }, { status: 500 });
  }
}
