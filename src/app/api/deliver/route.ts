import { NextRequest, NextResponse } from "next/server";
import { getQwenClient, MODELS } from "@/lib/qwen";
import { EMAIL_PROMPT } from "@/lib/prompts";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { Resend } from "resend";
import { randomUUID } from "crypto";

const resendApiKey = process.env.RESEND_API_KEY;
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
    const parsedData = sub.parsed_data as Record<string, unknown> | undefined;
    const projectType = (parsedData?.project_type as string) ?? "Project";
    const clientName = sub.client_name as string;
    const clientEmail = sub.client_email as string;

    // ── Generate email body with AI ────────────────────
    let aiBody = `Hi ${clientName},\n\nThank you for submitting your project brief! We've reviewed it and prepared a complete proposal for your ${projectType}.\n\nYou can view the full proposal, scope of work, and invoice online here:\n${portalUrl}\n\nWe're excited about this project and look forward to working with you.`;

    try {
      const qwen = getQwenClient();
      const emailCompletion = await qwen.chat.completions.create({
        model: MODELS.fast,
        messages: [
          { role: "system", content: EMAIL_PROMPT },
          {
            role: "user",
            content: `Client: ${clientName}, Project: ${projectType}, Portal URL: ${portalUrl}`,
          },
        ],
        temperature: 0.5,
        max_tokens: 500,
      });

      const generatedBody = emailCompletion.choices[0]?.message?.content ?? "";
      if (generatedBody.trim()) {
        aiBody = generatedBody;
      }
    } catch (aiErr) {
      console.error("AI email generation failed, using fallback:", aiErr);
      // Use the fallback email body — not a critical failure
    }

    // Append portal link footer
    const emailBody = `${aiBody}

---

📋 **View your proposal online:** ${portalUrl}

Review the scope of work, timeline, and budget — and accept or request changes directly from the portal.`;

    // ── Send email via Resend ──────────────────────────
    let emailSent = false;
    let emailError: string | null = null;

    if (resendApiKey && clientEmail) {
      try {
        const resend = new Resend(resendApiKey);

        const attachments: { filename: string; content: string }[] = [];

        if (sub.scope_document) {
          attachments.push({
            filename: "scope-of-work.md",
            content: Buffer.from(sub.scope_document as string).toString(
              "base64",
            ),
          });
        }

        if (sub.invoice_draft) {
          attachments.push({
            filename: "invoice-draft.md",
            content: Buffer.from(sub.invoice_draft as string).toString(
              "base64",
            ),
          });
        }

        await resend.emails.send({
          from: "ClientBrief Autopilot <onboarding@clientbrief.app>",
          to: clientEmail,
          subject: `Your Project Proposal — ${projectType}`,
          text: emailBody,
          ...(attachments.length > 0 ? { attachments } : {}),
        });

        emailSent = true;
      } catch (sendErr) {
        const msg =
          sendErr instanceof Error ? sendErr.message : "Unknown email error";
        console.error("Resend email delivery failed:", msg);
        emailError = msg;
        // Don't fail the whole request — the portal link still works
      }
    } else if (!resendApiKey) {
      emailError = "RESEND_API_KEY not configured — email not sent";
    } else if (!clientEmail) {
      emailError = "Client email missing — email not sent";
    }

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
      to: clientEmail,
      subject: `Your Project Proposal — ${projectType}`,
      portal_url: portalUrl,
      email_sent: emailSent,
      ...(emailError ? { email_warning: emailError } : {}),
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
