import "server-only";

import { TaskStatus } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/prisma";
import type { RoadmapInput, StageInput } from "./roadmap.schema";

const activeTask = { deletedAt: null, status: { not: TaskStatus.CANCELLED } } as const;

export function getGoalRoadmaps(userId: string, goalId: string) {
  return getPrisma().goal.findFirst({
    where: { id: goalId, userId, deletedAt: null },
    select: {
      id: true, title: true, status: true,
      roadmaps: {
        where: { deletedAt: null }, orderBy: { createdAt: "asc" },
        include: { stages: { where: { deletedAt: null }, orderBy: { position: "asc" }, include: { tasks: { where: activeTask, select: { id: true, title: true, status: true } } } } },
      },
    },
  });
}

export async function createRoadmap(userId: string, goalId: string, input: RoadmapInput) {
  const prisma = getPrisma();
  return prisma.$transaction(async (tx) => {
    const goal = await tx.goal.findFirst({ where: { id: goalId, userId, deletedAt: null }, select: { id: true } });
    if (!goal) return null;
    return tx.roadmap.create({ data: { ...input, goalId, userId } });
  });
}

export async function createStage(userId: string, goalId: string, roadmapId: string, input: StageInput) {
  const prisma = getPrisma();
  return prisma.$transaction(async (tx) => {
    const roadmap = await tx.roadmap.findFirst({ where: { id: roadmapId, goalId, userId, deletedAt: null }, select: { id: true } });
    if (!roadmap) return null;
    const last = await tx.roadmapStage.findFirst({ where: { roadmapId, userId }, orderBy: { position: "desc" }, select: { position: true } });
    return tx.roadmapStage.create({ data: { ...input, roadmapId, userId, position: (last?.position ?? -1) + 1 } });
  });
}

export function updateStage(userId: string, goalId: string, roadmapId: string, stageId: string, input: StageInput) {
  return getPrisma().roadmapStage.updateMany({
    where: { id: stageId, roadmapId, userId, deletedAt: null, roadmap: { goalId, deletedAt: null } },
    data: { ...input, version: { increment: 1 } },
  });
}

export async function moveStage(userId: string, goalId: string, roadmapId: string, stageId: string, direction: "up" | "down") {
  const prisma = getPrisma();
  return prisma.$transaction(async (tx) => {
    const stages = await tx.roadmapStage.findMany({ where: { roadmapId, userId, deletedAt: null, roadmap: { goalId, deletedAt: null } }, orderBy: { position: "asc" }, select: { id: true, position: true } });
    const index = stages.findIndex((stage) => stage.id === stageId);
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (index < 0 || targetIndex < 0 || targetIndex >= stages.length) return false;
    const current = stages[index];
    const target = stages[targetIndex];
    const highest = await tx.roadmapStage.findFirst({ where: { roadmapId, userId }, orderBy: { position: "desc" }, select: { position: true } });
    const temporaryPosition = (highest?.position ?? 0) + 1;
    await tx.roadmapStage.update({ where: { id: current.id }, data: { position: temporaryPosition } });
    await tx.roadmapStage.update({ where: { id: target.id }, data: { position: current.position, version: { increment: 1 } } });
    await tx.roadmapStage.update({ where: { id: current.id }, data: { position: target.position, version: { increment: 1 } } });
    return true;
  });
}

export async function archiveStage(userId: string, goalId: string, roadmapId: string, stageId: string) {
  const prisma = getPrisma();
  return prisma.$transaction(async (tx) => {
    const stage = await tx.roadmapStage.findFirst({
      where: { id: stageId, roadmapId, userId, deletedAt: null, roadmap: { goalId, deletedAt: null } },
      select: { id: true, _count: { select: { tasks: { where: { deletedAt: null } } } } },
    });
    if (!stage) return "not-found" as const;
    if (stage._count.tasks > 0) return "has-tasks" as const;
    await tx.roadmapStage.update({ where: { id: stage.id }, data: { deletedAt: new Date(), version: { increment: 1 } } });
    return "archived" as const;
  });
}
