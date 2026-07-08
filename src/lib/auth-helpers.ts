import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Creates a Supabase client for use in Server Components and Route Handlers.
 * Reads cookies from the request to maintain the session.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    },
  );
}

/**
 * Gets the current authenticated user from the session.
 * Returns null if no session exists.
 * Use this in Server Components and Route Handlers.
 */
export async function getCurrentUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Gets the current user's agency record.
 * Returns null if no agency exists for the user.
 */
export async function getCurrentAgency() {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = createClient();
  const { data } = await supabase
    .from("agencies")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return data;
}
