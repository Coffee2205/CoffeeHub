import "server-only";
import { TaskStatus, type Prisma } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/prisma";
import type { TaskInput } from "./task.schema";

export type TaskFilters = { q?: string; status?: string; priority?: string };
export function listTasks(userId: string, filters: TaskFilters) {
  const where: Prisma.TaskWhereInput = { userId, deletedAt: null };
  if (filters.q)
    where.OR = [
      { title: { contains: filters.q, mode: "insensitive" } },
      { description: { contains: filters.q, mode: "insensitive" } },
    ];
  if (
    ["TODO", "IN_PROGRESS", "BLOCKED", "COMPLETED", "CANCELLED"].includes(
      filters.status ?? "",
    )
  )
    where.status = filters.status as TaskStatus;
  if (["LOW", "MEDIUM", "HIGH", "URGENT"].includes(filters.priority ?? ""))
    where.priority = filters.priority as Prisma.EnumPriorityFilter;
  return getPrisma().task.findMany({
    where,
    orderBy: [{ dueAt: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }],
    include: {
      goal: { select: { id: true, title: true } },
      roadmap: { select: { id: true, title: true } },
      roadmapStage: { select: { id: true, title: true } },
    },
  });
}

export function getTask(userId: string, id: string) {
  return getPrisma().task.findFirst({
    where: { id, userId, deletedAt: null },
    include: {
      goal: { select: { id: true, title: true } },
      roadmap: { select: { id: true, title: true } },
      roadmapStage: { select: { id: true, title: true } },
      checklists: {
        where: { deletedAt: null },
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          title: true,
          items: {
            where: { deletedAt: null },
            select: { completed: true },
          },
        },
      },
      events: {
        where: { deletedAt: null },
        orderBy: { startsAt: "asc" },
        select: {
          id: true,
          title: true,
          startsAt: true,
          endsAt: true,
          timezone: true,
        },
      },
      notes: { where: { deletedAt: null }, orderBy: { updatedAt: "desc" }, select: { id: true, title: true, updatedAt: true } },
    },
  });
}
export function getTaskRelations(userId: string) {
  return getPrisma().goal.findMany({
    where: { userId, deletedAt: null },
    orderBy: { title: "asc" },
    select: {
      id: true,
      title: true,
      roadmaps: {
        where: { deletedAt: null },
        orderBy: { title: "asc" },
        select: {
          id: true,
          title: true,
          stages: {
            where: { deletedAt: null },
            orderBy: { position: "asc" },
            select: { id: true, title: true },
          },
        },
      },
    },
  });
}

async function validRelations(
  tx: Prisma.TransactionClient,
  userId: string,
  input: TaskInput,
) {
  if (input.roadmapStageId && !input.roadmapId) return false;
  if (input.roadmapId && !input.goalId) return false;
  if (
    input.goalId &&
    !(await tx.goal.findFirst({
      where: { id: input.goalId, userId, deletedAt: null },
      select: { id: true },
    }))
  )
    return false;
  if (
    input.roadmapId &&
    !(await tx.roadmap.findFirst({
      where: {
        id: input.roadmapId,
        goalId: input.goalId!,
        userId,
        deletedAt: null,
      },
      select: { id: true },
    }))
  )
    return false;
  if (
    input.roadmapStageId &&
    !(await tx.roadmapStage.findFirst({
      where: {
        id: input.roadmapStageId,
        roadmapId: input.roadmapId!,
        userId,
        deletedAt: null,
      },
      select: { id: true },
    }))
  )
    return false;
  return true;
}
export async function createTask(userId: string, input: TaskInput) {
  return getPrisma().$transaction(async (tx) => {
    if (!(await validRelations(tx, userId, input))) return null;
    if (input.externalKey) {
      const existing = await tx.task.findFirst({ where: { userId, externalKey: input.externalKey }, select: { id: true } });
      if (existing) return tx.task.update({ where: { id: existing.id }, data: { ...input, version: { increment: 1 } } });
    }
    const last = await tx.task.findFirst({
      where: { userId },
      orderBy: { position: "desc" },
      select: { position: true },
    });
    return tx.task.create({
      data: { ...input, userId, position: (last?.position ?? -1) + 1 },
    });
  });
}
export async function updateTask(userId: string, id: string, input: TaskInput) {
  return getPrisma().$transaction(async (tx) => {
    if (!(await validRelations(tx, userId, input))) return null;
    const current = await tx.task.findFirst({
      where: { id, userId, deletedAt: null },
      select: { id: true },
    });
    if (!current) return null;
    return tx.task.update({
      where: { id: current.id },
      data: { ...input, version: { increment: 1 } },
    });
  });
}
export function archiveTask(userId: string, id: string) {
  return getPrisma().task.updateMany({
    where: { id, userId, deletedAt: null },
    data: { deletedAt: new Date(), version: { increment: 1 } },
  });
}
export function setTaskCompleted(
  userId: string,
  id: string,
  completed: boolean,
) {
  return getPrisma().task.updateMany({
    where: { id, userId, deletedAt: null },
    data: {
      status: completed ? TaskStatus.COMPLETED : TaskStatus.TODO,
      version: { increment: 1 },
    },
  });
}
