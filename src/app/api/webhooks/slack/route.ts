import { NextRequest, NextResponse } from 'next/server';

// Slack webhook endpoint for receiving interactive actions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle Slack interactive components (button clicks, etc.)
    if (body.type === 'url_verification') {
      return NextResponse.json({ challenge: body.challenge });
    }

    // Log the interaction
    console.log('[Slack Webhook] Received interaction:', JSON.stringify(body, null, 2));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[Slack Webhook] Error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
