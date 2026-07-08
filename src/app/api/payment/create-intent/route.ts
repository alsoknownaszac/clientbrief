// =============================================================================
// STRIPE PAYMENT — DISABLED FOR MVP v1.0
// =============================================================================
// This endpoint will be re-enabled when Stripe payments are added in a future
// version. The original implementation is preserved below.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      error:
        "Stripe payments are disabled for this version. They will be available in a future release.",
    },
    { status: 501 },
  );
}

// --- Original implementation (disabled for MVP v1.0) ---
//
// import { getStripeClient } from "@/lib/stripe";
// import { getSupabaseClient } from "@/lib/supabase";
//
// export async function POST(req: NextRequest) { ... }
