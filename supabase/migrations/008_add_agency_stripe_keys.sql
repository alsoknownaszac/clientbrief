-- =============================================================================
-- Migration 008: Add Stripe payment fields to agencies table
-- =============================================================================
-- IMPORTANT: Run each section SEPARATELY in the SQL Editor to avoid deadlocks.
-- Highlight one section at a time and click Run (Cmd+Enter).
-- =============================================================================

-- ── Section 1: Add Stripe columns ─────────────────────────────────────────

ALTER TABLE public.agencies
  ADD COLUMN IF NOT EXISTS stripe_secret_key TEXT DEFAULT NULL;

ALTER TABLE public.agencies
  ADD COLUMN IF NOT EXISTS stripe_publishable_key TEXT DEFAULT NULL;

ALTER TABLE public.agencies
  ADD COLUMN IF NOT EXISTS stripe_webhook_secret TEXT DEFAULT NULL;