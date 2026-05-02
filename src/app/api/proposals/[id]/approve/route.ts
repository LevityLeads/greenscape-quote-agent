import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
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

    if (proposal.status !== 'draft' && proposal.status !== 'review') {
      return NextResponse.json({ error: `Cannot approve a proposal with status "${proposal.status}"` }, { status: 400 });
    }

    // Update status to approved
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('gs_proposals')
      .update({
        status: 'approved',
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Log activity
    await supabaseAdmin.from('gs_activity_log').insert({
      proposal_id: id,
      action: 'approved',
      details: { approved_by: 'Marcus Tate' },
    });

    // Send Slack notification (non-blocking)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
    sendSlackNotification(
      buildProposalNotification('approved', proposal.proposal_number, proposal.client_name || 'Unknown', proposal.total, appUrl),
    ).catch((err) => console.error('[Slack] Notification failed:', err));

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[API] Failed to approve proposal:', error);
    return NextResponse.json({ error: 'Failed to approve proposal' }, { status: 500 });
  }
}
