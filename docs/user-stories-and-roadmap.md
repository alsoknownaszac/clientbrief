# ClientBrief — User Stories & Product Roadmap

> **Target Niche:** Software Development Agencies & Web Dev Shops (2–50 person teams)
>
> **Core value prop:** Turn a vague app idea into a scoped, priced proposal — automatically.

---

## User Personas

| Persona                               | Who They Are                                                                              | Primary Goal                                                            |
| ------------------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Agency Founder / Managing Partner** | Runs a dev shop. Owns deal pipeline. Reviews proposals before they go out.                | Close more deals, faster. Reduce time spent on intake.                  |
| **Project Manager / Account Lead**    | Handles client intake, scoping, proposals. Often the bottleneck.                          | Automate the tedious parts of intake. Get clean, analysis-ready briefs. |
| **Prospective Client**                | Has an idea for an app. May or may not be technical. Wants a fast, professional response. | Describe their project once, get a clear proposal back quickly.         |

---

## User Stories

### Epic 1: Client Brief Intake & AI Processing

> **US-1.1** — As a _prospective client_, I want to submit my app idea in plain English (no tech jargon required) so that I don't have to figure out how to write a technical spec before I even know if the agency is interested.

> **US-1.2** — As a _prospective client_, I want to optionally share what I already have (designs, existing codebase, tech preferences) so the agency knows my starting point without a 30-minute call.

> **US-1.3** — As a _prospective client_, I want the AI to ask me smart follow-up questions when something in my brief is vague, so I don't get a generic "tell us more" email three days later.

> **US-1.4** — As a _prospective client_, I want to know my brief was received and what happens next, so I'm not left wondering if anyone read it.

> **US-1.5** — As a _prospective client_, I want to receive a complete proposal (scope, phases, timeline, pricing) within minutes or hours — not days — so I can make a decision quickly.

---

### Epic 2: Agency Dashboard & Review

> **US-2.1** — As an _agency founder_, I want to see all incoming briefs in a single dashboard with their current status, so I know exactly what's in the pipeline at a glance.

> **US-2.2** — As an _agency founder_, I want each brief to be automatically parsed, scored for clarity, and broken into phases with timeline and budget estimates, so I spend 15 minutes reviewing instead of 4 hours analysing.

> **US-2.3** — As an _agency founder_, I want the AI to flag risks in the brief (tight timeline, vague requirements, budget mismatch), so I know which proposals need extra attention before I send them.

> **US-2.4** — As an _agency founder_, I want a draft scope of work and invoice generated automatically from the analysis, so I'm not writing the same document structure from scratch every time.

> **US-2.5** — As an _agency founder_, I want to review, edit, and approve the AI-generated documents before anything is sent to the client, so I maintain quality control and can add my personal touch.

> **US-2.6** — As an _agency founder_, I want to send the proposal to the client with one click (email + attachments), so there's no copy-paste or manual email composition between me and closing the deal.

---

### Epic 3: Payments, Contracts & Closing (PLANNED)

> **US-3.1** — As an _agency founder_, I want the client to be able to e-sign the scope of work directly from the email/proposal page, so the deal is legally locked in without a separate DocuSign step.

> **US-3.2** — As an _agency founder_, I want a payment link (Stripe) embedded in the proposal so the client can pay a deposit or first milestone immediately upon signing.

> **US-3.3** — As a _prospective client_, I want to review the proposal online (not just in an email), see the phased breakdown clearly, and accept or request changes with one click.

> **US-3.4** — As an _agency founder_, I want the proposal acceptance to automatically trigger a contract record and deposit invoice, so nothing falls through the cracks after the client says "yes."

> **US-3.5** — As an _agency founder_, I want to track which proposals were sent, opened, signed, and paid — all in one place — so I know the health of my pipeline.

---

### Epic 4: Client-Facing Portal (PLANNED)

> **US-4.1** — As a _prospective client_, I want a unique link to view my proposal online (not just an email attachment), so I can review it on any device and share it with my team.

> **US-4.2** — As a _prospective client_, I want to see the status of my submission in real-time (received → analysing → ready for review → proposal sent), so I'm not left in the dark.

> **US-4.3** — As a _prospective client_, I want to accept the proposal, request changes, or ask a question directly from the portal, so I don't have to switch to email.

> **US-4.4** — As a _prospective client_, I want to pay the deposit or first invoice through the portal, so the project can start immediately after I say yes.

---

### Epic 5: Multi-Tenancy for Agencies (PLANNED)

> **US-5.1** — As an _agency founder_, I want to invite team members (PMs, co-founders) to my agency account, so multiple people can review and manage briefs.

