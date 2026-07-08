// =============================================================================
// Deliver route — generates a portal token for client access.
// Email sending (Resend) is disabled for MVP v1.0. The agency gets a shareable
// portal link to send to the client manually.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { randomUUID } from "crypto";

const APP_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { submission_id } = body;

    // ── Validate input ─────────────────────────────────
    if (!submission_id || typeof submission_id !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid submission_id" },
        { status: 400 },
      );
    }

    // ── Fetch submission from Supabase (admin client bypasses RLS) ──
    const supabase = getSupabaseAdminClient();
    const { data: rawData, error: fetchError } = await (
      supabase.from("submissions") as any
    )
      .select("*")
      .eq("id", submission_id)
      .single();

    if (fetchError || !rawData) {
      console.error("Failed to fetch submission for delivery:", fetchError);
      return NextResponse.json(
        {
          success: false,
          error: fetchError
            ? `Submission not found: ${fetchError.message}`
            : "Submission not found",
        },
        { status: 404 },
      );
    }

    const sub = rawData as Record<string, unknown>;

    // Check that required documents exist
    if (!sub.scope_document && !sub.invoice_draft) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No scope document or invoice draft found. Generate documents before delivering.",
        },
        { status: 400 },
      );
    }

    // ── Generate or reuse portal token ─────────────────
    let portalToken = (sub.portal_token as string) || null;
    if (!portalToken) {
      portalToken = randomUUID();
      await (supabase.from("submissions") as any)
        .update({ portal_token: portalToken })
        .eq("id", submission_id);
    }

    const portalUrl = `${APP_URL}/proposal/${portalToken}`;
    const clientName = sub.client_name as string;

    // ── Update submission status ───────────────────────
    await (supabase.from("submissions") as any)
      .update({
        status: "delivered",
        contract_status: "sent",
        updated_at: new Date().toISOString(),
      })
      .eq("id", submission_id);

    return NextResponse.json({
      success: true,
      client_name: clientName,
      portal_url: portalUrl,
      portal_token: portalToken,
      email_sent: false,
      email_warning:
        "Email sending is disabled for this version. Share the portal URL with the client directly.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Deliver route error:", message);
    return NextResponse.json(
      { success: false, error: "Failed to deliver proposal", detail: message },
      { status: 500 },
    );
  }
}

// =============================================================================
// EMAIL SENDING — DISABLED FOR MVP v1.0
// =============================================================================
// The original Resend-based email implementation is preserved below.
// To re-enable, uncomment and add RESEND_API_KEY to .env.local.
// =============================================================================
//
// import { getQwenClient, MODELS } from "@/lib/qwen";
// import { EMAIL_PROMPT } from "@/lib/prompts";
// import { Resend } from "resend";
//
// const resendApiKey = process.env.RESEND_API_KEY;
//
// ... AI email generation + Resend send logic ...
