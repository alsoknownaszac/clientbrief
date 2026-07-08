-- =============================================================================
-- Migration 006: Fix RLS policies — agencies can only see their own submissions
-- =============================================================================
-- IMPORTANT: Run each section SEPARATELY in the SQL Editor to avoid deadlocks.
-- =============================================================================

-- ── Section 1: Drop overly permissive policies ──────────────────────────────

DROP POLICY IF EXISTS "Allow authenticated reads" ON public.submissions;
DROP POLICY IF EXISTS "Allow authenticated updates" ON public.submissions;

-- ── Section 2: Create agency-scoped read policy ─────────────────────────────

-- Drop first so this section is safe to re-run
DROP POLICY IF EXISTS "Agency members can read own submissions" ON public.submissions;

-- Authenticated users can read only submissions belonging to their agency
CREATE POLICY "Agency members can read own submissions"
  ON public.submissions
  FOR SELECT
  TO authenticated
  USING (
    agency_id IN (
      SELECT id FROM public.agencies WHERE user_id = auth.uid()
    )
  );

-- ── Section 3: Create agency-scoped update policy ───────────────────────────

-- Drop first so this section is safe to re-run
DROP POLICY IF EXISTS "Agency members can update own submissions" ON public.submissions;

-- Authenticated users can update only submissions belonging to their agency
CREATE POLICY "Agency members can update own submissions"
  ON public.submissions
  FOR UPDATE
  TO authenticated
  USING (
    agency_id IN (
      SELECT id FROM public.agencies WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    agency_id IN (
      SELECT id FROM public.agencies WHERE user_id = auth.uid()
    )
  );

-- ── Section 4: Ensure anonymous inserts still work ──────────────────────────

-- The existing "Allow anonymous inserts" policy remains unchanged
-- (anon can insert, which is needed for the intake form)

-- ── Section 5: Also fix agencies RLS to allow reading by slug ───────────────

-- Drop the overly restrictive policy that only allows reading own agency
DROP POLICY IF EXISTS "Users can read own agency" ON public.agencies;

-- Allow authenticated users to read ANY agency (needed for admin features)
-- but still restrict writes to own agency
DROP POLICY IF EXISTS "Users can read own agency" ON public.agencies;
CREATE POLICY "Users can read own agency"
  ON public.agencies
  FOR SELECT
  TO authenticated
  USING (true);

-- Also allow anon to read agencies by slug (needed for intake page lookup)
-- We need a separate policy since the authenticated one doesn't cover anon
DROP POLICY IF EXISTS "Anon can read agencies by slug" ON public.agencies;

CREATE POLICY "Anon can read agencies by slug"
  ON public.agencies
  FOR SELECT
  TO anon
  USING (true);