> **US-5.2** — As an _agency founder_, I want to set roles (Admin, Manager, Viewer) for team members, so I control who can approve and send proposals vs. who can only review.

> **US-5.3** — As a _project manager_, I want to see only the briefs assigned to me (or all briefs if I have permission), so my dashboard isn't cluttered with other PMs' work.

> **US-5.4** — As an _agency founder_, I want my agency to have its own branding (logo, colours, email sender name) on proposals and client emails, so everything looks like it came from us, not a white-label tool.

> **US-5.5** — As an _agency founder_, I want each brief to have an owner (assigned PM) and activity log (who reviewed, edited, sent), so there's accountability across the team.

---

### Epic 6: Analytics & Insights (PLANNED)

> **US-6.1** — As an _agency founder_, I want to see how many briefs were submitted this month vs. last month, so I can track pipeline growth.

> **US-6.2** — As an _agency founder_, I want to know the average project budget, most common project types, and average time from submission to proposal sent, so I can identify bottlenecks and trends.

> **US-6.3** — As an _agency founder_, I want to see proposal conversion rate (sent → signed), so I know how effective our intake process is.

> **US-6.4** — As an _agency founder_, I want to see which project types have the highest close rate and highest average value, so I know which leads to prioritise.

> **US-6.5** — As an _agency founder_, I want a weekly summary email with key metrics (briefs received, proposals sent, deals closed), so I stay informed without logging into the dashboard.

---

## Implementation Task List

### Phase 1: Solidify the Core (Current — complete & polish)

- [ ] **T-1.1** — Ensure submit endpoint properly stores `tech_stack` and `starting_point` from the intake form
- [ ] **T-1.2** — Update `PARSE_PROMPT` and `ANALYSE_PROMPT` to leverage the new `tech_stack` and `starting_point` fields
- [ ] **T-1.3** — Update `lib/types.ts` `ParsedData` interface to include `tech_stack`, `starting_point`, and `budget_range` fields
- [ ] **T-1.4** — Update the dashboard and detail pages to display the new fields
- [ ] **T-1.5** — Add a "budget range" field to the intake form (e.g., $5K–$15K, $15K–$50K, $50K+)
- [ ] **T-1.6** — Update the success confirmation copy to sell the outcome ("You'll receive a complete proposal with scope, timeline, and pricing within [time].")

### Phase 2: Payments & Contracts Flow

- [ ] **T-2.1** — Database: Add `contract_status` column to submissions (`pending`, `sent`, `signed`, `declined`)
- [ ] **T-2.2** — Database: Add `payment_status` column to submissions (`unpaid`, `deposit_paid`, `paid`)
- [ ] **T-2.3** — Database: Add `signed_scope_document` column (stores the e-signed version)
- [ ] **T-2.4** — Integrate a lightweight e-signature solution (can start with a simple "I agree" checkbox + timestamp/IP log, eventually DocuSign/PandaDoc API)
- [ ] **T-2.5** — Create Stripe checkout session endpoint: `POST /api/create-checkout` for deposit/milestone payments
- [ ] **T-2.6** — Create Stripe webhook handler: `POST /api/stripe-webhook` to update payment status
- [ ] **T-2.7** — Update the deliver flow to include a "Sign & Pay" CTA in the client email + portal page
- [ ] **T-2.8** — Create contract status update endpoint: `POST /api/contract` (accept / decline / request changes)

### Phase 3: Client-Facing Status Page

- [ ] **T-3.1** — Create `src/app/proposal/[id]/page.tsx` — a public-facing proposal view (no auth required, accessed via unique token/link)
- [ ] **T-3.2** — Database: Add `public_token` column to submissions (UUID, generated on delivery)
- [ ] **T-3.3** — Update the deliver email to include a link to the public proposal page
- [ ] **T-3.4** — Public proposal page displays: status, scope of work, invoice, and action buttons (Accept / Request Changes)
- [ ] **T-3.5** — Create a simple status tracker component showing the client where their submission is in the pipeline
- [ ] **T-3.6** — Add "changes requested" flow: client submits feedback, agency is notified, generates revised docs

### Phase 4: Multi-Tenancy

- [ ] **T-4.1** — Database: Create `agencies` table (id, name, slug, branding config, created_at)
- [ ] **T-4.2** — Database: Add `agency_id` FK to `submissions` table
- [ ] **T-4.3** — Database: Create `team_members` table (id, user_id, agency_id, role: admin/manager/viewer)
- [ ] **T-4.4** — Create agency onboarding flow: sign up → create agency → invite team
- [ ] **T-4.5** — Implement role-based access in dashboard: admin can do everything, manager can review/send, viewer is read-only
- [ ] **T-4.6** — Add agency branding settings (logo, primary colour, email from name) to agency profile
- [ ] **T-4.7** — Update email delivery to use agency branding instead of "ClientBrief"
- [ ] **T-4.8** — Add "brief owner" assignment: PMs can be assigned to specific briefs

