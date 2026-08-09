import "server-only";
import type { AIProviderName } from "../types/ai.types";

const providerNames: AIProviderName[] = ["openai", "groq", "gemini", "mock"];
const bool = (value: string | undefined, fallback: boolean) =>
  value === undefined ? fallback : value === "true";
const integer = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};
const provider = (
  value: string | undefined,
  fallback: AIProviderName,
): AIProviderName =>
  providerNames.includes(value as AIProviderName)
    ? (value as AIProviderName)
    : fallback;

export function getAIConfig() {
  const order = (process.env.AI_PROVIDER_FALLBACK_ORDER ?? "openai,groq,gemini")
    .split(",")
    .map((item) => provider(item.trim(), "mock"));
  return {
    enabled: bool(
      process.env.AI_ENABLED,
      process.env.NODE_ENV !== "production",
    ),
    useMockProvider: bool(
      process.env.AI_USE_MOCK_PROVIDER,
      process.env.NODE_ENV !== "production",
    ),
    defaultProvider: provider(
      process.env.DEFAULT_AI_PROVIDER ?? process.env.AI_DEFAULT_PROVIDER,
      "openai",
    ),
    providerOrder: [...new Set(order)],
    models: {
      openai: process.env.OPENAI_DEFAULT_MODEL || "gpt-5-mini",
      groq: process.env.GROQ_DEFAULT_MODEL || "openai/gpt-oss-20b",
      gemini: process.env.GEMINI_DEFAULT_MODEL || "gemini-2.5-flash",
      mock: "mock-planner-v1",
    },
    timeoutMs: integer(process.env.AI_REQUEST_TIMEOUT_MS, 30_000),
    retryLimit: integer(process.env.AI_RETRY_LIMIT, 1),
    maxOutputTokens: integer(process.env.AI_MAX_OUTPUT_TOKENS, 4_000),
    contextTokenLimit: integer(process.env.AI_CONTEXT_TOKEN_LIMIT, 8_000),
    payloadMaxCharacters: integer(process.env.AI_PAYLOAD_MAX_CHARACTERS, 4_000),
    streamingEnabled: bool(process.env.AI_STREAMING_ENABLED, false),
    loggingEnabled: bool(process.env.AI_LOGGING_ENABLED, false),
    providerKeys: {
      openai: process.env.OPENAI_API_KEY,
      groq: process.env.GROQ_API_KEY,
      gemini: process.env.GEMINI_API_KEY,
    },
  } as const;
}
