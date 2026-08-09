import "server-only";

import { createGoogle } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { createOpenAI } from "@ai-sdk/openai";
import { getAIConfig } from "../config/ai.config";
import { AIError } from "../errors/ai-error";
import type { AIProviderName } from "../types/ai.types";
import type { AIProvider } from "./ai-provider";
import { MockAIProvider } from "./mock.provider";
import { AISdkProvider } from "./sdk.provider";

function buildProviders(): Record<AIProviderName, AIProvider> {
  const config = getAIConfig();
  const openai = createOpenAI({ apiKey: config.providerKeys.openai });
  const groq = createGroq({ apiKey: config.providerKeys.groq });
  const google = createGoogle({ apiKey: config.providerKeys.gemini });
  return {
    openai: new AISdkProvider(
      "openai",
      config.models.openai,
      config.providerKeys.openai,
      openai,
    ),
    groq: new AISdkProvider(
      "groq",
      config.models.groq,
      config.providerKeys.groq,
      groq,
    ),
    gemini: new AISdkProvider(
      "gemini",
      config.models.gemini,
      config.providerKeys.gemini,
      google,
    ),
    mock: new MockAIProvider(),
  };
}

export function getProvider(name: AIProviderName) {
  return buildProviders()[name];
}

export function getProviderCandidates() {
  const config = getAIConfig();
  if (!config.enabled) throw new AIError("AI_DISABLED", "AI chưa được bật.");
  const providers = buildProviders();
  const names = [config.defaultProvider, ...config.providerOrder].filter(
    (name, index, values) => values.indexOf(name) === index,
  );
  const candidates = names
    .filter((name) => name !== "mock")
    .map((name) => providers[name])
    .filter((provider) => provider.configured);
  if (config.useMockProvider) candidates.push(providers.mock);
  if (!candidates.length)
    throw new AIError(
      "PROVIDER_NOT_CONFIGURED",
      "Không có AI provider khả dụng.",
      true,
    );
  return candidates;
}

export function getProviderSummary() {
  const config = getAIConfig();
  const providers = buildProviders();
  const available = config.providerOrder.filter(
    (name) => name !== "mock" && providers[name].configured,
  );
  return {
    primary: available[0] ?? (config.useMockProvider ? "mock" : null),
    available,
    mockEnabled: config.useMockProvider,
  };
}
