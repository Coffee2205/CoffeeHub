import "server-only";

import { getPrisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { NoteInput } from "./note.schema";
import { noteOwnerWhere } from "./note-ownership";

export function listNotes(userId: string, query = "") {
  return getPrisma().note.findMany({
    where: {
      userId,
      deletedAt: null,
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" as const } },
              { content: { contains: query, mode: "insensitive" as const } },
            ],
          }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
  });
}

export function getNote(userId: string, id: string) {
  return getPrisma().note.findFirst({
    where: { id, userId, deletedAt: null },
    include: { goal: { select: { id: true, title: true } }, roadmap: { select: { id: true, title: true } }, roadmapStage: { select: { id: true, title: true } }, task: { select: { id: true, title: true } }, event: { select: { id: true, title: true } } },
  });
}

async function validContext(tx: Prisma.TransactionClient, userId: string, input: NoteInput) {
  const [goal, roadmap, stage, task, event] = await Promise.all([
    input.goalId ? tx.goal.findFirst({ where: { id: input.goalId, userId, deletedAt: null }, select: { id: true } }) : null,
    input.roadmapId ? tx.roadmap.findFirst({ where: { id: input.roadmapId, userId, deletedAt: null }, select: { id: true, goalId: true } }) : null,
    input.roadmapStageId ? tx.roadmapStage.findFirst({ where: { id: input.roadmapStageId, userId, deletedAt: null }, select: { id: true, roadmapId: true, roadmap: { select: { goalId: true } } } }) : null,
    input.taskId ? tx.task.findFirst({ where: { id: input.taskId, userId, deletedAt: null }, select: { id: true, goalId: true, roadmapId: true, roadmapStageId: true } }) : null,
    input.eventId ? tx.event.findFirst({ where: { id: input.eventId, userId, deletedAt: null }, select: { id: true, goalId: true, taskId: true } }) : null,
  ]);
  if ((input.goalId && !goal) || (input.roadmapId && !roadmap) || (input.roadmapStageId && !stage) || (input.taskId && !task) || (input.eventId && !event)) return false;
  const goalIds = [input.goalId, roadmap?.goalId, stage?.roadmap.goalId, task?.goalId, event?.goalId].filter(Boolean);
  const roadmapIds = [input.roadmapId, stage?.roadmapId, task?.roadmapId].filter(Boolean);
  const taskIds = [input.taskId, event?.taskId].filter(Boolean);
  return new Set(goalIds).size <= 1 && new Set(roadmapIds).size <= 1 && new Set(taskIds).size <= 1 && (!input.roadmapStageId || !task?.roadmapStageId || input.roadmapStageId === task.roadmapStageId);
}

export function getNoteRelations(userId: string) {
  const prisma = getPrisma();
  return Promise.all([
    prisma.goal.findMany({ where: { userId, deletedAt: null }, select: { id: true, title: true } }),
    prisma.roadmap.findMany({ where: { userId, deletedAt: null }, select: { id: true, title: true } }),
    prisma.roadmapStage.findMany({ where: { userId, deletedAt: null }, select: { id: true, title: true } }),
    prisma.task.findMany({ where: { userId, deletedAt: null }, select: { id: true, title: true } }),
    prisma.event.findMany({ where: { userId, deletedAt: null }, select: { id: true, title: true } }),
  ]).then(([goals, roadmaps, stages, tasks, events]) => ({ goals, roadmaps, stages, tasks, events }));
}

export function createNote(userId: string, input: NoteInput) {
  return getPrisma().$transaction(async (tx) => (await validContext(tx, userId, input)) ? tx.note.create({ data: { ...input, userId } }) : null);
}

export function updateNoteContext(userId: string, id: string, input: NoteInput) {
  return getPrisma().$transaction(async (tx) => {
    if (!(await validContext(tx, userId, input))) return null;
    const note = await tx.note.findFirst({ where: { id, userId, deletedAt: null }, select: { id: true } });
    return note ? tx.note.update({ where: { id: note.id }, data: { goalId: input.goalId, roadmapId: input.roadmapId, roadmapStageId: input.roadmapStageId, taskId: input.taskId, eventId: input.eventId, version: { increment: 1 } } }) : null;
  });
}

export async function saveNote(
  userId: string,
  id: string,
  expectedVersion: number,
  input: NoteInput,
) {
  const prisma = getPrisma();
  const result = await prisma.note.updateMany({
    where: { id, userId, deletedAt: null, version: expectedVersion },
    data: { ...input, version: { increment: 1 } },
  });

  const current = await getNote(userId, id);
  if (!current) return { status: "missing" as const };
  if (result.count) return { status: "saved" as const, note: current };

  if (current.title === input.title && current.content === input.content) {
    return { status: "saved" as const, note: current };
  }

  return { status: "conflict" as const, note: current };
}

export function archiveNote(userId: string, id: string) {
  return getPrisma().note.updateMany({
    where: noteOwnerWhere(userId, id),
    data: { deletedAt: new Date(), version: { increment: 1 } },
  });
}
