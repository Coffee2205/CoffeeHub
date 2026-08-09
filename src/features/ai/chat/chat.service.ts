import "server-only";

import { AI_ACTIONS } from "../actions/ai-actions";
import { runWithProviderFallback } from "../services/ai-orchestrator";
import { getProviderCandidates } from "../providers/provider-registry";
import type { ChatMode } from "./chat.types";
import { buildChatContext, defaultAISettings } from "./chat.repository";
import { resolveConversationPlanningContext } from "../context/planning-entity-resolver";

export async function generateAssistantReply(input: {
  userId: string;
  prompt: string;
  mode: ChatMode;
  conversationId?: string;
  settings?: typeof defaultAISettings;
  simulateError?: boolean;
}) {
  if (input.simulateError) throw new Error("Mô phỏng lỗi phản hồi AI.");
  const settings = input.settings ?? defaultAISettings;
  const context = await buildChatContext(input.userId, settings);
  const sourceContext = input.conversationId
    ? await resolveConversationPlanningContext(
        input.userId,
        input.conversationId,
      )
    : undefined;
  const summary = [
    settings.includeGoals
      ? `${context.goals.length} Goal gần nhất`
      : "Goal: tắt",
    settings.includeTasks
      ? `${context.tasks.length} Task gần nhất`
      : "Task: tắt",
    settings.includeNotes
      ? `${context.notes.length} Note gần nhất`
      : "Note: tắt",
  ];
  const action =
    input.mode === "daily_plan"
      ? AI_ACTIONS.CREATE_DAILY_PLAN
      : input.mode === "weekly_review"
        ? AI_ACTIONS.CREATE_WEEKLY_PLAN
        : input.mode === "note_summary"
          ? AI_ACTIONS.SUMMARIZE_NOTES
          : AI_ACTIONS.CHAT;
  const base = await runWithProviderFallback(
    (provider) =>
      provider.chat({
        action,
        prompt: input.prompt,
        context: {
          user: { locale: "vi", timezone: "Asia/Ho_Chi_Minh" },
          workspace: {
            activeGoalCount: context.goals.length,
            activeTaskCount: context.tasks.length,
          },
          tasks: context.tasks.map((task) => ({
            id: task.id,
            title: task.title,
            status: task.status,
            dueDate: task.dueAt?.toISOString(),
            goalId: task.goalId ?? undefined,
            roadmapId: task.roadmapId ?? undefined,
            stageId: task.roadmapStageId ?? undefined,
          })),
          notes: {
            noteCount: context.notes.length,
            excerpts: context.notes.map(
              (note) => `${note.title}: ${note.excerpt}`,
            ),
          },
          sourceContext,
          tokenBudget: 8_000,
        },
      }),
    getProviderCandidates(),
  );
  const response =
    base.metadata.provider === "mock"
      ? formatModeResponse(input.mode, input.prompt, context, base.text)
      : base.text;
  return { response, summary, metadata: base.metadata };
}

function formatModeResponse(
  mode: ChatMode,
  prompt: string,
  context: Awaited<ReturnType<typeof buildChatContext>>,
  fallback: string,
) {
  if (mode === "daily_plan") {
    const tasks = context.tasks.slice(0, 5);
    return [
      "Kế hoạch hôm nay (bản đọc, chưa thay đổi dữ liệu):",
      ...(tasks.length
        ? tasks.map(
            (task, index) =>
              `${index + 1}. ${task.title} — ${task.status} — Linked Task: ${task.id}`,
          )
        : [
            "1. Chưa có Task trong context; hãy tạo Task hoặc bật Task context.",
          ]),
      `Ưu tiên theo yêu cầu: ${prompt}`,
    ].join("\n");
  }
  if (mode === "weekly_review")
    return `Tổng kết tuần (bản đọc): ${context.goals.length} Goal, ${context.tasks.length} Task trong context. Hãy rà các Task COMPLETED/BLOCKED trước khi lập tuần mới. Yêu cầu: ${prompt}`;
  if (mode === "note_summary")
    return context.notes.length
      ? `Tóm tắt Note (tối đa 5 note, mỗi excerpt 200 ký tự):\n${context.notes.map((note) => `- ${note.title}: ${note.excerpt}`).join("\n")}`
      : "Không có Note trong context. Bật Note context trong AI settings để tóm tắt.";
  return `${fallback}\n\nContext tối thiểu: ${context.goals.length} Goal, ${context.tasks.length} Task, ${context.notes.length} Note.`;
}
