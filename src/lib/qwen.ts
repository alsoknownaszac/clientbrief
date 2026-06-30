import OpenAI from "openai";

const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY;
const QWEN_BASE_URL =
  process.env.QWEN_BASE_URL ||
  "https://dashscope-intl.aliyuncs.com/compatible-mode/v1";

// Validate required env vars at module load time (server-side only)
if (typeof window === "undefined") {
  if (!DASHSCOPE_API_KEY) {
    throw new Error(
      "DASHSCOPE_API_KEY is not set. Add it to your .env.local file.\n" +
        "Get your API key from https://bailian.console.aliyun.com",
    );
  }
  if (!QWEN_BASE_URL) {
    throw new Error(
      "QWEN_BASE_URL is not set. Add it to your .env.local file.\n" +
        "Default: https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
    );
  }
}

export const MODELS = {
  fast: "qwen3.6-flash",
  standard: "qwen3.7-plus",
  reasoning: "qwen3.7-max",
} as const;

let _qwen: OpenAI | null = null;

export function getQwenClient(): OpenAI {
  if (!_qwen) {
    _qwen = new OpenAI({
      apiKey: DASHSCOPE_API_KEY,
      baseURL: QWEN_BASE_URL,
    });
  }
  return _qwen;
}

// Legacy compatibility — raw fetch-based client
interface QwenMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface QwenRequest {
  model: string;
  messages: QwenMessage[];
  temperature?: number;
  max_tokens?: number;
}

interface QwenResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export async function qwenChat(
  messages: QwenMessage[],
  options?: { temperature?: number; max_tokens?: number },
): Promise<string> {
  if (!DASHSCOPE_API_KEY) {
    throw new Error(
      "DASHSCOPE_API_KEY is not set. Add it to your .env.local file.",
    );
  }

  const body: QwenRequest = {
    model: MODELS.standard,
    messages,
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.max_tokens ?? 2048,
  };

  const response = await fetch(`${QWEN_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DASHSCOPE_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(
      `Qwen API error: ${response.status} ${response.statusText}`,
    );
  }

  const data: QwenResponse = await response.json();
  return data.choices[0]?.message?.content ?? "";
}
