import "server-only";

import { getProvider } from "../providers/provider-registry";
import type { ChatMode } from "./chat.types";
import { buildChatContext, defaultAISettings } from "./chat.repository";

export async function generateAssistantReply(input: {
  userId: string;
  prompt: string;
  mode: ChatMode;
  settings?: typeof defaultAISettings;
  simulateError?: boolean;
}) {
  if (input.simulateError) throw new Error("Mô phỏng lỗi phản hồi AI.");
  const settings = input.settings ?? defaultAISettings;
  const context = await buildChatContext(input.userId, settings);
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
  const base = await getProvider("mock").chat({
    action: "chat",
    prompt: input.prompt,
    context: {
      user: { locale: "vi", timezone: "Asia/Ho_Chi_Minh" },
      workspace: {
        activeGoalCount: context.goals.length,
        activeTaskCount: context.tasks.length,
      },
      tasks: context.tasks.map((task) => ({
        title: task.title,
        status: task.status,
        dueDate: task.dueAt?.toISOString(),
      })),
      notes: {
        noteCount: context.notes.length,
        excerpts: context.notes.map((note) => `${note.title}: ${note.excerpt}`),
      },
      tokenBudget: 8_000,
    },
  });
  const response = formatModeResponse(
    input.mode,
    input.prompt,
    context,
    base.text,
  );
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
            (task, index) => `${index + 1}. ${task.title} — ${task.status}`,
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
