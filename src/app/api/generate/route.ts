import { NextRequest, NextResponse } from "next/server";
import { getQwenClient, MODELS } from "@/lib/qwen";
import { SCOPE_PROMPT, INVOICE_PROMPT } from "@/lib/prompts";
import { getSupabaseAdminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { submission_id, parsed_data, analysis } = body;

    if (!parsed_data || !analysis) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: parsed_data, analysis",
        },
        { status: 400 },
      );
    }

    const qwen = getQwenClient();

    const context = `
Client: ${parsed_data.client_name ?? "Unknown"}
Project: ${parsed_data.project_type ?? "Unknown"}
Summary: ${analysis.project_summary ?? ""}
Phases: ${JSON.stringify(analysis.phases ?? [])}
Duration: ${analysis.total_duration_weeks ?? "?"} weeks
Budget Range: $${analysis.estimated_budget_usd?.low ?? "?"}–$${analysis.estimated_budget_usd?.high ?? "?"}
    `.trim();

    const [scopeRes, invoiceRes] = await Promise.all([
      qwen.chat.completions.create({
        model: MODELS.standard,
        messages: [
          { role: "system", content: SCOPE_PROMPT },
          { role: "user", content: context },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
      qwen.chat.completions.create({
        model: MODELS.standard,
        messages: [
          { role: "system", content: INVOICE_PROMPT },
          { role: "user", content: context },
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    ]);

    const scope_document = scopeRes.choices[0]?.message?.content ?? "";
    const invoice_draft = invoiceRes.choices[0]?.message?.content ?? "";

    if (submission_id) {
      const supabase = getSupabaseAdminClient();
      const { error: dbError } = await (supabase.from("submissions") as any)
        .update({ scope_document, invoice_draft, status: "pending_review" })
        .eq("id", submission_id);

      if (dbError) {
        console.error("Failed to update submission with documents:", dbError);
        return NextResponse.json(
          {
            success: false,
            error: "Documents generated but failed to save to database.",
            detail: dbError.message,
          },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({
      success: true,
      scope_document,
      invoice_draft,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Failed to generate documents", message },
      { status: 500 },
    );
  }
}
