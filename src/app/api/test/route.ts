import { NextResponse } from "next/server";
import { getQwenClient, MODELS } from "@/lib/qwen";

export async function GET() {
  const apiKey = process.env.DASHSCOPE_API_KEY;

  // If no API key is set, return a clear error immediately
  if (!apiKey) {
    return NextResponse.json(
      {
        success: false,
        error:
          "DASHSCOPE_API_KEY is not configured. Create a .env.local file and add DASHSCOPE_API_KEY=your-key-here",
        hint: "Get your API key from https://bailian.console.aliyun.com",
      },
      { status: 400 },
    );
  }

  try {
    const qwen = getQwenClient();

    const completion = await qwen.chat.completions.create({
      model: MODELS.standard,
      messages: [
        {
          role: "system",
          content:
            "You are being tested. Respond with ONLY a valid JSON object. Do not include markdown, backticks, or any other text.",
        },
        {
          role: "user",
          content: `Respond with a JSON object containing: { status: "connected", model: "qwen3.7-plus", message: "Qwen Cloud API is working correctly" }`,
        },
      ],
      temperature: 0,
      max_tokens: 200,
    });

    const rawContent = completion.choices[0]?.message?.content ?? "";

    // Try to parse the response as JSON
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      // If the model returned extra text around the JSON, try to extract it
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        return NextResponse.json(
          {
            success: false,
            error: "Qwen responded but the output was not valid JSON",
            raw: rawContent,
          },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: parsed,
      usage: {
        model: completion.model,
        prompt_tokens: completion.usage?.prompt_tokens ?? 0,
        completion_tokens: completion.usage?.completion_tokens ?? 0,
        total_tokens: completion.usage?.total_tokens ?? 0,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const cause =
      error instanceof Error && error.cause ? String(error.cause) : undefined;

    return NextResponse.json(
      {
        success: false,
        error: "Failed to call Qwen Cloud API",
        message,
        ...(cause ? { cause } : {}),
        hints: [
          "Verify your DASHSCOPE_API_KEY is correct",
          "Check if the model 'qwen3.7-plus' is available on your plan",
          "Ensure your API key has sufficient quota",
        ],
      },
      { status: 500 },
    );
  }
}
