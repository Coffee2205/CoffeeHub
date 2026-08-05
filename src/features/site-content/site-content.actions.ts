"use server";
import { Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/auth";
import {
  createSiteContentItem,
  softDeleteSiteContentItem,
  updateSiteContentItem,
} from "./site-content.repository";
import {
  parseSiteContentForm,
  SITE_CONTENT_KINDS,
  type SiteContentKind,
} from "./site-content.schema";
const valid = (kind: string): kind is SiteContentKind =>
  SITE_CONTENT_KINDS.some((item) => item === kind);
function refresh() {
  revalidatePath("/admin");
  revalidatePath("/admin/site-content");
}
function duplicate(kind: SiteContentKind, id?: string): never {
  const path = id ? `${kind}/${id}/edit` : `${kind}/new`;
  redirect(
    `/admin/site-content/${path}?error=${encodeURIComponent(kind === "post" ? "Slug đã tồn tại." : "Page key và section key đã tồn tại.")}`,
  );
}
export async function createSiteContentAction(
  kindValue: string,
  form: FormData,
) {
  const user = await requireAdmin();
  if (!valid(kindValue)) notFound();
  const parsed = parseSiteContentForm(kindValue, form);
  if (!parsed.data)
    redirect(
      `/admin/site-content/${kindValue}/new?error=${encodeURIComponent(parsed.errors.join(" "))}`,
    );
  try {
    await createSiteContentItem(kindValue, user.id, parsed.data);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    )
      duplicate(kindValue);
    throw error;
  }
  refresh();
  redirect("/admin/site-content?saved=1");
}
export async function updateSiteContentAction(
  kindValue: string,
  id: string,
  form: FormData,
) {
  await requireAdmin();
  if (!valid(kindValue)) notFound();
  const parsed = parseSiteContentForm(kindValue, form);
  if (!parsed.data)
    redirect(
      `/admin/site-content/${kindValue}/${id}/edit?error=${encodeURIComponent(parsed.errors.join(" "))}`,
    );
  try {
    await updateSiteContentItem(kindValue, id, parsed.data);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    )
      duplicate(kindValue, id);
    throw error;
  }
  refresh();
  redirect("/admin/site-content?saved=1");
}
export async function deleteSiteContentAction(kindValue: string, id: string) {
  await requireAdmin();
  if (!valid(kindValue)) notFound();
  await softDeleteSiteContentItem(kindValue, id);
  refresh();
  redirect("/admin/site-content?saved=1");
}
