import { AIError } from "../errors/ai-error";
export const FALLBACK_ERROR_CODES = ["PROVIDER_UNAVAILABLE", "RATE_LIMITED", "QUOTA_EXCEEDED", "TIMEOUT", "NETWORK_ERROR"] as const;
export function canFallback(error: unknown) { return error instanceof AIError && FALLBACK_ERROR_CODES.some((code) => code === error.code); }
