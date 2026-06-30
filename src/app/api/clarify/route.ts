import { NextRequest, NextResponse } from "next/server";
import { getQwenClient, MODELS } from "@/lib/qwen";
import { VALIDATE_PROMPT } from "@/lib/prompts";
import { getSupabaseClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { submission_id, parsed_data, clarifications } = body;

    if (!parsed_data) {
      return NextResponse.json(
        { success: false, error: "Missing parsed_data in request body" },
        { status: 400 },
      );
    }

    const qwen = getQwenClient();

    let userContent = JSON.stringify(parsed_data);

    if (clarifications && Array.isArray(clarifications)) {
      userContent = `Parsed Brief: ${JSON.stringify(parsed_data)}\n\nClient Clarifications: ${JSON.stringify(clarifications)}`;
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

    if (submission_id) {
      try {
        const supabase = getSupabaseClient();
        await (supabase.from("submissions") as any)
          .update({
            status: result.actionable
              ? "ready_for_analysis"
              : "needs_clarification",
            clarification_questions: result.questions,
          })
          .eq("id", submission_id);
      } catch {
        // Supabase not configured
      }
    }

    return NextResponse.json({
      success: true,
      actionable: result.actionable,
      questions: result.questions,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Failed to clarify brief", message },
      { status: 500 },
    );
  }
}
