import { AIError } from "../errors/ai-error";
import type { AIProviderName } from "../types/ai.types";
import type { AIProvider } from "./ai-provider";
export class StubProvider implements AIProvider {
  constructor(public readonly name: Exclude<AIProviderName, "mock">) {}
  async chat(): Promise<never> {
    throw new AIError(
      "PROVIDER_NOT_CONFIGURED",
      `${this.name} chưa được cấu hình.`,
    );
  }
  async generateStructured(): Promise<never> {
    throw new AIError(
      "PROVIDER_NOT_CONFIGURED",
      `${this.name} chưa được cấu hình.`,
    );
  }
}
