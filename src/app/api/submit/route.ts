import { NextRequest, NextResponse } from "next/server";
import { getQwenClient, MODELS } from "@/lib/qwen";
import { PARSE_PROMPT, VALIDATE_PROMPT } from "@/lib/prompts";
import { getSupabaseClient, getSupabaseAdminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      raw_brief,
      client_name,
      client_email,
      project_type,
      tech_stack,
      starting_point,
      budget_range,
      agency_slug,
    } = body;

    // Validate required fields
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

    // Validate raw_brief is not too short
    if (typeof raw_brief !== "string" || raw_brief.trim().length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: "raw_brief must be at least 10 characters",
        },
        { status: 400 },
      );
    }

    // Validate email format
    if (
      typeof client_email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client_email)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "client_email must be a valid email address",
        },
        { status: 400 },
      );
    }

    // Look up agency if slug is provided
    let agencyId: string | null = null;

    try {
      const supabase = getSupabaseClient();

      if (agency_slug) {
        const { data: agency, error: agencyError } = await supabase
          .from("agencies")
          .select("id")
          .eq("slug", agency_slug)
          .single();

        if (agencyError) {
          return NextResponse.json(
            {
              success: false,
              error: `Agency not found for slug: ${agency_slug}`,
            },
            { status: 404 },
          );
        }

        agencyId = (agency as { id: string }).id;
      } else {
        // No agency slug — still allow unaffiliated submissions
        // (for the landing page demo or direct intake without agency context)
        console.warn(
          "No agency_slug provided — submission will have no agency association",
        );
      }
    } catch (err) {
      // Supabase may not be configured — still allow the AI pipeline to run
      console.error("Failed to look up agency:", err);
    }

    const qwen = getQwenClient();

    // Build context with tech-specific fields
    let briefContext = `Client Name: ${client_name}\nClient Email: ${client_email}\nProject Type: ${project_type ?? "Not specified"}`;
    if (tech_stack) briefContext += `\nPreferred Tech Stack: ${tech_stack}`;
    if (starting_point) briefContext += `\nStarting Point: ${starting_point}`;
    if (budget_range) briefContext += `\nBudget Range: ${budget_range}`;
    briefContext += `\n\nBrief:\n${raw_brief}`;

    // Step 1: Parse the brief using Qwen (standard model)
    const parseCompletion = await qwen.chat.completions.create({
      model: MODELS.standard,
      messages: [
        { role: "system", content: PARSE_PROMPT },
        { role: "user", content: briefContext },
      ],
      temperature: 0.1,
      max_tokens: 1500,
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

    // Step 3: Store in Supabase using service_role key
    // This bypasses RLS so the anon-key intake form can write reliably
    let submissionId: string | null = null;

    try {
      const supabaseAdmin = getSupabaseAdminClient();

      const { data: submission, error: dbError } = await (
        supabaseAdmin.from("submissions") as any
      )
        .insert({
          client_name,
          client_email,
          project_type: project_type ?? (parsed.project_type as string) ?? null,
          raw_brief,
          tech_stack: tech_stack || null,
          starting_point: starting_point || null,
          budget_range: budget_range || null,
          agency_id: agencyId,
          parsed_data: {
            ...parsed,
            tech_stack: tech_stack || (parsed.tech_stack as string) || null,
            starting_point:
              starting_point || (parsed.starting_point as string) || null,
            budget_range:
              budget_range || (parsed.budget_range as string) || null,
          },
          status: validationResult.actionable
            ? "ready_for_analysis"
            : "needs_clarification",
          clarification_questions: validationResult.questions,
        })
        .select()
        .single();

      if (dbError) {
        console.error("Failed to store submission in Supabase:", dbError);
        return NextResponse.json(
          {
            success: false,
            error: "Failed to store your brief. Please try again.",
            detail: dbError.message,
          },
          { status: 500 },
        );
      }

      submissionId = (submission as { id: string }).id;
    } catch (err) {
      console.error("Supabase error during submission storage:", err);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to store your brief. Please try again.",
          detail: err instanceof Error ? err.message : "Unknown error",
        },
        { status: 500 },
      );
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
    console.error("Submit route error:", message);
    return NextResponse.json(
      { success: false, error: "Failed to submit brief", message },
      { status: 500 },
    );
  }
}
