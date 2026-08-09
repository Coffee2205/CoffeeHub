import assert from "node:assert/strict";
import test from "node:test";
import { AIError } from "../src/features/ai/errors/ai-error";
import type { AIProvider } from "../src/features/ai/providers/ai-provider";
import { runWithProviderFallback } from "../src/features/ai/services/ai-orchestrator";
import type {
  AIChatInput,
  AIProviderName,
} from "../src/features/ai/types/ai.types";

class TestProvider implements AIProvider {
  readonly configured = true;

  constructor(
    readonly name: AIProviderName,
    private readonly failure?: AIError,
  ) {}

  async chat() {
    if (this.failure) throw this.failure;
    return {
      text: "ok",
      usage: {},
      metadata: { provider: this.name, model: `${this.name}-test` },
    };
  }

  async generateStructured(): Promise<never> {
    throw new Error("Not used by this test");
  }
}

const input: AIChatInput = { action: "chat", prompt: "test" };

test("provider fallback preserves priority and attempt metadata", async () => {
  const providers = [
    new TestProvider("openai", new AIError("RATE_LIMITED", "limited", true)),
    new TestProvider("groq"),
    new TestProvider("gemini"),
  ];
  const result = await runWithProviderFallback(
    (provider) => provider.chat(input),
    providers,
  );
  assert.equal(result.metadata.provider, "groq");
  assert.equal(result.metadata.fallbackUsed, true);
  assert.deepEqual(
    result.metadata.attempts?.map((attempt) => attempt.provider),
    ["openai", "groq"],
  );
});

test("provider fallback stops on a non-fallback error", async () => {
  const providers = [
    new TestProvider("openai", new AIError("INVALID_REQUEST", "invalid")),
    new TestProvider("groq"),
  ];
  await assert.rejects(
    () =>
      runWithProviderFallback((provider) => provider.chat(input), providers),
    (error) => error instanceof AIError && error.code === "INVALID_REQUEST",
  );
});
