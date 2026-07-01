-- Create the submissions table for the client brief onboarding system

create table if not exists public.submissions (
  id            uuid primary key default gen_random_uuid(),
  client_name   text not null,
  client_email  text not null,
  project_type  text,
  raw_brief     text not null,
  status        text not null default 'needs_clarification'
                check (status in (
                  'needs_clarification',
                  'ready_for_analysis',
                  'analysed',
                  'pending_review',
                  'delivered'
                )),
  parsed_data   jsonb,
  clarification_questions  jsonb,
  clarification_answers    jsonb,
  analysis      jsonb,
  scope_document   text,
  invoice_draft    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-update updated_at on row modification
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on public.submissions;
create trigger set_updated_at
  before update on public.submissions
  for each row
  execute function public.handle_updated_at();

-- Indexes for common queries
create index if not exists idx_submissions_status on public.submissions (status);
create index if not exists idx_submissions_created_at on public.submissions (created_at desc);

-- Enable Row Level Security
alter table public.submissions enable row level security;

-- Allow anonymous inserts (clients submitting briefs)
create policy if not exists "Allow anonymous inserts"
  on public.submissions
  for insert
  to anon
  with check (true);

-- Allow authenticated users to read all submissions (dashboard)
create policy if not exists "Allow authenticated reads"
  on public.submissions
  for select
  to authenticated
  using (true);

-- Allow authenticated users to update submissions
create policy if not exists "Allow authenticated updates"
  on public.submissions
  for update
  to authenticated
  using (true)
  with check (true);