### Phase 5: Analytics & Insights

- [ ] **T-5.1** — Create `src/app/dashboard/analytics/page.tsx` — analytics dashboard page
- [ ] **T-5.2** — Create `GET /api/analytics` endpoint aggregating: total briefs, by status, by month, average budget, project type distribution, avg time-to-proposal
- [ ] **T-5.3** — Add conversion funnel chart: submitted → analysed → proposal sent → signed → paid
- [ ] **T-5.4** — Add project type breakdown with win rates and average values
- [ ] **T-5.5** — Create a weekly summary email job (can use a cron endpoint or scheduled function)
- [ ] **T-5.6** — Add time-to-proposal metric (how long from submission to "sent" status) — flag slow ones

---

## Landing Page Copy Strategy

The landing page should **sell the outcome**, not just explain what the app does.

### Current Headline:

> "We handle client onboarding so you don't have to."

### Stronger (outcome-focused):

> "From vague app idea to signed proposal — in hours, not days."

### Key Outcome Messages to Feature:

| Pain Point                                                                       | Outcome                                                                                                               |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| "I spend 3–5 hours per lead just figuring out what they want"                    | **Save 10+ hours per lead.** AI parses, clarifies, and scopes — you review.                                           |
| "Clients ghost after the first call because we took too long to send a proposal" | **Respond in minutes, not days.** Proposals go out while the client is still excited.                                 |
| "Our proposals are inconsistent — every PM formats them differently"             | **Every proposal follows the same professional structure.** AI-generated scopes and invoices, branded to your agency. |
| "I have no idea how many leads we're actually closing"                           | **Know your pipeline.** Analytics on submissions, proposals sent, and close rates.                                    |
| "Clients say yes but then never sign or pay"                                     | **Built-in contracts and payments.** Clients sign and pay directly from the proposal.                                 |

### Landing Page Sections to Preserve & Polish:

1. **Hero** — Headline sells the outcome. Subtitle reinforces. Social proof bullets (Save 10+ hours, Never write from scratch).
2. **Who We Help** — Two cards: one for agencies, one for clients.
3. **How It Works** — 4-step visual flow.
4. **Social Proof** — Testimonials from dev agencies.
5. **Pricing** — Free tier for solo devs, Pro for agencies. Add "Agency" tier later.
6. **Form** — Already present.

---

## Database Migration Plan (New Tables)

```sql
-- agencies table (multi-tenancy)
CREATE TABLE agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#6366f1',
  email_from_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- team_members table (multi-tenancy)
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  agency_id UUID NOT NULL REFERENCES agencies(id),
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'manager', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, agency_id)
);

-- Add columns to submissions
ALTER TABLE submissions
  ADD COLUMN agency_id UUID REFERENCES agencies(id),
  ADD COLUMN assigned_to UUID REFERENCES auth.users(id),
  ADD COLUMN public_token UUID UNIQUE DEFAULT gen_random_uuid(),
  ADD COLUMN contract_status TEXT DEFAULT 'pending' CHECK (contract_status IN ('pending', 'sent', 'signed', 'declined')),
  ADD COLUMN payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'deposit_paid', 'paid')),
  ADD COLUMN signed_scope_document TEXT,
  ADD COLUMN stripe_session_id TEXT;
```

---

## Summary: Why ClientBrief Is Properly Suited for Dev Shops

| Requirement                  | How ClientBrief Meets It                                                                        |
| ---------------------------- | ----------------------------------------------------------------------------------------------- |
| Vague, non-technical briefs  | AI parsing + clarification loop handles this natively                                           |
| Project scoping & estimation | AI breaks into phases with durations, deliverables, budget                                      |
| Proposal document generation | Scope of work + invoice generated in parallel                                                   |
| Human review before sending  | Dashboard review → approve → send flow                                                          |
| Multiple project types       | Intake form already covers: Web App, Mobile App, SaaS, API, E-commerce, Dashboard, Landing Page |
| Tech stack awareness         | Intake form already collects tech stack preference                                              |
| Starting point awareness     | Intake form already collects: greenfield, has designs, has codebase, needs design+dev           |
| Risk flagging                | AI analysis already identifies risks (tight timeline, vague scope, budget gaps)                 |

**The app is ~75% complete for the core value proposition. Phases 2–5 add the revenue-enabling features (contracts, payments, team, analytics) that turn it from a tool into a platform.**
