"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/supabase/auth";
import { archiveEvent, createEvent, updateEvent } from "./event.repository";
import { parseEventForm } from "./event.schema";

const invalid = (path: string, message: string): never =>
  redirect(`${path}?error=${encodeURIComponent(message)}`);

export async function createEventAction(form: FormData) {
  const user = await requireUser();
  const parsed = parseEventForm(form);
  if (!parsed.data)
    return invalid("/app/calendar/new", parsed.errors.join(" "));
  const event = await createEvent(user.id, parsed.data);
  if (!event)
    return invalid("/app/calendar/new", "Goal hoặc Task đã chọn không hợp lệ.");
  revalidatePath("/app/calendar");
  redirect(`/app/calendar/${event.id}?saved=created`);
}

export async function updateEventAction(id: string, form: FormData) {
  const user = await requireUser();
  const parsed = parseEventForm(form);
  if (!parsed.data)
    return invalid(`/app/calendar/${id}`, parsed.errors.join(" "));
  const event = await updateEvent(user.id, id, parsed.data);
  if (!event)
    return invalid(`/app/calendar/${id}`, "Event hoặc quan hệ không hợp lệ.");
  revalidatePath("/app/calendar");
  redirect(`/app/calendar/${id}?saved=updated`);
}

export async function archiveEventAction(id: string) {
  const user = await requireUser();
  const result = await archiveEvent(user.id, id);
  if (!result.count) invalid(`/app/calendar/${id}`, "Event không tồn tại.");
  revalidatePath("/app/calendar");
  redirect("/app/calendar?archived=1");
}
