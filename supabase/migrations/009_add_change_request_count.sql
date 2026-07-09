-- =============================================================================
-- Migration 009: Add change request counter to submissions
-- =============================================================================
-- IMPORTANT: Run each section SEPARATELY in the SQL Editor to avoid deadlocks.
-- =============================================================================

-- ── Section 1: Add change_request_count column ──────────────────────────────

ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS change_request_count INTEGER DEFAULT 0;