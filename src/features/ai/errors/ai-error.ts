export const AI_ERROR_CODES = [
  "AI_DISABLED",
  "PROVIDER_NOT_CONFIGURED",
  "PROVIDER_UNAVAILABLE",
  "RATE_LIMITED",
  "QUOTA_EXCEEDED",
  "TIMEOUT",
  "NETWORK_ERROR",
  "INVALID_REQUEST",
  "INVALID_STRUCTURED_OUTPUT",
  "SCHEMA_VALIDATION_ERROR",
  "CONTEXT_TOO_LARGE",
  "ACTION_NOT_ALLOWED",
  "CONFIRMATION_REQUIRED",
  "UNKNOWN_AI_ERROR",
] as const;
export type AIErrorCode = (typeof AI_ERROR_CODES)[number];

export class AIError extends Error {
  constructor(
    public readonly code: AIErrorCode,
    message: string,
    public readonly retryable = false,
  ) {
    super(message);
    this.name = "AIError";
  }
}

export function safeAIError(error: unknown): {
  code: AIErrorCode;
  message: string;
} {
  if (error instanceof AIError)
    return { code: error.code, message: error.message };
  return {
    code: "UNKNOWN_AI_ERROR",
    message: "Không thể tạo AI Proposal. Hãy thử lại sau.",
  };
}
