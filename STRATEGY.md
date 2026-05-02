# Greenscape Pro: AI Agent Strategy

Prepared for License & Scale by Rees Calder | May 2026

## The Five Agents

### #1: QuoteBot (Proposal Accelerator)

**Purpose:** Compress the quote cycle from 6-9 days to same-day.

**What it does:**
- Takes Marcus's site walk notes (often messy, abbreviated) and interprets scope against a 200+ item pricing database
- Generates a professional, itemized proposal with project description, timeline, and costs
- Marcus reviews, edits any line item, and approves with one click
- Sends proposal to client via email; notifies team via Slack
- Tracks AI cost per generation for transparency

**What it replaces:** Marcus manually interpreting site walk notes, building line items from the pricing spreadsheet, drafting proposals in Google Docs, exporting to PDF, and sending. The entire 6-9 day bottleneck.

**Estimated ROI:** 35-40% of qualified leads are lost to faster competitors. At ~150 projects/year and $28K average, even recovering 15-20% of those losses = $420K-$560K annually. Additionally frees 10-15 hours/week of Marcus's time, redirecting him to site walks where he closes at 70%.

**Why #1:** The data is unambiguous. This is the single highest-leverage intervention in the business. Every other agent compounds on top of a faster quote cycle. Fix this first, everything downstream improves.

---

### #2: Pipeline Autopilot

**Purpose:** Automate post-sign follow-up for HOA submissions, permits, and deposit collection.

**What it does:**
- Monitors each project's post-sign status (HOA submitted, permit filed, deposit paid)
- Sends automated, personalized follow-ups via GHL SMS/email at the right cadence
- Escalates stalled items to Marcus or Jenna with full context
- Tracks days-in-limbo per project and surfaces bottlenecks on a dashboard
- Auto-triggers crew scheduling when all gates clear

**What it replaces:** Jenna manually chasing 8-12 projects through HOA boards, permit offices, and slow-paying clients. Currently targeted at 2 weeks but routinely runs 4-6 weeks.

**Estimated ROI:** 8-12 projects in limbo at $28K average = $224K-$336K in delayed revenue at any given time. Reduces Jenna's admin load by ~15 hours/week. Faster cash collection improves working capital and crew utilization.

---

### #3: Ghost Lead Reactivator

**Purpose:** AI-powered re-engagement of 1,400+ closed-lost leads sitting in GHL.

**What it does:**
- Pulls context from GHL notes for each lead (project discussed, reason lost, original timeline)
- Generates personalized re-engagement messages in Marcus's voice ("Hey, we were talking about your backyard last spring. Still thinking about it?")
- Sends via GHL SMS/email with natural timing and spacing (not mass blasts)
- Routes warm responses directly to Marcus for personal follow-up
- Tracks re-engagement funnel: sent, opened, replied, re-closed

**What it replaces:** Brittany's sporadic, generic re-engagement attempts that feel like mass blasts and get ignored.

**Estimated ROI:** 1,400 leads at 2% re-close rate = 28 deals at $28K = $784K in latent revenue. Even at 1%, that is $392K. Low-risk: these are leads who already expressed interest.

---

### #4: Project Pulse

**Purpose:** Automated customer updates during the build phase.

**What it does:**
- Triggers on CompanyCam photo uploads and Jobber milestone check-ins
- Generates a branded progress update with photos, milestone status, and next steps
- Sends to client via email/SMS in Marcus's voice and Greenscape Pro branding
- Auto-generates a halfway-point update (text + photo compilation, replacing the Loom Marcus manages on 30% of jobs)
- Collects satisfaction signals before the final walkthrough

**What it replaces:** Inconsistent CompanyCam pings, crew leads sometimes texting, 4-5 day communication gaps that trigger anxiety calls to Jenna, and the 70% of Loom updates that never get recorded.

**Estimated ROI:** Eliminates 5-10 inbound "what is happening?" calls per week. More importantly, drives referrals. Marcus said it himself: "I have gotten referrals from people who said you are the only contractor who kept us informed." Protects the premium brand positioning that justifies $28K average projects.

---

### #5: Lead Qualifier

**Purpose:** AI pre-qualification via SMS before Marcus's calendar is touched.

**What it does:**
- Intercepts new leads from Meta/Google as they hit GHL
- Sends a friendly SMS qualifying sequence: budget range, project type, timeline, property ownership
- Scores the lead based on Greenscape Pro's ideal customer profile
- Qualified leads auto-book on Marcus's calendar with context pre-loaded
- Unqualified leads ($2K jobs, renters, impossible timelines) get a polite redirect or nurture sequence

**What it replaces:** Marcus personally calling every lead, spending 10-15 minutes on 4-6 clearly unqualified calls per week, knowing within the first 2 minutes it is not going anywhere.

**Estimated ROI:** Saves 1-2 hours/week of Marcus's time. More importantly, protects site walk slots for qualified prospects. Each site walk that converts is worth $28K in revenue. Each wasted call slot is one fewer opportunity to close.

---

## Why This Order

**Why is #1 the #1, not the founder's stated priority?**

It actually is. Marcus correctly identified quoting as his biggest bottleneck, and the discovery call data confirms it. Where my ranking diverges from his stated priorities: his #3 (crew coaching) and #4 (marketing/content) do not make the top 5. Crew coaching impacts ~$2K/week across 4 crews ($104K/year). Real money, but an order of magnitude smaller than the quote-cycle revenue at risk. Marketing/content solves a non-problem. Marcus is quote-constrained, not lead-constrained. He said so himself on the call: "I cannot keep up with the leads I have." ROAS on Meta is 4-4.5x. The lead engine works. Pouring more leads into a bottlenecked quote pipeline just creates more waste.

**What did I cut?**

Crew Coaching Agent. $104K/year impact sounds meaningful until you stack it against $1.5M+ at risk from slow quoting, $784K in dormant closed-lost leads, or $336K in post-sign drag. It is a P6, worth building after the revenue-driving agents are live and compounding.

**Interdependencies:**

QuoteBot must come first. It unblocks everything: faster quotes, higher close rate, more revenue, more freed time for Marcus. Pipeline Autopilot is #2 because there is no point closing deals faster if post-sign drag eats the gains. Ghost Lead Reactivator is independent and can run in parallel with #2. Project Pulse and Lead Qualifier are lower-leverage but compound the brand and efficiency gains from the first three.

---

## Assumptions

- GHL is the system of record and any agent must integrate with it (Jenna's requirement)
- The pricing spreadsheet is comprehensive enough to cover 90%+ of standard project scopes
- Marcus's site walk notes, while abbreviated, contain enough signal for AI scope interpretation
- Slack is the primary internal communication channel and the right notification surface
- Budget for AI API costs is not a constraint relative to the revenue at stake (~$0.02-0.05 per proposal generation)
