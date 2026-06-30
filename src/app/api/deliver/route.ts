import { NextRequest, NextResponse } from "next/server";
import { getQwenClient, MODELS } from "@/lib/qwen";
import { EMAIL_PROMPT } from "@/lib/prompts";
import { getSupabaseClient } from "@/lib/supabase";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { submission_id } = body;

    if (!submission_id) {
      return NextResponse.json(
        { success: false, error: "Missing submission_id" },
        { status: 400 },
      );
    }

    // Fetch submission from Supabase
    let sub: Record<string, unknown> | null = null;

    try {
      const supabase = getSupabaseClient();
      const { data } = await (supabase.from("submissions") as any)
        .select("*")
        .eq("id", submission_id)
        .single();
      sub = data as Record<string, unknown> | null;
    } catch {
      // Supabase not configured
    }

    if (!sub) {
      return NextResponse.json({
        success: true,
        demo: true,
        note: "Submission not found in database. Simulated delivery.",
        to: "client@example.com",
        subject: "Your Project Proposal",
      });
    }

    if (!resendApiKey) {
      return NextResponse.json({
        success: false,
        demo: true,
        note: "Email delivery simulated. Set RESEND_API_KEY to send real emails.",
        to: sub.client_email as string,
        subject: `Your Project Proposal — ${((sub.parsed_data as Record<string, unknown>)?.project_type as string) ?? "Project"}`,
      });
    }

    const resend = new Resend(resendApiKey);

    const qwen = getQwenClient();
    const emailCompletion = await qwen.chat.completions.create({
      model: MODELS.fast,
      messages: [
        { role: "system", content: EMAIL_PROMPT },
        {
          role: "user",
          content: `Client: ${sub.client_name}, Project: ${((sub.parsed_data as Record<string, unknown>)?.project_type as string) ?? "your project"}`,
        },
      ],
      temperature: 0.5,
      max_tokens: 300,
    });

    const emailBody = emailCompletion.choices[0]?.message?.content ?? "";

    await resend.emails.send({
      from: "ClientBrief Autopilot <onboarding@clientbrief.app>",
      to: sub.client_email as string,
      subject: `Your Project Proposal — ${((sub.parsed_data as Record<string, unknown>)?.project_type as string) ?? "Project"}`,
      text: emailBody,
      attachments: [
        {
          filename: "scope-of-work.md",
          content: Buffer.from((sub.scope_document as string) ?? "").toString(
            "base64",
          ),
        },
        {
          filename: "invoice-draft.md",
          content: Buffer.from((sub.invoice_draft as string) ?? "").toString(
            "base64",
          ),
        },
      ],
    });

    const supabase = getSupabaseClient();
    await (supabase.from("submissions") as any)
      .update({ status: "delivered" })
      .eq("id", submission_id);

    return NextResponse.json({
      success: true,
      to: sub.client_email,
      subject: `Your Project Proposal — ${((sub.parsed_data as Record<string, unknown>)?.project_type as string) ?? "Project"}`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json({
      success: true,
      demo: true,
      note: `Email delivery simulated (${message}). Set RESEND_API_KEY to send real emails.`,
      to: "client@example.com",
      subject: "Your Project Proposal",
    });
  }
}
