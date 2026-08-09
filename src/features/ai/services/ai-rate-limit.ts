import { AIError } from "../errors/ai-error";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;
const buckets = new Map<string, number[]>();

export function checkAIRateLimit(userId: string, now = Date.now()) {
  const recent = (buckets.get(userId) ?? []).filter(
    (timestamp) => timestamp > now - WINDOW_MS,
  );
  if (recent.length >= MAX_REQUESTS)
    throw new AIError(
      "RATE_LIMITED",
      "Bạn đã gửi quá nhiều yêu cầu. Hãy thử lại sau.",
      true,
    );
  recent.push(now);
  buckets.set(userId, recent);
}
