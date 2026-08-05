"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/supabase/auth";
import { saveWorkspaceProfile } from "./workspace-profile.repository";
import { parseWorkspaceProfileForm } from "./workspace-profile.schema";

export async function saveWorkspaceProfileAction(form: FormData) {
  const user = await requireUser();
  const parsed = parseWorkspaceProfileForm(form);

  if (!parsed.data) {
    redirect(
      `/app/profile?error=${encodeURIComponent(parsed.errors.join(" "))}`,
    );
  }

  await saveWorkspaceProfile(user.id, parsed.data);
  revalidatePath("/app/profile");
  revalidatePath("/app/dashboard");
  redirect("/app/profile?saved=1");
}
