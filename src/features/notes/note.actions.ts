"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/supabase/auth";
import { archiveNote, createNote, saveNote, updateNoteContext } from "./note.repository";
import { parseNoteInput, type NoteInput } from "./note.schema";

export type NoteSnapshot = {
  id: string;
  title: string;
  content: string;
  version: number;
  updatedAt: number;
};

function toNoteSnapshot(note: {
  id: string;
  title: string;
  content: string;
  version: number;
  updatedAt: Date;
}): NoteSnapshot {
  return {
    id: note.id,
    title: note.title,
    content: note.content,
    version: note.version,
    updatedAt: note.updatedAt.getTime(),
  };
}

export async function createNoteAction(form: FormData) {
  const user = await requireUser();
  const parsed = parseNoteInput({
    title: String(form.get("title") ?? ""),
    content: String(form.get("content") ?? ""),
    ...readContext(form),
  });
  if (!parsed.data) {
    redirect(
      `/app/notes/new?error=${encodeURIComponent(parsed.errors.join(" "))}`,
    );
  }
  const note = await createNote(user.id, parsed.data);
  if (!note) redirect("/app/notes/new?error=Invalid+or+inconsistent+note+context");
  revalidatePath("/app/notes");
  redirect(`/app/notes/${note.id}`);
}

const optionalId = (form: FormData, name: string) => String(form.get(name) ?? "").trim() || null;
const readContext = (form: FormData) => ({ goalId: optionalId(form, "goalId"), roadmapId: optionalId(form, "roadmapId"), roadmapStageId: optionalId(form, "roadmapStageId"), taskId: optionalId(form, "taskId"), eventId: optionalId(form, "eventId") });

export async function updateNoteContextAction(id: string, form: FormData) {
  const user = await requireUser();
  const result = await updateNoteContext(user.id, id, { title: "context", content: "", ...readContext(form) });
  if (!result) redirect(`/app/notes/${id}?error=Invalid+or+inconsistent+note+context`);
  revalidatePath(`/app/notes/${id}`);
  redirect(`/app/notes/${id}?contextSaved=1`);
}

export async function saveNoteAction(
  id: string,
  expectedVersion: number,
  input: NoteInput,
  idempotencyKey: string,
) {
  const user = await requireUser();
  if (!/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(idempotencyKey)) {
    return { status: "invalid" as const, error: "Khóa đồng bộ không hợp lệ." };
  }
  const parsed = parseNoteInput(input);
  if (!parsed.data) {
    return { status: "invalid" as const, error: parsed.errors.join(" ") };
  }
  const result = await saveNote(user.id, id, expectedVersion, parsed.data);
  if (result.status === "saved" || result.status === "conflict") {
    return { status: result.status, note: toNoteSnapshot(result.note) };
  }
  return result;
}

export async function archiveNoteAction(id: string) {
  const user = await requireUser();
  const result = await archiveNote(user.id, id);
  if (!result.count) redirect(`/app/notes/${id}`);
  revalidatePath("/app/notes");
  redirect("/app/notes?archived=1");
}

export async function deleteNoteAction(id: string) {
  const user = await requireUser();
  if (!/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(id))
    return { status: "error" as const, error: "Note không hợp lệ." };
  const result = await archiveNote(user.id, id);
  if (!result.count)
    return {
      status: "error" as const,
      error: "Không tìm thấy Note hoặc bạn không có quyền xóa.",
    };
  revalidatePath("/app/notes");
  return { status: "success" as const };
}
