export const STORAGE_LIMITS = {
  imageMaxBytes: 5 * 1024 * 1024,
  imageMimeTypes: ["image/jpeg", "image/png", "image/webp"] as const,
} as const;

export function validateImageUpload(file: Pick<File, "size" | "type">) {
  if (file.size <= 0) {
    return { valid: false, reason: "File is empty." } as const;
  }
  if (file.size > STORAGE_LIMITS.imageMaxBytes) {
    return { valid: false, reason: "File exceeds the 5 MB image limit." } as const;
  }

  const allowedTypes: readonly string[] = STORAGE_LIMITS.imageMimeTypes;
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, reason: "Unsupported image MIME type." } as const;
  }

  return { valid: true } as const;
}

const EXTENSIONS: Record<(typeof STORAGE_LIMITS.imageMimeTypes)[number], string> = {
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp",
};

export function projectImagePath(userId: string, projectId: string, mimeType: string, assetId: string) {
  const extension = EXTENSIONS[mimeType as keyof typeof EXTENSIONS];
  if (!extension || !/^[0-9a-f-]{36}$/i.test(userId) || !/^[0-9a-f-]{36}$/i.test(projectId) || !/^[0-9a-f-]{36}$/i.test(assetId)) {
    throw new Error("Invalid project image path input.");
  }
  return `${userId}/${projectId}/${assetId}.${extension}`;
}

export function profileAvatarPath(userId: string, mimeType: string, assetId: string) {
  const extension = EXTENSIONS[mimeType as keyof typeof EXTENSIONS];
  if (!extension || !/^[0-9a-f-]{36}$/i.test(userId) || !/^[0-9a-f-]{36}$/i.test(assetId)) {
    throw new Error("Invalid profile avatar path input.");
  }
  return `${userId}/profile/${assetId}.${extension}`;
}
