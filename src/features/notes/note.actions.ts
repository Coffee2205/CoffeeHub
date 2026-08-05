"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/supabase/auth";
import { archiveNote, createNote, saveNote } from "./note.repository";
import { parseNoteInput, type NoteInput } from "./note.schema";

export async function createNoteAction(form: FormData) {
  const user = await requireUser();
  const parsed = parseNoteInput({
    title: String(form.get("title") ?? ""),
    content: String(form.get("content") ?? ""),
  });
  if (!parsed.data) {
    redirect(
      `/app/notes/new?error=${encodeURIComponent(parsed.errors.join(" "))}`,
    );
  }
  const note = await createNote(user.id, parsed.data);
  revalidatePath("/app/notes");
  redirect(`/app/notes/${note.id}`);
}

export async function saveNoteAction(
  id: string,
  expectedVersion: number,
  input: NoteInput,
) {
  const user = await requireUser();
  const parsed = parseNoteInput(input);
  if (!parsed.data) {
    return { status: "invalid" as const, error: parsed.errors.join(" ") };
  }
  const result = await saveNote(user.id, id, expectedVersion, parsed.data);
  revalidatePath("/app/notes");
  return result;
}

export async function archiveNoteAction(id: string) {
  const user = await requireUser();
  const result = await archiveNote(user.id, id);
  if (!result.count) redirect(`/app/notes/${id}`);
  revalidatePath("/app/notes");
  redirect("/app/notes?archived=1");
}
