export const STORAGE_LIMITS = {
  imageMaxBytes: 5 * 1024 * 1024,
  imageMimeTypes: ["image/jpeg", "image/png", "image/webp"] as const,
} as const;

export function validateImageUpload(file: Pick<File, "size" | "type">) {
  if (file.size > STORAGE_LIMITS.imageMaxBytes) {
    return { valid: false, reason: "File exceeds the 5 MB image limit." } as const;
  }

  const allowedTypes: readonly string[] = STORAGE_LIMITS.imageMimeTypes;
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, reason: "Unsupported image MIME type." } as const;
  }

  return { valid: true } as const;
}
