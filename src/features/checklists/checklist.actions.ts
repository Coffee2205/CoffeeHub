"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/supabase/auth";
import {
  addChecklistItem,
  archiveChecklist,
  createChecklist,
  deleteChecklistItem,
  toggleChecklistItemCompleted,
  updateChecklist,
} from "./checklist.repository";
import { parseChecklistForm, parseChecklistItemForm } from "./checklist.schema";

const invalid = (path: string, message: string): never =>
  redirect(`${path}?error=${encodeURIComponent(message)}`);

export async function createChecklistAction(form: FormData) {
  const user = await requireUser();
  const parsed = parseChecklistForm(form);
  if (!parsed.data)
    return invalid("/app/checklists/new", parsed.errors.join(" "));
  const checklist = await createChecklist(user.id, parsed.data);
  if (!checklist)
    return invalid("/app/checklists/new", "Ngữ cảnh Checklist không hợp lệ.");
  revalidatePath("/app/checklists");
  redirect(`/app/checklists/${checklist.id}?saved=created`);
}

export async function updateChecklistAction(id: string, form: FormData) {
  const user = await requireUser();
  const parsed = parseChecklistForm(form);
  if (!parsed.data)
    return invalid(`/app/checklists/${id}`, parsed.errors.join(" "));
  const checklist = await updateChecklist(user.id, id, parsed.data);
  if (!checklist)
    return invalid(
      `/app/checklists/${id}`,
      "Checklist hoặc ngữ cảnh đã chọn không hợp lệ.",
    );
  revalidatePath("/app/checklists");
  revalidatePath(`/app/checklists/${id}`);
  redirect(`/app/checklists/${id}?saved=updated`);
}

export async function archiveChecklistAction(id: string) {
  const user = await requireUser();
  const result = await archiveChecklist(user.id, id);
  if (!result.count)
    invalid(`/app/checklists/${id}`, "Checklist không tồn tại.");
  revalidatePath("/app/checklists");
  redirect("/app/checklists?archived=1");
}

export async function addChecklistItemAction(id: string, form: FormData) {
  const user = await requireUser();
  const parsed = parseChecklistItemForm(form);
  if (!parsed.data)
    return invalid(`/app/checklists/${id}`, parsed.errors.join(" "));
  const item = await addChecklistItem(user.id, id, parsed.data.title);
  if (!item)
    return invalid(`/app/checklists/${id}`, "Checklist không tồn tại.");
  revalidatePath("/app/checklists");
  revalidatePath(`/app/checklists/${id}`);
  redirect(`/app/checklists/${id}?itemSaved=1`);
}

export async function deleteChecklistItemAction(id: string, itemId: string) {
  const user = await requireUser();
  const result = await deleteChecklistItem(user.id, id, itemId);
  if (!result.count)
    return invalid(`/app/checklists/${id}`, "Không thể xóa item.");
  revalidatePath("/app/checklists");
  revalidatePath(`/app/checklists/${id}`);
  redirect(`/app/checklists/${id}?itemSaved=1`);
}

export async function toggleChecklistItemCompletedAction(
  checklistId: string,
  itemId: string,
  completed: boolean,
) {
  const user = await requireUser();
  const result = await toggleChecklistItemCompleted(
    user.id,
    checklistId,
    itemId,
    completed,
  );
  if (!result.count)
    return { ok: false, error: "Không thể cập nhật item." } as const;
  revalidatePath("/app/checklists");
  revalidatePath(`/app/checklists/${checklistId}`);
  return { ok: true } as const;
}
