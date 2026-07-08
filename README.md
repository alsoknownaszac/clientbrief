# ClientBrief

AI-powered client intake platform for software development agencies. Turns vague app ideas into scoped, priced proposals — automatically.

## Prerequisites

- **Node.js** 18+
- **npm** (this project uses npm, not pnpm)
- **Supabase** account (database + auth)
- **Qwen/DashScope** API key (AI model)
- **Stripe** account (payments)
- **Resend** account (email delivery)

## Quick Start

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd clientbrief
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in all values in `.env.local`:

| Variable                             | Where to get it                                                       |
| ------------------------------------ | --------------------------------------------------------------------- |
| `DASHSCOPE_API_KEY`                  | [Aliyun Bailian Console](https://bailian.console.aliyun.com)          |
| `RESEND_API_KEY`                     | [Resend API Keys](https://resend.com/api-keys)                        |
| `NEXT_PUBLIC_SUPABASE_URL`           | [Supabase Dashboard](https://supabase.com/dashboard) → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`      | Same as above                                                         |
| `SUPABASE_SERVICE_ROLE_KEY`          | Same as above                                                         |
| `STRIPE_SECRET_KEY`                  | [Stripe Dashboard](https://dashboard.stripe.com/apikeys)              |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Same as above                                                         |
| `STRIPE_WEBHOOK_SECRET`              | Stripe Dashboard → Webhooks                                           |
| `NEXT_PUBLIC_SITE_URL`               | `http://localhost:3000` (or your deployed URL)                        |

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the migrations in order from `supabase/migrations/`:
   - `001_create_submissions.sql`
   - `002_add_contract_payment.sql`
   - `003_create_agencies.sql`
   - `004_add_intake_fields.sql`
   - `005_add_agency_slug.sql`
3. Each migration has sections — run them one at a time in the Supabase SQL Editor

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes (submit, analyse, clarify, generate, deliver, contract, payment)
│   ├── auth/          # Auth callback
│   ├── clarify/       # Client clarification page
│   ├── dashboard/     # Agency dashboard (list + detail)
│   ├── login/         # Login page
│   ├── proposal/      # Client-facing proposal portal
│   ├── signup/        # Agency signup
│   └── page.tsx       # Landing page with intake form
├── components/        # Shared React components
└── lib/               # Shared utilities (supabase, qwen, stripe, prompts, types)
supabase/
└── migrations/        # Database migrations (run in order)
```

## Architecture

- **Frontend**: Next.js 14 (App Router) + React 18 + Tailwind CSS
- **Backend**: Next.js API routes (serverless)
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Auth**: Supabase Auth (email/password)
- **AI**: Qwen via DashScope (OpenAI-compatible API)
- **Email**: Resend
- **Payments**: Stripe

## Core Flow

1. **Agency signs up** → Gets unique intake URL (`/intake/{slug}`)
2. **Client submits brief** → AI parses and validates
3. **AI clarifies** if brief is vague → Client answers questions
4. **AI analyses** → Phases, timeline, budget estimates
5. **AI generates** → Scope of work + invoice draft
6. **Agency reviews** → Approves and sends to client
7. **Client receives** → Email with proposal + portal link
8. **Client accepts & pays** → Via proposal portal (Stripe)
