"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/supabase/auth";
import { archiveGoal, createGoal, updateGoal } from "./goal.repository";
import { parseGoalForm } from "./goal.schema";

function formError(errors: string[], id?: string): never {
  redirect(`/app/goals/${id ?? "new"}?error=${encodeURIComponent(errors.join(" "))}`);
}

export async function createGoalAction(form: FormData) {
  const user = await requireUser();
  const parsed = parseGoalForm(form);
  if (!parsed.data) formError(parsed.errors);
  const goal = await createGoal(user.id, parsed.data);
  revalidatePath("/app/goals");
  revalidatePath("/app/dashboard");
  redirect(`/app/goals/${goal.id}?created=1`);
}

export async function updateGoalAction(id: string, form: FormData) {
  const user = await requireUser();
  const parsed = parseGoalForm(form);
  if (!parsed.data) formError(parsed.errors, id);
  const result = await updateGoal(user.id, id, parsed.data);
  if (!result.count) redirect("/app/goals?error=Goal%20không%20tồn%20tại.");
  revalidatePath("/app/goals");
  revalidatePath(`/app/goals/${id}`);
  revalidatePath("/app/dashboard");
  redirect(`/app/goals/${id}?saved=1`);
}

export async function archiveGoalAction(id: string) {
  const user = await requireUser();
  const result = await archiveGoal(user.id, id);
  if (!result.count) redirect("/app/goals?error=Goal%20không%20tồn%20tại.");
  revalidatePath("/app/goals");
  revalidatePath("/app/dashboard");
  redirect("/app/goals?archived=1");
}
