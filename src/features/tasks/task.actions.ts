"use server";
import { revalidatePath } from "next/cache"; import { redirect } from "next/navigation";
import { requireUser } from "@/lib/supabase/auth"; import { archiveTask, createTask, setTaskCompleted, updateTask } from "./task.repository"; import { parseTaskForm } from "./task.schema";
const invalid = (path: string, message: string): never => redirect(`${path}?error=${encodeURIComponent(message)}`);
export async function createTaskAction(form: FormData) {
  const user = await requireUser(); const parsed = parseTaskForm(form);
  if (!parsed.data) return invalid("/app/tasks/new", parsed.errors.join(" "));
  const task = await createTask(user.id, parsed.data);
  if (!task) return invalid("/app/tasks/new", "Quan hệ Goal, Roadmap hoặc Stage không hợp lệ.");
  revalidatePath("/app/tasks"); redirect(`/app/tasks/${task.id}?saved=created`);
}
export async function updateTaskAction(id: string, form: FormData) {
  const user = await requireUser(); const parsed = parseTaskForm(form);
  if (!parsed.data) return invalid(`/app/tasks/${id}`, parsed.errors.join(" "));
  const task = await updateTask(user.id, id, parsed.data);
  if (!task) return invalid(`/app/tasks/${id}`, "Task hoặc quan hệ đã chọn không hợp lệ.");
  revalidatePath("/app/tasks"); redirect(`/app/tasks/${id}?saved=updated`);
}
export async function archiveTaskAction(id: string) { const user = await requireUser(); const result = await archiveTask(user.id, id); if (!result.count) invalid(`/app/tasks/${id}`, "Task không tồn tại."); revalidatePath("/app/tasks"); redirect("/app/tasks?archived=1"); }
export async function setTaskCompletedAction(id: string, completed: boolean) { const user = await requireUser(); const result = await setTaskCompleted(user.id, id, completed); if (!result.count) return { ok: false, error: "Không thể cập nhật Task." }; return { ok: true } as const; }
