-- =============================================================================
-- Migration 010: Add rejected status and reject action
-- =============================================================================
-- IMPORTANT: Run each section SEPARATELY in the SQL Editor to avoid deadlocks.
-- =============================================================================

-- ── Section 1: Drop old constraint and add new one with rejected status ─────

ALTER TABLE public.submissions
  DROP CONSTRAINT IF EXISTS submissions_status_check;

ALTER TABLE public.submissions
  ADD CONSTRAINT submissions_status_check
    CHECK (status IN (
      'needs_clarification',
      'ready_for_analysis',
      'analysed',
      'pending_review',
      'contract_sent',
      'contract_signed',
      'delivered',
      'rejected'
    ));