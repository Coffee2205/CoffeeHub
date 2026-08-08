import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/prisma";
import type { ChecklistInput } from "./checklist.schema";

export type ChecklistFilters = { q?: string };

const itemInclude = {
  where: { deletedAt: null },
  orderBy: { position: "asc" as const },
  select: {
    id: true,
    title: true,
    completed: true,
    position: true,
    createdAt: true,
    updatedAt: true,
  },
};

const checklistInclude = {
  goal: { select: { id: true, title: true } },
  roadmap: {
    select: {
      id: true,
      title: true,
      goal: { select: { id: true, title: true } },
    },
  },
  task: {
    select: {
      id: true,
      title: true,
      goal: { select: { id: true, title: true } },
      roadmap: { select: { id: true, title: true } },
    },
  },
  items: itemInclude,
} satisfies Prisma.ChecklistInclude;

export function listChecklists(userId: string, filters: ChecklistFilters) {
  const where: Prisma.ChecklistWhereInput = { userId, deletedAt: null };
  if (filters.q)
    where.OR = [
      { title: { contains: filters.q, mode: "insensitive" } },
      { description: { contains: filters.q, mode: "insensitive" } },
    ];
  return getPrisma().checklist.findMany({
    where,
    orderBy: [{ updatedAt: "desc" }],
    include: checklistInclude,
  });
}

export function getChecklist(userId: string, id: string) {
  return getPrisma().checklist.findFirst({
    where: { id, userId, deletedAt: null },
    include: checklistInclude,
  });
}

export function getChecklistRelations(userId: string) {
  return Promise.all([
    getPrisma().goal.findMany({
      where: { userId, deletedAt: null },
      orderBy: { title: "asc" },
      select: { id: true, title: true },
    }),
    getPrisma().roadmap.findMany({
      where: { userId, deletedAt: null },
      orderBy: { title: "asc" },
      select: {
        id: true,
        title: true,
        goal: { select: { id: true, title: true } },
      },
    }),
    getPrisma().task.findMany({
      where: { userId, deletedAt: null },
      orderBy: { title: "asc" },
      select: {
        id: true,
        title: true,
        goal: { select: { id: true, title: true } },
        roadmap: { select: { id: true, title: true } },
      },
    }),
  ]).then(([goals, roadmaps, tasks]) => ({ goals, roadmaps, tasks }));
}

async function validRelations(
  tx: Prisma.TransactionClient,
  userId: string,
  input: ChecklistInput,
) {
  if ([input.goalId, input.roadmapId, input.taskId].filter(Boolean).length > 1)
    return false;
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
      where: { id: input.roadmapId, userId, deletedAt: null },
      select: { id: true },
    }))
  )
    return false;
  if (
    input.taskId &&
    !(await tx.task.findFirst({
      where: { id: input.taskId, userId, deletedAt: null },
      select: { id: true },
    }))
  )
    return false;
  return true;
}

export async function createChecklist(userId: string, input: ChecklistInput) {
  return getPrisma().$transaction(async (tx) => {
    if (!(await validRelations(tx, userId, input))) return null;
    return tx.checklist.create({ data: { ...input, userId } });
  });
}

export async function updateChecklist(
  userId: string,
  id: string,
  input: ChecklistInput,
) {
  return getPrisma().$transaction(async (tx) => {
    if (!(await validRelations(tx, userId, input))) return null;
    const current = await tx.checklist.findFirst({
      where: { id, userId, deletedAt: null },
      select: { id: true },
    });
    if (!current) return null;
    return tx.checklist.update({
      where: { id: current.id },
      data: { ...input, version: { increment: 1 } },
    });
  });
}

export function archiveChecklist(userId: string, id: string) {
  return getPrisma().checklist.updateMany({
    where: { id, userId, deletedAt: null },
    data: { deletedAt: new Date(), version: { increment: 1 } },
  });
}

export async function addChecklistItem(
  userId: string,
  checklistId: string,
  title: string,
) {
  return getPrisma().$transaction(async (tx) => {
    const checklist = await tx.checklist.findFirst({
      where: { id: checklistId, userId, deletedAt: null },
      select: { id: true },
    });
    if (!checklist) return null;
    const last = await tx.checklistItem.findFirst({
      // Include archived items so a replacement never reuses a position that
      // is still protected by the checklist/position unique constraint.
      where: { checklistId, userId },
      orderBy: { position: "desc" },
      select: { position: true },
    });
    return tx.checklistItem.create({
      data: {
        checklistId,
        userId,
        title,
        position: (last?.position ?? -1) + 1,
      },
    });
  });
}

export function toggleChecklistItemCompleted(
  userId: string,
  checklistId: string,
  itemId: string,
  completed: boolean,
) {
  return getPrisma().checklistItem.updateMany({
    where: { id: itemId, checklistId, userId, deletedAt: null },
    data: { completed, version: { increment: 1 } },
  });
}

export function deleteChecklistItem(
  userId: string,
  checklistId: string,
  itemId: string,
) {
  return getPrisma().checklistItem.updateMany({
    where: { id: itemId, checklistId, userId, deletedAt: null },
    data: { deletedAt: new Date(), version: { increment: 1 } },
  });
}
