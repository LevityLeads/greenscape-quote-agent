import { NextRequest, NextResponse } from 'next/server';
import { generateProjectRender } from '@/lib/openai';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { proposalId, projectTitle, projectDescription, projectTypes, clientAddress } = body;

    if (!projectTitle || !projectDescription || !projectTypes?.length) {
      return NextResponse.json(
        { error: 'projectTitle, projectDescription, and projectTypes are required' },
        { status: 400 },
      );
    }

    const result = await generateProjectRender({
      projectTitle,
      projectDescription,
      projectTypes,
      clientAddress,
    });

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to generate project visualization' },
        { status: 500 },
      );
    }

    const imageUrl = `data:image/png;base64,${result.imageBase64}`;

    // Save to proposal if ID provided and Supabase is configured
    if (proposalId && isSupabaseConfigured()) {
      const { error: updateError } = await supabaseAdmin
        .from('gs_proposals')
        .update({ render_image: imageUrl })
        .eq('id', proposalId);

      if (updateError) {
        console.error('[generate-render] Failed to save render to proposal:', updateError);
        // Don't fail the request, the image was still generated
      }
    }

    return NextResponse.json({ imageUrl });
  } catch (err) {
    console.error('[generate-render] Error:', err);
    return NextResponse.json(
      { error: 'Internal server error generating visualization' },
      { status: 500 },
    );
  }
}
