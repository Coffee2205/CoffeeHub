import "server-only";

import { generateText, jsonSchema, Output, type LanguageModel } from "ai";
import { getAIConfig } from "../config/ai.config";
import { AIError } from "../errors/ai-error";
import { AI_PROMPTS } from "../prompts/prompt-library";
import {
  getStructuredOutputGuide,
  getStructuredOutputSchema,
} from "../prompts/structured-output-guide";
import type {
  AIChatInput,
  AIGenerationOptions,
  AIProviderName,
  RuntimeSchema,
} from "../types/ai.types";
import type { AIProvider } from "./ai-provider";

type RequestInput = Pick<AIChatInput, "action" | "prompt" | "context">;

export class AISdkProvider implements AIProvider {
  readonly configured: boolean;

  constructor(
    readonly name: Exclude<AIProviderName, "mock">,
    private readonly modelId: string,
    apiKey: string | undefined,
    private readonly createModel: (modelId: string) => LanguageModel,
  ) {
    this.configured = Boolean(apiKey?.trim() && modelId.trim());
  }

  async chat(input: AIChatInput) {
    const startedAt = Date.now();
    const result = await this.generate(input, false);
    return {
      text: result.text,
      usage: mapUsage(result.usage),
      metadata: {
        provider: this.name,
        model: this.modelId,
        requestId: result.response.id,
        latencyMs: Date.now() - startedAt,
      },
    };
  }

  async generateStructured<TInput, TOutput>(
    input: TInput,
    schema: RuntimeSchema<TOutput>,
    options?: AIGenerationOptions,
  ) {
    const request = asRequestInput(input);
    const startedAt = Date.now();
    const result = await this.generate(request, true, options);
    try {
      return {
        data: schema.parse(result.output),
        usage: mapUsage(result.usage),
        metadata: {
          provider: this.name,
          model: this.modelId,
          requestId: result.response.id,
          latencyMs: Date.now() - startedAt,
        },
      };
    } catch (error) {
      console.warn("[ai-provider] structured output validation failed", {
        provider: this.name,
        action: request.action,
        validationError:
          error instanceof AIError ? error.message : "Unknown schema error",
      });
      throw new AIError(
        "SCHEMA_VALIDATION_ERROR",
        "Provider trả về proposal không đúng schema.",
      );
    }
  }

  private async generate(
    input: RequestInput,
    structured: boolean,
    options?: AIGenerationOptions,
  ) {
    if (!this.configured) {
      throw new AIError(
        "PROVIDER_NOT_CONFIGURED",
        `${this.name} chưa được cấu hình.`,
        true,
      );
    }
    const config = getAIConfig();
    const prompt = AI_PROMPTS[input.action];
    const structuredGuide = structured
      ? getStructuredOutputGuide(input.action)
      : undefined;
    const structuredSchema = structured
      ? getStructuredOutputSchema(input.action)
      : undefined;
    const controller = new AbortController();
    const timer = setTimeout(
      () => controller.abort(),
      options?.timeoutMs ?? config.timeoutMs,
    );
    try {
      return await generateText({
        model: this.createModel(this.modelId),
        system: [
          prompt.system,
          prompt.safety,
          prompt.outputExpectation,
          structuredGuide
            ? `Return only one valid JSON object matching this exact shape. Do not use Markdown or code fences: ${structuredGuide}`
            : undefined,
        ]
          .filter(Boolean)
          .join("\n"),
        prompt: JSON.stringify({
          request: input.prompt,
          context: input.context,
        }),
        output: structuredSchema
          ? Output.object({
              schema: jsonSchema<Record<string, unknown>>(structuredSchema),
            })
          : structured
            ? Output.json()
            : Output.text(),
        maxOutputTokens: options?.maxOutputTokens ?? config.maxOutputTokens,
        maxRetries: config.retryLimit,
        abortSignal: controller.signal,
      });
    } catch (error) {
      throw normalizeProviderError(error);
    } finally {
      clearTimeout(timer);
    }
  }
}

function asRequestInput(value: unknown): RequestInput {
  if (!value || typeof value !== "object") {
    throw new AIError("INVALID_REQUEST", "AI request không hợp lệ.");
  }
  const input = value as Partial<RequestInput>;
  if (!input.action || typeof input.prompt !== "string") {
    throw new AIError("INVALID_REQUEST", "AI request không hợp lệ.");
  }
  return input as RequestInput;
}

function mapUsage(value: {
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
}) {
  return {
    promptTokens: value.inputTokens,
    completionTokens: value.outputTokens,
    totalTokens: value.totalTokens,
  };
}

export function normalizeProviderError(error: unknown) {
  if (error instanceof AIError) return error;
  if (error instanceof Error && error.name === "AbortError") {
    return new AIError("TIMEOUT", "AI provider đã hết thời gian chờ.", true);
  }
  const status = findStatusCode(error);
  if (status === 429)
    return new AIError(
      "RATE_LIMITED",
      "AI provider đang giới hạn yêu cầu.",
      true,
    );
  if (status === 402)
    return new AIError("QUOTA_EXCEEDED", "AI provider đã hết quota.", true);
  if (status && status >= 500)
    return new AIError(
      "PROVIDER_UNAVAILABLE",
      "AI provider tạm thời không khả dụng.",
      true,
    );
  if (status && status >= 400)
    return new AIError("INVALID_REQUEST", "AI provider từ chối yêu cầu.");
  return new AIError("NETWORK_ERROR", "Không thể kết nối AI provider.", true);
}

function findStatusCode(error: unknown, depth = 0): number | undefined {
  if (!error || typeof error !== "object" || depth > 3) return undefined;
  if ("statusCode" in error) {
    const status = Number(error.statusCode);
    if (Number.isInteger(status)) return status;
  }
  if ("cause" in error) {
    const status = findStatusCode(error.cause, depth + 1);
    if (status) return status;
  }
  if ("errors" in error && Array.isArray(error.errors)) {
    for (const nested of error.errors) {
      const status = findStatusCode(nested, depth + 1);
      if (status) return status;
    }
  }
  return undefined;
}
