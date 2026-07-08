/**
 * Environment variable validation.
 * Call `validateEnv()` early in the app lifecycle to catch missing
 * configuration before runtime errors surface cryptically.
 */

const requiredVars: { key: string; label: string }[] = [
  { key: "DASHSCOPE_API_KEY", label: "Qwen/DashScope API key" },
  {
    key: "NEXT_PUBLIC_SUPABASE_URL",
    label: "Supabase project URL",
  },
  {
    key: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    label: "Supabase anon key",
  },
  {
    key: "SUPABASE_SERVICE_ROLE_KEY",
    label: "Supabase service role key (server only)",
  },
  { key: "STRIPE_SECRET_KEY", label: "Stripe secret key (server only)" },
  {
    key: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    label: "Stripe publishable key",
  },
  { key: "RESEND_API_KEY", label: "Resend API key (server only)" },
];

const serverOnlyVars = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "STRIPE_SECRET_KEY",
  "RESEND_API_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "DASHSCOPE_API_KEY",
];

/**
 * Validates that all required environment variables are set.
 * Server-only vars are only checked when running on the server.
 *
 * Returns an array of missing variable labels, or empty if all good.
 */
export function validateEnv(): string[] {
  const missing: string[] = [];

  for (const { key, label } of requiredVars) {
    // Skip server-only vars in browser context
    if (typeof window !== "undefined" && serverOnlyVars.includes(key)) {
      continue;
    }

    if (!process.env[key]) {
      missing.push(`${label} (${key})`);
    }
  }

  return missing;
}

/**
 * Call at app startup. Logs warnings for missing vars in development.
 */
export function checkEnv() {
  const missing = validateEnv();
  if (missing.length > 0) {
    const msg = `Missing environment variables:\n  - ${missing.join("\n  - ")}\nCheck .env.local and .env.example for required values.`;
    if (process.env.NODE_ENV === "development") {
      console.warn(msg);
    } else {
      console.error(msg);
    }
  }
}
