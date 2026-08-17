import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/prisma";
import type { AISettingsView } from "./chat.types";

export const defaultAISettings: AISettingsView = {
  enabled: true,
  historyEnabled: true,
  includeGoals: true,
  includeTasks: true,
  includeNotes: false,
  retentionDays: 30,
};

export async function getAssistantData(
  userId: string,
  conversationId?: string,
) {
  const prisma = getPrisma();
  const [settings, conversations] = await Promise.all([
    prisma.aISetting.findUnique({ where: { userId } }),
    prisma.aIConversation.findMany({
      where: { userId, archivedAt: null },
      orderBy: { updatedAt: "desc" },
      take: 30,
    }),
  ]);
  const selectedId = conversationId ?? conversations[0]?.id;
  const messages = selectedId
    ? await prisma.aIMessage.findMany({
        where: { userId, conversationId: selectedId },
        orderBy: { createdAt: "asc" },
        take: 100,
      })
    : [];
  return {
    settings: settings ?? defaultAISettings,
    conversations,
    selectedId,
    messages,
  };
}

export function loadConversation(userId: string, conversationId: string) {
  return getPrisma().aIMessage.findMany({
    where: {
      userId,
      conversationId,
      conversation: { userId, archivedAt: null },
    },
    orderBy: { createdAt: "asc" },
    take: 100,
  });
}

export function renameConversation(userId: string, id: string, title: string) {
  return getPrisma().aIConversation.updateMany({
    where: { id, userId, archivedAt: null },
    data: { title, version: { increment: 1 } },
  });
}

export function archiveConversation(userId: string, id: string) {
  return getPrisma().aIConversation.updateMany({
    where: { id, userId, archivedAt: null },
    data: { archivedAt: new Date(), version: { increment: 1 } },
  });
}

export function saveAISettings(userId: string, settings: AISettingsView) {
  return getPrisma().aISetting.upsert({
    where: { userId },
    create: { userId, ...settings },
    update: { ...settings, version: { increment: 1 } },
  });
}

export function clearAIHistory(userId: string) {
  return getPrisma().$transaction(async (tx) => {
    await tx.aIMessage.deleteMany({ where: { userId } });
    await tx.aIConversation.deleteMany({ where: { userId } });
  });
}

export async function buildChatContext(
  userId: string,
  settings: AISettingsView,
) {
  const prisma = getPrisma();
  const [goals, tasks, notes, stages, events] = await Promise.all([
    settings.includeGoals
      ? prisma.goal.findMany({
          where: { userId, deletedAt: null },
          select: { id: true, title: true, status: true, startsAt: true, deadline: true },
          orderBy: { updatedAt: "desc" },
          take: 10,
        })
      : [],
    settings.includeTasks
      ? prisma.task.findMany({
          where: { userId, deletedAt: null },
          select: {
            id: true,
            title: true,
            status: true,
            dueAt: true,
            goalId: true,
            roadmapId: true,
            roadmapStageId: true,
            isOptional: true,
            expectedResult: true,
          },
          orderBy: { updatedAt: "desc" },
          take: 10,
        })
      : [],
    settings.includeNotes
      ? prisma.note.findMany({
          where: { userId, deletedAt: null },
          select: { title: true, content: true, goalId: true, roadmapId: true, roadmapStageId: true, taskId: true, eventId: true },
          orderBy: { updatedAt: "desc" },
          take: 5,
        })
      : [],
    settings.includeGoals ? prisma.roadmapStage.findMany({ where: { userId, deletedAt: null }, select: { id: true, title: true, status: true, roadmap: { select: { goalId: true, title: true } }, tasks: { where: { deletedAt: null, status: { not: "CANCELLED" }, isOptional: false }, select: { status: true } } }, orderBy: { position: "asc" }, take: 20 }) : [],
    settings.includeTasks ? prisma.event.findMany({ where: { userId, deletedAt: null, startsAt: { gte: new Date() } }, select: { id: true, title: true, startsAt: true, endsAt: true, timezone: true, goalId: true, taskId: true }, orderBy: { startsAt: "asc" }, take: 20 }) : [],
  ]);
  return {
    goals,
    tasks,
    stages,
    upcomingEvents: events,
    notes: notes.map((note) => ({
      title: note.title,
      excerpt: note.content.slice(0, 200),
      goalId: note.goalId,
      roadmapId: note.roadmapId,
      stageId: note.roadmapStageId,
      taskId: note.taskId,
      eventId: note.eventId,
    })),
  };
}

export async function persistChatTurn(input: {
  userId: string;
  conversationId?: string;
  prompt: string;
  response: string;
  contextSummary: string[];
  retentionDays: number;
}) {
  return getPrisma().$transaction(async (tx) => {
    const retentionCutoff = new Date(
      Date.now() - input.retentionDays * 24 * 60 * 60 * 1_000,
    );
    await tx.aIMessage.deleteMany({
      where: { userId: input.userId, createdAt: { lt: retentionCutoff } },
    });
    let conversation = input.conversationId
      ? await tx.aIConversation.findFirst({
          where: {
            id: input.conversationId,
            userId: input.userId,
            archivedAt: null,
          },
        })
      : null;
    if (!conversation)
      conversation = await tx.aIConversation.create({
        data: {
          userId: input.userId,
          title: input.prompt.slice(0, 80),
        },
      });
    const contextSummary = input.contextSummary as Prisma.InputJsonValue;
    await tx.aIMessage.create({
      data: {
        userId: input.userId,
        conversationId: conversation.id,
        role: "USER",
        content: input.prompt,
        contextSummary,
      },
    });
    const message = await tx.aIMessage.create({
      data: {
        userId: input.userId,
        conversationId: conversation.id,
        role: "ASSISTANT",
        content: input.response,
        contextSummary,
      },
    });
    await tx.aIConversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date(), version: { increment: 1 } },
    });
    return { conversation, message };
  });
}
