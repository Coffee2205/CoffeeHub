import "server-only";

import {
  TaskStatus,
  type GoalStatus,
  type Priority,
} from "@/generated/prisma/client";
import { getPrisma } from "@/lib/prisma";
import type { GoalInput } from "./goal.schema";

const taskScope = {
  deletedAt: null,
  status: { not: TaskStatus.CANCELLED },
} as const;

export function listGoals(userId: string) {
  return getPrisma().goal.findMany({
    where: { userId, deletedAt: null },
    include: {
      tasks: { where: taskScope, select: { status: true } },
      _count: { select: { roadmaps: { where: { deletedAt: null } } } },
    },
    orderBy: [{ status: "asc" }, { deadline: "asc" }, { updatedAt: "desc" }],
  });
}

export function getGoal(userId: string, id: string) {
  return getPrisma().goal.findFirst({
    where: { id, userId, deletedAt: null },
    include: {
      tasks: {
        where: taskScope,
        select: { id: true, title: true, status: true },
      },
      roadmaps: { where: { deletedAt: null }, select: { id: true } },
    },
  });
}

export function createGoal(userId: string, input: GoalInput) {
  return getPrisma().goal.create({
    data: {
      ...input,
      userId,
      status: input.status as GoalStatus,
      priority: input.priority as Priority,
    },
  });
}

export function updateGoal(userId: string, id: string, input: GoalInput) {
  return getPrisma().goal.updateMany({
    where: { id, userId, deletedAt: null },
    data: {
      ...input,
      status: input.status as GoalStatus,
      priority: input.priority as Priority,
      version: { increment: 1 },
    },
  });
}

export function archiveGoal(userId: string, id: string) {
  return getPrisma().goal.updateMany({
    where: { id, userId, deletedAt: null },
    data: {
      status: "ARCHIVED",
      deletedAt: new Date(),
      version: { increment: 1 },
    },
  });
}
