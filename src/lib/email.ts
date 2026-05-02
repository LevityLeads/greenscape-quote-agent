// ============================================================
// SendGrid email integration
// ============================================================

import sgMail from '@sendgrid/mail';
import { formatCurrency } from './format';
import { COMPANY } from './constants';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'quotes@greenscapepro.com';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

interface ProposalEmailData {
  clientName: string;
  clientEmail: string;
  proposalNumber: string;
  projectTitle: string;
  total: number;
  proposalUrl: string;
  expiresAt: string;
}

export async function sendProposalEmail(data: ProposalEmailData): Promise<boolean> {
  if (!SENDGRID_API_KEY) {
    console.warn('[Email] No SendGrid API key configured, skipping email');
    return false;
  }

  const html = buildProposalEmailHtml(data);

  try {
    await sgMail.send({
      to: data.clientEmail,
      from: {
        email: SENDGRID_FROM_EMAIL,
        name: COMPANY.name,
      },
      subject: `Your ${COMPANY.name} Proposal: ${data.projectTitle}`,
      html,
      text: buildProposalEmailText(data),
    });
    return true;
  } catch (error) {
    console.error('[Email] Failed to send proposal email:', error);
    return false;
  }
}

function buildProposalEmailHtml(data: ProposalEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0f172a;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color:#1e293b;border-radius:12px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#059669,#065f46);padding:40px 40px 30px;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;">${COMPANY.name}</h1>
              <p style="margin:8px 0 0;color:#a7f3d0;font-size:14px;letter-spacing:0.5px;">${COMPANY.tagline}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px;color:#e2e8f0;font-size:16px;line-height:1.6;">
                Hi ${data.clientName},
              </p>
              <p style="margin:0 0 30px;color:#cbd5e1;font-size:15px;line-height:1.6;">
                Thank you for the opportunity to bring your outdoor vision to life. We have prepared a detailed proposal for your review.
              </p>

              <!-- Proposal Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#334155;border-radius:8px;margin-bottom:30px;">
                <tr>
                  <td style="padding:24px;">
                    <p style="margin:0 0 4px;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Proposal</p>
                    <p style="margin:0 0 16px;color:#f1f5f9;font-size:18px;font-weight:600;">${data.projectTitle}</p>
                    <table role="presentation" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-right:30px;">
                          <p style="margin:0 0 4px;color:#94a3b8;font-size:12px;">Proposal #</p>
                          <p style="margin:0;color:#e2e8f0;font-size:14px;font-weight:500;">${data.proposalNumber}</p>
                        </td>
                        <td>
                          <p style="margin:0 0 4px;color:#94a3b8;font-size:12px;">Total</p>
                          <p style="margin:0;color:#34d399;font-size:18px;font-weight:700;">${formatCurrency(data.total)}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="${data.proposalUrl}" style="display:inline-block;background-color:#059669;color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:16px;font-weight:600;letter-spacing:0.3px;">
                      View Full Proposal
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:30px 0 0;color:#64748b;font-size:13px;line-height:1.5;text-align:center;">
                This proposal is valid until ${new Date(data.expiresAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;background-color:#0f172a;border-top:1px solid #334155;">
              <p style="margin:0;color:#64748b;font-size:12px;text-align:center;">
                ${COMPANY.name} | ${COMPANY.location} | ${COMPANY.phone}<br>
                ${COMPANY.license}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildProposalEmailText(data: ProposalEmailData): string {
  return `
${COMPANY.name}
${COMPANY.tagline}

Hi ${data.clientName},

Thank you for the opportunity to bring your outdoor vision to life. We have prepared a detailed proposal for your review.

Project: ${data.projectTitle}
Proposal #: ${data.proposalNumber}
Total: ${formatCurrency(data.total)}

View your full proposal here: ${data.proposalUrl}

This proposal is valid until ${new Date(data.expiresAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.

${COMPANY.name} | ${COMPANY.location} | ${COMPANY.phone}
${COMPANY.license}
`.trim();
}
