// ============================================================
// Slack webhook integration
// ============================================================

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

interface SlackMessage {
  text: string;
  blocks?: SlackBlock[];
}

interface SlackBlock {
  type: string;
  text?: { type: string; text: string; emoji?: boolean };
  fields?: { type: string; text: string }[];
  elements?: { type: string; text: string }[];
}

export async function sendSlackNotification(message: SlackMessage): Promise<boolean> {
  if (!SLACK_WEBHOOK_URL) {
    console.warn('[Slack] No webhook URL configured, skipping notification');
    return false;
  }

  try {
    const response = await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      console.error(`[Slack] Webhook failed: ${response.status} ${response.statusText}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[Slack] Failed to send notification:', error);
    return false;
  }
}

export function buildProposalNotification(
  action: 'created' | 'approved' | 'sent' | 'signed',
  proposalNumber: string,
  clientName: string,
  total: number,
  appUrl?: string,
): SlackMessage {
  const emoji: Record<string, string> = {
    created: ':page_facing_up:',
    approved: ':white_check_mark:',
    sent: ':email:',
    signed: ':tada:',
  };

  const actionText: Record<string, string> = {
    created: 'New proposal generated',
    approved: 'Proposal approved',
    sent: 'Proposal sent to client',
    signed: 'Proposal signed!',
  };

  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(total);

  const proposalUrl = appUrl ? `${appUrl}/proposals/${proposalNumber}` : '';

  return {
    text: `${actionText[action]}: ${proposalNumber} for ${clientName} (${formattedTotal})`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${emoji[action]} ${actionText[action]}`,
          emoji: true,
        },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Proposal:*\n${proposalNumber}` },
          { type: 'mrkdwn', text: `*Client:*\n${clientName}` },
          { type: 'mrkdwn', text: `*Total:*\n${formattedTotal}` },
          { type: 'mrkdwn', text: `*Status:*\n${action.charAt(0).toUpperCase() + action.slice(1)}` },
        ],
      },
      ...(proposalUrl
        ? [
            {
              type: 'context',
              elements: [{ type: 'mrkdwn', text: `<${proposalUrl}|View Proposal>` }],
            },
          ]
        : []),
    ],
  };
}
