import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { sendProposalEmail } from '@/lib/email';
import { sendSlackNotification, buildProposalNotification } from '@/lib/slack';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const { id } = await params;

  try {
    // Fetch the current proposal
    const { data: proposal, error: fetchError } = await supabaseAdmin
      .from('gs_proposals')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    if (proposal.status !== 'approved') {
      return NextResponse.json({ error: 'Proposal must be approved before sending' }, { status: 400 });
    }

    if (!proposal.client_email) {
      return NextResponse.json({ error: 'No client email address on file' }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const proposalUrl = `${appUrl}/proposals/${id}/public`;

    // Send email
    const emailSent = await sendProposalEmail({
      clientName: proposal.client_name || 'Valued Client',
      clientEmail: proposal.client_email,
      proposalNumber: proposal.proposal_number,
      projectTitle: proposal.project_title,
      total: proposal.total,
      proposalUrl,
      expiresAt: proposal.expires_at || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });

    // Update status to sent
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('gs_proposals')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Log activity
    await supabaseAdmin.from('gs_activity_log').insert({
      proposal_id: id,
      action: 'sent',
      details: {
        email_sent: emailSent,
        client_email: proposal.client_email,
        proposal_url: proposalUrl,
      },
    });

    // Slack notification (non-blocking)
    sendSlackNotification(
      buildProposalNotification('sent', proposal.proposal_number, proposal.client_name || 'Unknown', proposal.total, appUrl),
    ).catch((err) => console.error('[Slack] Notification failed:', err));

    return NextResponse.json({
      ...updated,
      email_sent: emailSent,
      proposal_url: proposalUrl,
    });
  } catch (error) {
    console.error('[API] Failed to send proposal:', error);
    return NextResponse.json({ error: 'Failed to send proposal' }, { status: 500 });
  }
}
