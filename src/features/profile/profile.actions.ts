"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/auth";
import { saveAdminProfile } from "./profile.repository";
import { parseProfileForm } from "./profile.schema";
export async function saveProfileAction(form: FormData) { const user = await requireAdmin(); const parsed = parseProfileForm(form); if (!parsed.data) redirect(`/admin/profile?error=${encodeURIComponent(parsed.errors.join(" "))}`); await saveAdminProfile(user.id, parsed.data); revalidatePath("/admin/profile"); revalidatePath("/admin"); redirect("/admin/profile?saved=1"); }
