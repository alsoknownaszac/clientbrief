import { NextRequest, NextResponse } from "next/server";
import { getQwenClient, MODELS } from "@/lib/qwen";
import { PARSE_PROMPT, VALIDATE_PROMPT } from "@/lib/prompts";
import { getSupabaseClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { raw_brief, client_name, client_email, project_type } = body;

    if (!raw_brief || !client_name || !client_email) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: raw_brief, client_name, client_email",
        },
        { status: 400 },
      );
    }

    const qwen = getQwenClient();

    // Step 1: Parse the brief using Qwen (standard model)
    const parseCompletion = await qwen.chat.completions.create({
      model: MODELS.standard,
      messages: [
        { role: "system", content: PARSE_PROMPT },
        {
          role: "user",
          content: `Client Name: ${client_name}\nClient Email: ${client_email}\nProject Type: ${project_type ?? "Not specified"}\n\nBrief:\n${raw_brief}`,
        },
      ],
      temperature: 0.1,
      max_tokens: 1000,
    });

    const parseRawContent = parseCompletion.choices[0]?.message?.content ?? "";
    let parsed: Record<string, unknown>;

    try {
      const jsonMatch = parseRawContent.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : parseRawContent);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to parse AI response as JSON",
          raw: parseRawContent,
        },
        { status: 500 },
      );
    }

    // Step 2: Validate the parsed brief using Qwen (fast model)
    const validateCompletion = await qwen.chat.completions.create({
      model: MODELS.fast,
      messages: [
        { role: "system", content: VALIDATE_PROMPT },
        { role: "user", content: JSON.stringify(parsed) },
      ],
      temperature: 0.1,
      max_tokens: 500,
    });

    const validateRawContent =
      validateCompletion.choices[0]?.message?.content ?? "";
    const validateJsonMatch = validateRawContent.match(/\{[\s\S]*\}/);
    let validationResult: { actionable: boolean; questions: string[] };

    try {
      validationResult = JSON.parse(
        validateJsonMatch ? validateJsonMatch[0] : validateRawContent,
      );
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to parse validation AI response as JSON",
          raw: validateRawContent,
        },
        { status: 500 },
      );
    }

    // Step 3: Store in Supabase
    let submissionId = "demo-" + Date.now();

    try {
      const supabase = getSupabaseClient();
      const { data: submission, error: dbError } = await (
        supabase.from("submissions") as any
      )
        .insert({
          client_name,
          client_email,
          project_type: project_type ?? (parsed.project_type as string) ?? null,
          raw_brief,
          parsed_data: parsed,
          status: validationResult.actionable
            ? "ready_for_analysis"
            : "needs_clarification",
          clarification_questions: validationResult.questions,
        })
        .select()
        .single();

      if (!dbError && submission) {
        submissionId = (submission as { id: string }).id;
      }
    } catch {
      // Supabase not configured — return demo response
    }

    return NextResponse.json({
      success: true,
      submission_id: submissionId,
      parsed,
      actionable: validationResult.actionable,
      questions: validationResult.questions,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: "Failed to submit brief", message },
      { status: 500 },
    );
  }
}
