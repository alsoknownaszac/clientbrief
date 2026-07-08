// =============================================================================
// STRIPE PAYMENT — DISABLED FOR MVP v1.0
// =============================================================================
// Stripe payments (deposit) are reserved for a future version.
// When re-enabled, uncomment the full implementation below and add these
// environment variables to .env.local:
//   STRIPE_SECRET_KEY=
//   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
//   STRIPE_WEBHOOK_SECRET=
// =============================================================================

// import Stripe from "stripe";
//
// const platformSecretKey = process.env.STRIPE_SECRET_KEY;
//
// let _platformStripe: Stripe | null = null;
//
// export function getStripeClient(): Stripe {
//   if (!_platformStripe) {
//     if (!platformSecretKey) {
//       throw new Error(
//         "STRIPE_SECRET_KEY is not set. Add it to your .env.local file.",
//       );
//     }
//     _platformStripe = new Stripe(platformSecretKey, {
//       apiVersion: "2025-06-30.basil" as any,
//     });
//   }
//   return _platformStripe;
// }
//
// export function getAgencyStripeClient(
//   secretKey: string | undefined | null,
// ): Stripe {
//   if (!secretKey) {
//     throw new Error(
//       "This agency has not configured their Stripe secret key. " +
//         "Go to Settings → Stripe to add your keys.",
//     );
//   }
//   if (!secretKey.startsWith("sk_") && !secretKey.startsWith("rk_")) {
//     throw new Error(
//       "Invalid Stripe secret key format. Secret keys should start with 'sk_' or 'rk_'.",
//     );
//   }
//   return new Stripe(secretKey, {
//     apiVersion: "2025-06-30.basil" as any,
//   });
// }

// Stub: Stripe is disabled for MVP v1.0.
// Importers will receive this error at runtime if they attempt payment.
const STRIPE_DISABLED_MESSAGE =
  "Stripe payments are disabled for this version. They will be available in a future release.";

export function getStripeClient(): never {
  throw new Error(STRIPE_DISABLED_MESSAGE);
}

export function getAgencyStripeClient(
  _secretKey: string | undefined | null,
): never {
  throw new Error(STRIPE_DISABLED_MESSAGE);
}
