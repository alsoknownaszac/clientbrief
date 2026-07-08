import { NextRequest, NextResponse } from "next/server";
import { getQwenClient, MODELS } from "@/lib/qwen";
import { VALIDATE_PROMPT } from "@/lib/prompts";
import { getSupabaseAdminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { submission_id, parsed_data, clarifications } = body;

    if (!submission_id && !parsed_data) {
      return NextResponse.json(
        {
          success: false,
          error: "Must provide either submission_id or parsed_data",
        },
        { status: 400 },
      );
    }

    // Resolve parsed_data — passed directly, from Supabase, or from sessionStorage
    let resolvedParsedData = parsed_data;

    if (!resolvedParsedData && submission_id) {
      // Try Supabase first
      try {
        const supabase = getSupabaseAdminClient();
        const { data: sub } = await (supabase.from("submissions") as any)
          .select("parsed_data")
          .eq("id", submission_id)
          .single();
        if (sub?.parsed_data) {
          resolvedParsedData = sub.parsed_data;
        }
      } catch {
        // Supabase may not be configured or submission doesn't exist
      }
    }

    const qwen = getQwenClient();

    // Build the prompt content — if we have parsed data, include it.
    // If not, the AI can still evaluate based on clarifications alone.
    let userContent: string;

    if (resolvedParsedData) {
      userContent = JSON.stringify(resolvedParsedData);
      if (clarifications && Array.isArray(clarifications)) {
        userContent = `Parsed Brief: ${JSON.stringify(resolvedParsedData)}\n\nClient Clarifications: ${JSON.stringify(clarifications)}`;
      }
    } else if (clarifications && Array.isArray(clarifications)) {
      // No parsed data available — run validation on clarifications alone
      userContent = `Client Clarifications:\n${clarifications.map((c: string, i: number) => `Q${i + 1}: ${c}`).join("\n")}`;
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "No parsed_data available and no clarifications provided",
        },
        { status: 400 },
      );
    }

    const completion = await qwen.chat.completions.create({
      model: MODELS.fast,
      messages: [
        { role: "system", content: VALIDATE_PROMPT },
        { role: "user", content: userContent },
      ],
      temperature: 0.1,
      max_tokens: 500,
    });

    const rawContent = completion.choices[0]?.message?.content ?? "";
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    let result: { actionable: boolean; questions: string[] };

    try {
      result = JSON.parse(jsonMatch ? jsonMatch[0] : rawContent);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to parse AI response as JSON",
          raw: rawContent,
        },
        { status: 500 },
      );
    }

    // Update Supabase if we have a real submission
    if (submission_id) {
      try {
        const supabase = getSupabaseAdminClient();
        const { error: dbError } = await (supabase.from("submissions") as any)
          .update({
            status: result.actionable
              ? "ready_for_analysis"
              : "needs_clarification",
            clarification_questions: result.questions,
            ...(clarifications && Array.isArray(clarifications)
              ? { clarification_answers: clarifications }
              : {}),
          })
          .eq("id", submission_id);

        if (dbError) {
          console.error(
            "Failed to update submission after clarification:",
            dbError,
          );
        }
      } catch (err) {
        console.error("Supabase error during clarifications update:", err);
      }
    }

    return NextResponse.json({
      success: true,
      actionable: result.actionable,
      questions: result.questions,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Clarify route error:", message);
    return NextResponse.json(
      { success: false, error: "Failed to clarify brief", message },
      { status: 500 },
    );
  }
}
