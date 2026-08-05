"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getPrisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { profileAvatarPath, validateImageUpload } from "@/lib/supabase/storage";
import { PROFILE_AVATAR_BUCKET } from "./profile-avatar";

function avatarError(message: string): never {
  redirect(`/admin/profile?avatarError=${encodeURIComponent(message)}`);
}

function revalidateAvatarRoutes() {
  revalidatePath("/admin/profile");
  revalidatePath("/admin/preview");
  revalidatePath("/");
  revalidatePath("/about");
}

export async function uploadProfileAvatarAction(form: FormData) {
  const user = await requireAdmin();
  const prisma = getPrisma();
  const profile = await prisma.profile.findFirst({
    where: { userId: user.id, deletedAt: null },
  });
  if (!profile) avatarError("Hãy lưu thông tin Profile trước khi tải avatar.");

  const file = form.get("file");
  const altText = String(form.get("altText") ?? "").trim();
  if (!(file instanceof File)) avatarError("Hãy chọn một ảnh avatar.");
  const validation = validateImageUpload(file);
  if (!validation.valid) avatarError(validation.reason);
  if (!altText || altText.length > 240)
    avatarError("Alt text phải có 1–240 ký tự.");

  const objectPath = profileAvatarPath(user.id, file.type, randomUUID());
  const supabase = await createClient();
  const { error: uploadError } = await supabase.storage
    .from(PROFILE_AVATAR_BUCKET)
    .upload(objectPath, file, {
      contentType: file.type,
      upsert: false,
      cacheControl: "3600",
    });
  if (uploadError) avatarError("Không thể tải avatar lên Storage.");

  try {
    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        avatarPath: objectPath,
        avatarAlt: altText,
        avatarMimeType: file.type,
        avatarSizeBytes: file.size,
        version: { increment: 1 },
      },
    });
  } catch (error) {
    await supabase.storage.from(PROFILE_AVATAR_BUCKET).remove([objectPath]);
    throw error;
  }

  if (profile.avatarPath) {
    const { error: cleanupError } = await supabase.storage
      .from(PROFILE_AVATAR_BUCKET)
      .remove([profile.avatarPath]);
    if (cleanupError) {
      await prisma.profile.update({
        where: { id: profile.id },
        data: {
          avatarPath: profile.avatarPath,
          avatarAlt: profile.avatarAlt,
          avatarMimeType: profile.avatarMimeType,
          avatarSizeBytes: profile.avatarSizeBytes,
        },
      });
      await supabase.storage.from(PROFILE_AVATAR_BUCKET).remove([objectPath]);
      avatarError("Không thể dọn avatar cũ; thay đổi đã được hoàn tác.");
    }
  }

  revalidateAvatarRoutes();
  redirect("/admin/profile?avatarSaved=1");
}

export async function deleteProfileAvatarAction() {
  const user = await requireAdmin();
  const prisma = getPrisma();
  const profile = await prisma.profile.findFirst({
    where: { userId: user.id, deletedAt: null },
  });
  if (!profile?.avatarPath) avatarError("Profile chưa có avatar để xóa.");

  await prisma.profile.update({
    where: { id: profile.id },
    data: {
      avatarPath: null,
      avatarAlt: null,
      avatarMimeType: null,
      avatarSizeBytes: null,
      version: { increment: 1 },
    },
  });
  const supabase = await createClient();
  const { error } = await supabase.storage
    .from(PROFILE_AVATAR_BUCKET)
    .remove([profile.avatarPath]);
  if (error) {
    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        avatarPath: profile.avatarPath,
        avatarAlt: profile.avatarAlt,
        avatarMimeType: profile.avatarMimeType,
        avatarSizeBytes: profile.avatarSizeBytes,
      },
    });
    avatarError(
      "Không thể xóa avatar khỏi Storage; thay đổi đã được hoàn tác.",
    );
  }

  revalidateAvatarRoutes();
  redirect("/admin/profile?avatarDeleted=1");
}
