-- Add contract and payment columns to submissions table

alter table public.submissions
  add column if not exists contract_status text default null
    check (contract_status in ('sent', 'signed', null));

alter table public.submissions
  add column if not exists contract_signed_at timestamptz default null;

alter table public.submissions
  add column if not exists stripe_payment_intent_id text default null;

alter table public.submissions
  add column if not exists deposit_amount integer default null;

alter table public.submissions
  add column if not exists deposit_paid boolean default false;

alter table public.submissions
  add column if not exists deposit_paid_at timestamptz default null;

alter table public.submissions
  add column if not exists portal_token text unique default null;

alter table public.submissions
  add column if not exists client_feedback text default null;

-- Expand the status check constraint to include new statuses
alter table public.submissions
  drop constraint if exists submissions_status_check;

alter table public.submissions
  add constraint submissions_status_check
    check (status in (
      'needs_clarification',
      'ready_for_analysis',
      'analysed',
      'pending_review',
      'contract_sent',
      'contract_signed',
      'delivered'
    ));

-- Index for portal_token lookups
create index if not exists idx_submissions_portal_token
  on public.submissions (portal_token);

-- Index for payment intent lookups
create index if not exists idx_submissions_payment_intent
  on public.submissions (stripe_payment_intent_id);