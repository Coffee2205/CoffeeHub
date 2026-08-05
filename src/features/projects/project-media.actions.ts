"use server";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPrisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { projectImagePath, validateImageUpload } from "@/lib/supabase/storage";

const BUCKET = "project-media";
const idPattern = /^[0-9a-f-]{36}$/i;
function mediaError(projectId: string, message: string): never {
  redirect(
    `/admin/projects/${projectId}/edit?mediaError=${encodeURIComponent(message)}`,
  );
}

export async function uploadProjectMediaAction(
  projectId: string,
  form: FormData,
) {
  const user = await requireAdmin();
  if (!idPattern.test(projectId))
    mediaError(projectId, "Project không hợp lệ.");
  const project = await getPrisma().project.findFirst({
    where: { id: projectId, deletedAt: null },
  });
  if (!project) mediaError(projectId, "Không tìm thấy project.");
  const file = form.get("file");
  const altText = String(form.get("altText") ?? "").trim();
  const kind = form.get("kind") === "COVER" ? "COVER" : "GALLERY";
  if (!(file instanceof File)) mediaError(projectId, "Hãy chọn một ảnh.");
  const validation = validateImageUpload(file);
  if (!validation.valid) mediaError(projectId, validation.reason);
  if (!altText || altText.length > 240)
    mediaError(projectId, "Alt text phải có 1–240 ký tự.");
  const assetId = randomUUID();
  const objectPath = projectImagePath(user.id, projectId, file.type, assetId);
  const supabase = await createClient();
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(objectPath, file, {
      contentType: file.type,
      upsert: false,
      cacheControl: "3600",
    });
  if (uploadError) mediaError(projectId, "Không thể upload ảnh.");
  try {
    await getPrisma().$transaction(async (tx) => {
      if (kind === "COVER")
        await tx.projectMedia.updateMany({
          where: { projectId, kind: "COVER" },
          data: { kind: "GALLERY" },
        });
      const asset = await tx.mediaAsset.create({
        data: {
          id: assetId,
          userId: user.id,
          bucket: BUCKET,
          objectPath,
          originalName: file.name.slice(0, 255),
          mimeType: file.type,
          sizeBytes: file.size,
          altText,
        },
      });
      await tx.projectMedia.create({
        data: { projectId, mediaAssetId: asset.id, kind },
      });
    });
  } catch (error) {
    await supabase.storage.from(BUCKET).remove([objectPath]);
    throw error;
  }
  revalidatePath(`/admin/projects/${projectId}/edit`);
  redirect(`/admin/projects/${projectId}/edit?mediaSaved=1`);
}

export async function deleteProjectMediaAction(
  projectId: string,
  mediaAssetId: string,
) {
  await requireAdmin();
  const prisma = getPrisma();
  const item = await prisma.projectMedia.findUnique({
    where: { projectId_mediaAssetId: { projectId, mediaAssetId } },
    include: { mediaAsset: true },
  });
  if (!item) mediaError(projectId, "Không tìm thấy ảnh.");
  const supabase = await createClient();
  await prisma.$transaction(async (tx) => {
    await tx.projectMedia.delete({
      where: { projectId_mediaAssetId: { projectId, mediaAssetId } },
    });
    await tx.mediaAsset.update({
      where: { id: mediaAssetId },
      data: { deletedAt: new Date() },
    });
    const { error } = await supabase.storage
      .from(item.mediaAsset.bucket)
      .remove([item.mediaAsset.objectPath]);
    if (error) throw new Error("Storage cleanup failed.");
  });
  revalidatePath(`/admin/projects/${projectId}/edit`);
  redirect(`/admin/projects/${projectId}/edit?mediaSaved=1`);
}
