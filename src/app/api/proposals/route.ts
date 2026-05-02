import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      proposals: [],
      stats: {
        proposalsThisMonth: 0,
        proposalsThisQuarter: 0,
        pipelineRevenue: 0,
        averageGenerationTime: 0,
        winRate: 0,
        totalSigned: 0,
        totalSent: 0,
      },
    });
  }

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '50');
  const status = searchParams.get('status');

  try {
    let query = supabaseAdmin
      .from('gs_proposals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: proposals, error } = await query;

    if (error) throw error;

    // Calculate stats
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1).toISOString();

    const allProposals = proposals || [];
    const thisMonth = allProposals.filter((p) => p.created_at >= startOfMonth);
    const thisQuarter = allProposals.filter((p) => p.created_at >= startOfQuarter);
    const pipeline = allProposals.filter((p) => ['draft', 'review', 'approved', 'sent'].includes(p.status));
    const sent = allProposals.filter((p) => ['sent', 'signed', 'rejected'].includes(p.status));
    const signed = allProposals.filter((p) => p.status === 'signed');

    const stats = {
      proposalsThisMonth: thisMonth.length,
      proposalsThisQuarter: thisQuarter.length,
      pipelineRevenue: pipeline.reduce((sum, p) => sum + (p.total || 0), 0),
      averageGenerationTime: 0,
      winRate: sent.length > 0 ? signed.length / sent.length : 0,
      totalSigned: signed.length,
      totalSent: sent.length,
    };

    return NextResponse.json({ proposals: allProposals, stats });
  } catch (error) {
    console.error('[API] Failed to fetch proposals:', error);
    return NextResponse.json({ error: 'Failed to fetch proposals' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from('gs_proposals')
      .insert(body)
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await supabaseAdmin.from('gs_activity_log').insert({
      proposal_id: data.id,
      action: 'created',
      details: { source: 'api' },
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('[API] Failed to create proposal:', error);
    return NextResponse.json({ error: 'Failed to create proposal' }, { status: 500 });
  }
}
