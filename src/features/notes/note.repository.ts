import "server-only";

import { getPrisma } from "@/lib/prisma";
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
  });
}

export function createNote(userId: string, input: NoteInput) {
  return getPrisma().note.create({ data: { ...input, userId } });
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
