-- =============================================================================
-- Migration 003: Create agencies table for multi-tenancy
-- =============================================================================
-- IMPORTANT: Run each section SEPARATELY in the SQL Editor to avoid deadlocks.
-- Highlight one section at a time and click Run (Cmd+Enter).
-- =============================================================================

-- ── Section 1: Create the agencies table ───────────────────────────────────

CREATE TABLE IF NOT EXISTS public.agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- ── Section 2: Add agency_id column to submissions ─────────────────────────

ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS agency_id UUID REFERENCES public.agencies(id);

-- ── Section 3: Create index for submissions by agency ──────────────────────

CREATE INDEX IF NOT EXISTS idx_submissions_agency_id
  ON public.submissions (agency_id);

-- ── Section 4: Enable Row Level Security on agencies ───────────────────────

ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;

-- ── Section 5: Create RLS policies (run all together) ──────────────────────

-- Drop first so this section is safe to re-run
DROP POLICY IF EXISTS "Users can read own agency" ON public.agencies;
DROP POLICY IF EXISTS "Users can insert own agency" ON public.agencies;
DROP POLICY IF EXISTS "Users can update own agency" ON public.agencies;

CREATE POLICY "Users can read own agency"
  ON public.agencies
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own agency"
  ON public.agencies
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own agency"
  ON public.agencies
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
