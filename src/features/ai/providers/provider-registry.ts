import "server-only";
import { getAIConfig } from "../config/ai.config";
import { AIError } from "../errors/ai-error";
import type { AIProviderName } from "../types/ai.types";
import type { AIProvider } from "./ai-provider";
import { MockAIProvider } from "./mock.provider";
import { StubProvider } from "./stub.provider";
const providers: Record<AIProviderName, AIProvider> = { openai: new StubProvider("openai"), groq: new StubProvider("groq"), gemini: new StubProvider("gemini"), mock: new MockAIProvider() };
export function getProvider(name: AIProviderName) { return providers[name]; }
export function getConfiguredProvider() { const config = getAIConfig(); if (config.useMockProvider) return providers.mock; if (!config.enabled) throw new AIError("AI_DISABLED", "AI thật chưa được bật."); return providers[config.defaultProvider]; }
export function providerFallbackOrder() { return getAIConfig().providerOrder.map(getProvider); }
