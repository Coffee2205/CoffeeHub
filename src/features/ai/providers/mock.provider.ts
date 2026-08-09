import { AI_ACTIONS } from "../actions/ai-actions";
import { AIError } from "../errors/ai-error";
import type {
  AIChatInput,
  AIChatResult,
  AIGenerationOptions,
  AIProviderResult,
  AIStreamChunk,
  RuntimeSchema,
} from "../types/ai.types";
import type { AIProvider } from "./ai-provider";
type MockRequest = { action: string; prompt: string; simulateError?: boolean };
const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));
export class MockAIProvider implements AIProvider {
  readonly name = "mock" as const;
  async chat(input: AIChatInput): Promise<AIChatResult> {
    await wait(250);
    return {
      text: `[Development mock] ${input.prompt}`,
      usage: { promptTokens: 12, completionTokens: 18, totalTokens: 30 },
      metadata: { provider: "mock", model: "mock-chat-v1", latencyMs: 250 },
    };
  }
  async *streamChat(input: AIChatInput): AsyncIterable<AIStreamChunk> {
    yield { type: "text", value: "[Development mock] " };
    yield { type: "text", value: input.prompt };
    yield { type: "done", value: "" };
  }
  async generateStructured<TInput, TOutput>(
    input: TInput,
    schema: RuntimeSchema<TOutput>,
    options?: AIGenerationOptions,
  ): Promise<AIProviderResult<TOutput>> {
    const request = input as MockRequest;
    if (request.simulateError)
      throw new AIError(
        "PROVIDER_UNAVAILABLE",
        "Lỗi mock được bật để kiểm tra error state.",
        true,
      );
    await wait(Math.min(options?.timeoutMs ?? 350, 350));
    const source = request.prompt.trim().slice(0, 120);
    const payload =
      request.action === AI_ACTIONS.ANALYZE_GOAL
        ? {
            summary: `Phân tích yêu cầu: ${source}`,
            objective: source || "Làm rõ mục tiêu cần lập kế hoạch",
            constraints: [
              "Phạm vi, nguồn lực và thời hạn cần được owner xác nhận",
            ],
            successCriteria: [
              "Kết quả cuối có tiêu chí đo lường được",
              "Mốc hoàn thành và người chịu trách nhiệm được xác định",
            ],
            assumptions: [
              "Yêu cầu hiện tại là nguồn thông tin duy nhất của bản phân tích mock",
            ],
            risks: [
              "Thiếu dữ liệu về thời hạn hoặc nguồn lực có thể làm kế hoạch thiếu thực tế",
            ],
            clarifyingQuestions: [
              "Thời hạn mong muốn là khi nào?",
              "Nguồn lực hoặc giới hạn nào phải được giữ cố định?",
            ],
            recommendedNextSteps: [
              "Trả lời các câu hỏi còn thiếu",
              "Xác nhận tiêu chí thành công trước khi tạo Goal proposal",
            ],
          }
        : request.action === AI_ACTIONS.CREATE_GOAL_PROPOSAL
          ? {
              title: source || "Mục tiêu development mock",
              description:
                "Proposal mẫu được tạo cục bộ. Chưa có dữ liệu nào được lưu.",
              priority: "HIGH",
              targetDate: "2026-12-31",
              successCriteria: [
                "Xác định kết quả có thể kiểm chứng",
                "Chia nhỏ thành roadmap và task",
              ],
              assumptions: ["Owner sẽ xem và chỉnh proposal trước khi lưu"],
              risks: ["Ước lượng cần được xác minh bằng dữ liệu thực tế"],
            }
          : request.action === AI_ACTIONS.CREATE_ROADMAP_PROPOSAL
            ? {
                title: source || "Roadmap development mock",
                description: "Roadmap mẫu chưa được lưu.",
                estimatedDurationDays: 30,
                stages: [
                  {
                    title: "Khởi động",
                    description: "Xác nhận phạm vi",
                    order: 1,
                    estimatedDays: 7,
                    tasks: [
                      {
                        title: "Chốt tiêu chí",
                        priority: "MEDIUM",
                        estimatedMinutes: 45,
                      },
                    ],
                  },
                ],
              }
            : request.action === AI_ACTIONS.CREATE_TASK_PROPOSAL
              ? {
                  title: source || "Task development mock",
                  description: "Task mẫu chưa được lưu.",
                  priority: "MEDIUM",
                  estimatedMinutes: 60,
                  dueDate: "2026-12-31",
                  roadmapStageReference: "Khởi động",
                }
              : null;
    if (!payload)
      throw new AIError(
        "ACTION_NOT_ALLOWED",
        "Mock UI hiện chỉ hỗ trợ phân tích Goal và các proposal đã được bật.",
      );
    return {
      data: schema.parse(payload),
      usage: {
        promptTokens: 24,
        completionTokens: 64,
        totalTokens: 88,
        estimatedCost: 0,
        currency: "USD",
      },
      metadata: {
        provider: "mock",
        model: "mock-planner-v1",
        latencyMs: 350,
        fallbackUsed: false,
      },
    };
  }
}
