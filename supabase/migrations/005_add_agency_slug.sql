-- =============================================================================
-- Migration 005: Add slug column to agencies table
-- =============================================================================
-- IMPORTANT: Run each section SEPARATELY in the SQL Editor to avoid deadlocks.
-- Highlight one section at a time and click Run (Cmd+Enter).
-- =============================================================================

-- ── Section 1: Add slug column ─────────────────────────────────────────────

ALTER TABLE public.agencies
  ADD COLUMN IF NOT EXISTS slug TEXT;

-- ── Section 2: Generate slugs for existing agencies ────────────────────────

-- Generate a slug from the agency name (lowercase, hyphenated, truncated)
-- Append first 8 chars of id for uniqueness
UPDATE public.agencies
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      LEFT(name, 50),
      '[^a-zA-Z0-9\s-]', '', 'g'
    ),
    '\s+', '-', 'g'
  )
) || '-' || LEFT(id::text, 8)
WHERE slug IS NULL;

-- ── Section 3: Make slug NOT NULL and UNIQUE ───────────────────────────────

ALTER TABLE public.agencies
  ALTER COLUMN slug SET NOT NULL;

-- Drop the constraint first so this section is safe to re-run
ALTER TABLE public.agencies
  DROP CONSTRAINT IF EXISTS agencies_slug_unique;

ALTER TABLE public.agencies
  ADD CONSTRAINT agencies_slug_unique UNIQUE (slug);

-- ── Section 4: Create index for slug lookups ───────────────────────────────

CREATE INDEX IF NOT EXISTS idx_agencies_slug
  ON public.agencies (slug);