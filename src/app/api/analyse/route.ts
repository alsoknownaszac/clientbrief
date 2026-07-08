import { NextRequest, NextResponse } from "next/server";
import { getQwenClient, MODELS } from "@/lib/qwen";
import { ANALYSE_PROMPT } from "@/lib/prompts";
import { getSupabaseAdminClient } from "@/lib/supabase";

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

    const userContent = `
Brief Data: ${JSON.stringify(parsed_data)}
${clarifications ? `Client Clarifications: ${JSON.stringify(clarifications)}` : ""}
    `.trim();

    const completion = await qwen.chat.completions.create({
      model: MODELS.reasoning,
      messages: [
        { role: "system", content: ANALYSE_PROMPT },
        { role: "user", content: userContent },
      ],
      temperature: 0.2,
      max_tokens: 2000,
    });

    const rawContent = completion.choices[0]?.message?.content ?? "";
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    let analysis: Record<string, unknown>;

    try {
      analysis = JSON.parse(jsonMatch ? jsonMatch[0] : rawContent);
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
      const supabase = getSupabaseAdminClient();
      const { error: dbError } = await (supabase.from("submissions") as any)
        .update({ analysis, status: "analysed" })
        .eq("id", submission_id);

      if (dbError) {
        console.error("Failed to update submission with analysis:", dbError);
        return NextResponse.json(
          {
            success: false,
            error: "Analysis generated but failed to save to database.",
            detail: dbError.message,
          },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Failed to analyse brief", message },
      { status: 500 },
    );
  }
}
