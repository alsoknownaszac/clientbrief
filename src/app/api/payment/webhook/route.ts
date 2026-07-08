// =============================================================================
// STRIPE PAYMENT — DISABLED FOR MVP v1.0
// =============================================================================
// This webhook will be re-enabled when Stripe payments are added in a future
// version. The original implementation is preserved below.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
  return NextResponse.json({ received: true });
}

// --- Original implementation (disabled for MVP v1.0) ---
//
// import { getSupabaseAdminClient } from "@/lib/supabase";
// import { headers } from "next/headers";
// import Stripe from "stripe";
//
// const platformWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
//
// async function verifyWebhookEvent(
//   body: string, signature: string,
// ): Promise<Stripe.Event> {
//   const supabase = getSupabaseAdminClient();
//   const secrets: string[] = [];
//   if (platformWebhookSecret) secrets.push(platformWebhookSecret);
//   const { data: agencies } = await (supabase.from("agencies") as any)
//     .select("stripe_webhook_secret, id")
//     .not("stripe_webhook_secret", "is", null);
//   if (agencies) {
//     for (const a of agencies) {
//       if (a.stripe_webhook_secret && !secrets.includes(a.stripe_webhook_secret)) {
//         secrets.push(a.stripe_webhook_secret);
//       }
//     }
//   }
//   let lastError: Error | null = null;
//   for (const secret of secrets) {
//     try {
//       const stripe = new Stripe("sk_dummy", { apiVersion: "2025-06-30.basil" as any });
//       return stripe.webhooks.constructEvent(body, signature, secret);
//     } catch (err) {
//       lastError = err instanceof Error ? err : new Error(String(err));
//     }
//   }
//   throw lastError ?? new Error("No webhook secrets configured");
// }
//
// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.text();
//     const headersList = headers();
//     const signature = headersList.get("stripe-signature");
//     if (!signature) return NextResponse.json({ success: false, error: "Missing signature" }, { status: 400 });
//     const event = await verifyWebhookEvent(body, signature);
//     const supabase = getSupabaseAdminClient();
//     if (event.type === "checkout.session.completed") {
//       const session = event.data.object as Stripe.Checkout.Session;
//       if (session.metadata?.submission_id) {
//         await (supabase.from("submissions") as any).update({
//           deposit_paid: true, deposit_paid_at: new Date().toISOString(),
//           status: "delivered", updated_at: new Date().toISOString(),
//         }).eq("id", session.metadata.submission_id);
//       }
//     }
//     if (event.type === "payment_intent.succeeded") {
//       const pi = event.data.object as Stripe.PaymentIntent;
//       if (pi.metadata.submission_id) {
//         const { data: existing } = await (supabase.from("submissions") as any)
//           .select("deposit_paid").eq("id", pi.metadata.submission_id).single();
//         if (!existing?.deposit_paid) {
//           await (supabase.from("submissions") as any).update({
//             deposit_paid: true, deposit_paid_at: new Date().toISOString(),
//             status: "delivered", updated_at: new Date().toISOString(),
//           }).eq("id", pi.metadata.submission_id);
//         }
//       }
//     }
//     return NextResponse.json({ received: true });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: "Webhook error" }, { status: 500 });
//   }
// }
