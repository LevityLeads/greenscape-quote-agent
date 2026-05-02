# Greenscape Pro QuoteBot

AI-powered proposal generator for a premium residential landscaping company in Phoenix, AZ. Converts messy site walk notes into polished, client-ready proposals in minutes instead of days.

## The Problem

Marcus Tate, founder of Greenscape Pro, is the bottleneck on every proposal. His current process:

1. Walk the job site, take notes on his phone
2. Manually look up 200+ pricing items in a spreadsheet
3. Build a proposal in Google Docs, calculating line items by hand
4. Review, format, and send to the client

This takes 6-9 days per proposal. Competitors respond in 2-3 days. Greenscape loses 35-40% of qualified leads to faster companies.

## The Solution

QuoteBot takes Marcus's site walk notes and a pricing database, then uses Claude to generate a complete, itemized proposal with professional descriptions, realistic quantities, and accurate pricing. Marcus reviews everything before it goes to the client.

**Key workflow:**
1. Marcus enters client info and pastes his site walk notes
2. AI interprets the notes, matches pricing items, estimates quantities
3. Marcus reviews line items, adjusts as needed (full edit capability)
4. One-click approve, one-click send via email
5. Client views a premium, branded proposal page

**Before:** 6-9 day quote cycle, $28K average project
**After:** Same-day proposals, zero lost leads to speed

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4, Framer Motion |
| Database | Supabase (PostgreSQL) |
| AI | Anthropic Claude Sonnet 4 |
| Email | SendGrid |
| Notifications | Slack Incoming Webhooks |
| Deployment | Vercel |

## Architecture

```
src/
  app/                    # Next.js App Router pages
    api/                  # API routes (proposals, clients, pricing, webhooks)
    new/                  # Multi-step proposal creation flow
    proposals/[id]/       # Proposal detail + public client view
    pricing/              # Pricing database browser
    clients/              # Client directory
    embed/                # Iframe-friendly proposal flow
  components/
    ui/                   # Design system (Button, Card, Input, Modal, Toast)
    layout/               # Sidebar, MobileNav
    dashboard/            # Stats cards, recent proposals
    proposal/             # Line item editor, status flow
    site-walk/            # Multi-step form with AI generation
  lib/
    anthropic.ts          # Claude integration + prompt engineering
    supabase.ts           # Database client (lazy-init for build safety)
    slack.ts              # Webhook notifications
    email.ts              # SendGrid HTML email templates
    format.ts             # Currency, date, phone formatting
    constants.ts          # Company info, tax rates, AI config
  types/
    index.ts              # Full TypeScript type definitions
supabase/
  migrations/001_initial.sql   # Database schema (6 tables)
  seed.sql                     # 200+ pricing items
```

## Database Schema

Six tables (all prefixed `gs_`):

- **gs_pricing_items**: 200+ line items across 11 categories with Phoenix-market pricing
- **gs_clients**: Client directory with HOA tracking
- **gs_site_walks**: Site walk notes, measurements, conditions
- **gs_proposals**: Full proposal data with status workflow
- **gs_proposal_line_items**: Itemized pricing with AI confidence scores
- **gs_activity_log**: Audit trail for all proposal actions

## AI Integration

Claude Sonnet 4 generates proposals with a system prompt that acts as a senior Phoenix landscaping estimator. The prompt includes:

- Phoenix-specific knowledge (caliche, monsoon drainage, HOA rules, heat-resistant materials)
- Pricing database matching (passes relevant items by category)
- Quantity estimation from vague notes ("big patio" becomes 400-600 sqft)
- Automatic inclusion of prep work (demo, grading, haul-off)
- Smart upsell suggestions
- Confidence scores per line item (flags uncertain quantities for Marcus)
- Structured JSON output with validation

**Cost transparency:** Every proposal shows the AI model used and estimated API cost (typically $0.02-0.08 per generation).

## Human-in-the-Loop

The AI never sends anything directly to clients. The workflow enforces review:

1. AI generates proposal with status "In Review"
2. Marcus reviews all line items, descriptions, and totals
3. Marcus can edit any line item (quantity, price, add/remove items)
4. Explicit "Approve" action required before sending
5. Separate "Send to Client" action with email delivery
6. Slack notification fires on every status change

## External Integrations

**Slack:** Notifications for proposal created, approved, and sent. Rich message blocks with proposal number, client name, and total.

**SendGrid:** HTML email delivery with branded template. Dark theme email matching the app design. Links to public proposal view.

**Supabase:** Real-time PostgreSQL with RLS-ready schema. All data persisted server-side.

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase project (free tier works)
- Anthropic API key
- Slack webhook URL (optional)
- SendGrid API key (optional)

### Setup

```bash
# Clone and install
git clone https://github.com/LevityLeads/greenscape-quote-agent.git
cd greenscape-quote-agent
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your keys

# Set up database
# Run supabase/migrations/001_initial.sql in your Supabase SQL editor
# Run supabase/seed.sql to populate 200+ pricing items

# Start development server
npm run dev
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key |
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key for Claude |
| `SLACK_WEBHOOK_URL` | No | Slack incoming webhook URL |
| `SENDGRID_API_KEY` | No | SendGrid API key |
| `SENDGRID_FROM_EMAIL` | No | Sender email (default: quotes@greenscapepro.com) |
| `NEXT_PUBLIC_APP_URL` | No | Public app URL for email links |

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set all environment variables in the Vercel dashboard under Project Settings > Environment Variables.

## Design Decisions

**Why Claude Sonnet 4 over GPT-4?** Sonnet offers the best cost-to-quality ratio for structured JSON generation. At ~$0.03 per proposal, the AI cost is negligible compared to the time saved. The response quality is consistently high for technical estimation tasks.

**Why a dark theme?** Marcus uses this on his phone after site walks, often in bright Phoenix sun. Dark themes reduce eye strain and glare. The earth/green tones match the landscaping industry aesthetic and feel premium.

**Why server-side proposal generation?** Keeps the API key secure, allows database persistence in the same request, and enables cost tracking. The 10-30 second generation time is acceptable given the alternative is 6 days.

**Why not real-time streaming?** For a proposal generation use case, the complete response needs to be validated as JSON before display. Streaming would show partial, unparseable content. A well-designed loading state is cleaner.

**Why Supabase over Prisma/raw PG?** Quick setup, built-in auth (extensible), REST API, and a generous free tier. The `gs_` table prefix prevents conflicts if the database is shared.

## Cost Analysis

| Component | Cost per Proposal | Monthly (150 proposals) |
|-----------|-------------------|------------------------|
| Claude Sonnet 4 | ~$0.03 | ~$4.50 |
| Supabase | Free tier | $0 |
| SendGrid | Free tier (100/day) | $0 |
| Vercel | Pro plan | $20/mo |
| **Total** | | **~$25/mo** |

For a company doing $4.2M/year revenue with $28K average projects, $25/month to compress the quote cycle from 6 days to same-day is a no-brainer ROI.

## Embed Mode

The `/embed` route provides a chromeless version of the proposal creation flow, suitable for embedding in external tools via iframe:

```html
<iframe src="https://your-app.vercel.app/embed" width="100%" height="800px"></iframe>
```

The embed communicates completion via `postMessage`:
```javascript
window.addEventListener('message', (event) => {
  if (event.data.type === 'greenscape-proposal-complete') {
    console.log('Proposal created:', event.data.proposalId);
  }
});
```

## License

MIT
