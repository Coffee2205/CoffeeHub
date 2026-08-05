"use server";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/auth";
import {
  createResumeItem,
  softDeleteResumeItem,
  updateResumeItem,
} from "./resume.repository";
import {
  parseResumeForm,
  RESUME_KINDS,
  type ResumeKind,
} from "./resume.schema";
function valid(kind: string): kind is ResumeKind {
  return RESUME_KINDS.some((item) => item === kind);
}
function refresh() {
  revalidatePath("/admin");
  revalidatePath("/admin/resume");
}
export async function createResumeAction(kindValue: string, form: FormData) {
  const user = await requireAdmin();
  if (!valid(kindValue)) notFound();
  const parsed = parseResumeForm(kindValue, form);
  if (!parsed.data)
    redirect(
      `/admin/resume/${kindValue}/new?error=${encodeURIComponent(parsed.errors.join(" "))}`,
    );
  await createResumeItem(kindValue, user.id, parsed.data);
  refresh();
  redirect("/admin/resume?saved=1");
}
export async function updateResumeAction(
  kindValue: string,
  id: string,
  form: FormData,
) {
  await requireAdmin();
  if (!valid(kindValue)) notFound();
  const parsed = parseResumeForm(kindValue, form);
  if (!parsed.data)
    redirect(
      `/admin/resume/${kindValue}/${id}/edit?error=${encodeURIComponent(parsed.errors.join(" "))}`,
    );
  await updateResumeItem(kindValue, id, parsed.data);
  refresh();
  redirect("/admin/resume?saved=1");
}
export async function deleteResumeAction(kindValue: string, id: string) {
  await requireAdmin();
  if (!valid(kindValue)) notFound();
  await softDeleteResumeItem(kindValue, id);
  refresh();
  redirect("/admin/resume?saved=1");
}
