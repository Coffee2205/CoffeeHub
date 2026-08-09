"use server";

import { requireUser } from "@/lib/supabase/auth";
import {
  archiveConversation,
  clearAIHistory,
  defaultAISettings,
  getAssistantData,
  loadConversation,
  persistChatTurn,
  renameConversation,
  saveAISettings,
} from "./chat.repository";
import { generateAssistantReply } from "./chat.service";
import type { AISettingsView, ChatActionState, ChatMode } from "./chat.types";
import { checkAIRateLimit } from "../services/ai-rate-limit";
import { safeAIError } from "../errors/ai-error";

const text = (form: FormData, key: string) =>
  String(form.get(key) ?? "").trim();

export async function sendChatAction(form: FormData): Promise<ChatActionState> {
  const user = await requireUser();
  const prompt = text(form, "prompt");
  const mode = text(form, "mode") as ChatMode;
  if (prompt.length < 2 || prompt.length > 4_000)
    return { status: "error", error: "Tin nhắn phải có 2–4.000 ký tự." };
  const data = await getAssistantData(user.id);
  if (!data.settings.enabled)
    return { status: "error", error: "AI đang bị tắt trong Settings." };
  try {
    checkAIRateLimit(user.id);
    const result = await generateAssistantReply({
      userId: user.id,
      prompt,
      mode: ["chat", "daily_plan", "weekly_review", "note_summary"].includes(
        mode,
      )
        ? mode
        : "chat",
      settings: data.settings,
      simulateError: form.get("simulateError") === "on",
    });
    if (!data.settings.historyEnabled)
      return {
        status: "success",
        contextSummary: result.summary,
        message: {
          id: crypto.randomUUID(),
          role: "ASSISTANT",
          content: result.response,
          createdAt: new Date().toISOString(),
        },
        provider: result.metadata.provider,
        model: result.metadata.model,
        fallbackUsed: result.metadata.fallbackUsed,
      };
    const saved = await persistChatTurn({
      userId: user.id,
      conversationId: text(form, "conversationId") || undefined,
      prompt,
      response: result.response,
      contextSummary: result.summary,
      retentionDays: data.settings.retentionDays,
    });
    return {
      status: "success",
      conversationId: saved.conversation.id,
      contextSummary: result.summary,
      message: {
        id: saved.message.id,
        role: saved.message.role,
        content: saved.message.content,
        createdAt: saved.message.createdAt.toISOString(),
      },
      provider: result.metadata.provider,
      model: result.metadata.model,
      fallbackUsed: result.metadata.fallbackUsed,
    };
  } catch (error) {
    return {
      status: "error",
      error: safeAIError(error).message,
    };
  }
}

export async function loadConversationAction(id: string) {
  const user = await requireUser();
  return (await loadConversation(user.id, id)).map((message) => ({
    id: message.id,
    role: message.role,
    content: message.content,
    createdAt: message.createdAt.toISOString(),
  }));
}

export async function renameConversationAction(id: string, title: string) {
  const user = await requireUser();
  const value = title.trim();
  if (!value || value.length > 160) return false;
  return (await renameConversation(user.id, id, value)).count === 1;
}

export async function archiveConversationAction(id: string) {
  const user = await requireUser();
  return (await archiveConversation(user.id, id)).count === 1;
}

export async function saveAISettingsAction(form: FormData) {
  const user = await requireUser();
  const retentionDays = Number(text(form, "retentionDays"));
  const settings: AISettingsView = {
    enabled: form.get("enabled") === "on",
    historyEnabled: form.get("historyEnabled") === "on",
    includeGoals: form.get("includeGoals") === "on",
    includeTasks: form.get("includeTasks") === "on",
    includeNotes: form.get("includeNotes") === "on",
    retentionDays:
      Number.isInteger(retentionDays) &&
      retentionDays >= 1 &&
      retentionDays <= 365
        ? retentionDays
        : defaultAISettings.retentionDays,
  };
  await saveAISettings(user.id, settings);
}

export async function clearAIHistoryAction(form: FormData) {
  const user = await requireUser();
  if (text(form, "confirmation") !== "XOA LICH SU") return false;
  await clearAIHistory(user.id);
  return true;
}
