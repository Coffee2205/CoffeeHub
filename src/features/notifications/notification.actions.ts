"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/supabase/auth";
import {
  cancelReminder,
  createReminder,
  upsertPreference,
} from "./notification.repository";
import { parsePreferenceForm, parseReminderForm } from "./notification.schema";
const path = "/app/settings/notifications";
export async function createReminderAction(form: FormData) {
  const user = await requireUser();
  const parsed = parseReminderForm(form);
  if (!parsed.data)
    redirect(`${path}?error=${encodeURIComponent(parsed.errors.join(" "))}`);
  const result = await createReminder(user.id, parsed.data);
  if (!result)
    redirect(
      `${path}?error=${encodeURIComponent("Entity liên kết không hợp lệ.")}`,
    );
  revalidatePath(path);
  redirect(`${path}?saved=reminder`);
}
export async function cancelReminderAction(id: string) {
  const user = await requireUser();
  await cancelReminder(user.id, id);
  revalidatePath(path);
  redirect(`${path}?saved=cancelled`);
}
export async function savePreferenceAction(form: FormData) {
  const user = await requireUser();
  const parsed = parsePreferenceForm(form);
  if (!parsed.data)
    redirect(`${path}?error=${encodeURIComponent(parsed.errors.join(" "))}`);
  await upsertPreference(user.id, parsed.data);
  revalidatePath(path);
  redirect(`${path}?saved=preferences`);
}
