import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let _supabase: ReturnType<typeof createClient> | null = null;
let _supabaseAdmin: ReturnType<typeof createClient> | null = null;

/**
 * Public client — safe for browser usage.
 * Uses the anon key with Row Level Security enforced.
 * Lazily initialized to avoid build-time errors with placeholder env vars.
 */
export function getSupabaseClient() {
  if (!_supabase) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in .env.local\n" +
          "Get them from: https://supabase.com/dashboard/project/<your-project>/settings/api",
      );
    }
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _supabase;
}

/**
 * Admin client — server-side only.
 * Uses the service_role key which bypasses RLS.
 * Never expose this to the browser.
 * Lazily initialized to avoid build-time errors with placeholder env vars.
 */
export function getSupabaseAdminClient() {
  if (!_supabaseAdmin) {
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error(
        "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local\n" +
          "Get them from: https://supabase.com/dashboard/project/<your-project>/settings/api",
      );
    }
    _supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
  }
  return _supabaseAdmin;
}

// Note: Do NOT use `supabase` or `supabaseAdmin` as direct exports.
// Import `getSupabaseClient()` or `getSupabaseAdminClient()` in your API routes instead.
