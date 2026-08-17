import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/prisma";
import type { EventInput } from "./event.schema";

export function listEvents(userId: string, from: Date, to: Date) {
  return getPrisma().event.findMany({
    where: { userId, deletedAt: null, startsAt: { gte: from, lt: to } },
    orderBy: { startsAt: "asc" },
    include: {
      goal: { select: { id: true, title: true } },
      task: { select: { id: true, title: true } },
    },
  });
}

export function getEvent(userId: string, id: string) {
  return getPrisma().event.findFirst({
    where: { id, userId, deletedAt: null },
    include: { goal: { select: { id: true, title: true } }, task: { select: { id: true, title: true } }, notes: { where: { deletedAt: null }, select: { id: true, title: true } } },
  });
}

export async function getEventRelations(userId: string) {
  const [goals, tasks] = await Promise.all([
    getPrisma().goal.findMany({
      where: { userId, deletedAt: null },
      orderBy: { title: "asc" },
      select: { id: true, title: true },
    }),
    getPrisma().task.findMany({
      where: { userId, deletedAt: null },
      orderBy: { title: "asc" },
      select: { id: true, title: true, goalId: true },
    }),
  ]);
  return { goals, tasks };
}

async function validRelations(
  tx: Prisma.TransactionClient,
  userId: string,
  input: EventInput,
) {
  if (
    input.goalId &&
    !(await tx.goal.findFirst({
      where: { id: input.goalId, userId, deletedAt: null },
      select: { id: true },
    }))
  )
    return false;
  if (input.taskId) {
    const task = await tx.task.findFirst({
      where: { id: input.taskId, userId, deletedAt: null },
      select: { goalId: true },
    });
    if (!task || (input.goalId && task.goalId && task.goalId !== input.goalId))
      return false;
  }
  return true;
}

export function createEvent(userId: string, input: EventInput) {
  return getPrisma().$transaction(async (tx) => {
    if (!(await validRelations(tx, userId, input))) return null;
    if (input.externalKey) {
      const existing = await tx.event.findFirst({ where: { userId, externalKey: input.externalKey }, select: { id: true } });
      if (existing) return tx.event.update({ where: { id: existing.id }, data: { ...input, version: { increment: 1 } } });
    }
    return tx.event.create({ data: { ...input, userId } });
  });
}

export function updateEvent(userId: string, id: string, input: EventInput) {
  return getPrisma().$transaction(async (tx) => {
    if (!(await validRelations(tx, userId, input))) return null;
    const current = await tx.event.findFirst({
      where: { id, userId, deletedAt: null },
      select: { id: true },
    });
    if (!current) return null;
    return tx.event.update({
      where: { id: current.id },
      data: { ...input, version: { increment: 1 } },
    });
  });
}

export function archiveEvent(userId: string, id: string) {
  return getPrisma().event.updateMany({
    where: { id, userId, deletedAt: null },
    data: { deletedAt: new Date(), version: { increment: 1 } },
  });
}
