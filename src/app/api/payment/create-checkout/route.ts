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
// import { getAgencyStripeClient, getStripeClient } from "@/lib/stripe";
// import { getSupabaseAdminClient } from "@/lib/supabase";
//
// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { submission_id } = body;
//     const origin = req.headers.get("origin") ?? "http://localhost:3000";
//
//     if (!submission_id) {
//       return NextResponse.json(
//         { success: false, error: "Missing submission_id" },
//         { status: 400 },
//       );
//     }
//
//     const supabase = getSupabaseAdminClient();
//     const { data: submission, error: fetchErr } = await (supabase.from("submissions") as any)
//       .select("*").eq("id", submission_id).single();
//
//     if (fetchErr || !submission) {
//       return NextResponse.json(
//         { success: false, error: "Submission not found" },
//         { status: 404 },
//       );
//     }
//
//     if (submission.contract_status !== "signed") {
//       return NextResponse.json(
//         { success: false, error: "Contract must be signed before payment" },
//         { status: 400 },
//       );
//     }
//
//     if (submission.deposit_paid) {
//       return NextResponse.json(
//         { success: false, error: "Deposit has already been paid" },
//         { status: 400 },
//       );
//     }
//
//     const agencyId = submission.agency_id as string | null;
//     let stripeClient;
//     if (agencyId) {
//       const { data: agency } = await (supabase.from("agencies") as any)
//         .select("stripe_secret_key").eq("id", agencyId).single();
//       if (agency?.stripe_secret_key) {
//         stripeClient = getAgencyStripeClient(agency.stripe_secret_key);
//       }
//     }
//     if (!stripeClient) stripeClient = getStripeClient();
//
//     let depositAmount = submission.deposit_amount as number | null;
//     if (!depositAmount && submission.analysis) {
//       const budget = (submission.analysis as any).estimated_budget_usd;
//       depositAmount = Math.round((budget?.low ?? 0) * 0.3);
//     }
//     if (!depositAmount || depositAmount < 500) depositAmount = 500;
//
//     const session = await stripeClient.checkout.sessions.create({ ... });
//     return NextResponse.json({ success: true, url: session.url });
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, error: "Failed to create checkout session" },
//       { status: 500 },
//     );
//   }
// }
