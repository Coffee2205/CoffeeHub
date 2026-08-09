import { AIError } from "../errors/ai-error";
import type { AIProvider } from "../providers/ai-provider";
import type { AIProviderMetadata } from "../types/ai.types";
import { canFallback } from "./fallback-policy";

export async function runWithProviderFallback<
  T extends { metadata: AIProviderMetadata },
>(
  operation: (provider: AIProvider) => Promise<T>,
  providers: AIProvider[],
): Promise<T> {
  const attempts: NonNullable<AIProviderMetadata["attempts"]> = [];
  let lastError: unknown;
  for (const provider of providers) {
    try {
      const result = await operation(provider);
      attempts.push({ provider: provider.name, status: "success" });
      result.metadata.fallbackUsed = attempts.length > 1;
      result.metadata.attempts = attempts;
      return result;
    } catch (error) {
      lastError = error;
      attempts.push({
        provider: provider.name,
        status: "failed",
        errorCode: error instanceof AIError ? error.code : "UNKNOWN_AI_ERROR",
      });
      if (!canFallback(error)) throw error;
    }
  }
  throw (
    lastError ??
    new AIError("PROVIDER_UNAVAILABLE", "Không có AI provider khả dụng.")
  );
}
