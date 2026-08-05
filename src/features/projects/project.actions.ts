"use server";
import { Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/auth";
import {
  createProject,
  softDeleteProject,
  updateProject,
} from "./project.repository";
import { parseProjectForm } from "./project.schema";
function invalid(errors: string[], id?: string): never {
  redirect(
    `/admin/projects/${id ? `${id}/edit` : "new"}?error=${encodeURIComponent(errors.join(" "))}`,
  );
}
export async function createProjectAction(form: FormData) {
  const user = await requireAdmin();
  const parsed = parseProjectForm(form);
  if (!parsed.data) invalid(parsed.errors);
  try {
    await createProject(user.id, parsed.data);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    )
      invalid(["Slug đã tồn tại."]);
    throw error;
  }
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  redirect("/admin/projects?saved=1");
}
export async function updateProjectAction(id: string, form: FormData) {
  await requireAdmin();
  const parsed = parseProjectForm(form);
  if (!parsed.data) invalid(parsed.errors, id);
  try {
    await updateProject(id, parsed.data);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    )
      invalid(["Slug đã tồn tại."], id);
    throw error;
  }
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  redirect("/admin/projects?saved=1");
}
export async function deleteProjectAction(id: string) {
  await requireAdmin();
  await softDeleteProject(id);
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  redirect("/admin/projects?saved=1");
}
