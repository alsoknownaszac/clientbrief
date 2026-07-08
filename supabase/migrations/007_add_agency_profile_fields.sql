-- =============================================================================
-- Migration 007: Add profile fields to agencies table
-- =============================================================================

-- Add contact and branding fields
ALTER TABLE public.agencies
  ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS address TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS website TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS logo_url TEXT DEFAULT NULL;