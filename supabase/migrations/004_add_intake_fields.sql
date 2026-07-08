-- Migration 004: Add tech_stack, starting_point, and budget_range columns to submissions
-- IMPORTANT: Run each section SEPARATELY in the SQL Editor to avoid deadlocks.
-- Highlight one section at a time and click Run (Cmd+Enter).

-- ── Section 1: Add tech_stack column ────────────────────────────────────────

ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS tech_stack TEXT DEFAULT NULL;

-- ── Section 2: Add starting_point column ────────────────────────────────────

ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS starting_point TEXT DEFAULT NULL;

-- ── Section 3: Add budget_range column ──────────────────────────────────────

ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS budget_range TEXT DEFAULT NULL;