import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ items: [], categories: [] });
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  try {
    let query = supabaseAdmin
      .from('gs_pricing_items')
      .select('*')
      .eq('is_active', true)
      .order('category')
      .order('name');

    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    const items = data || [];
    const categories = [...new Set(items.map((item) => item.category))].sort();

    return NextResponse.json({ items, categories });
  } catch (error) {
    console.error('[API] Failed to fetch pricing:', error);
    return NextResponse.json({ error: 'Failed to fetch pricing' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const { data, error } = await supabaseAdmin
      .from('gs_pricing_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('[API] Failed to update pricing item:', error);
    return NextResponse.json({ error: 'Failed to update pricing item' }, { status: 500 });
  }
}
