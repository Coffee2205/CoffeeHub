import "server-only";
import type { ContentStatus } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/prisma";
import type { ProfileInput } from "./profile.schema";
export const getAdminProfile = (userId: string) =>
  getPrisma().profile.findUnique({ where: { userId } });
export const saveAdminProfile = (userId: string, input: ProfileInput) =>
  getPrisma().profile.upsert({
    where: { userId },
    create: {
      userId,
      ...input,
      status: input.status as ContentStatus,
      publishedAt: input.status === "PUBLISHED" ? new Date() : null,
    },
    update: {
      ...input,
      status: input.status as ContentStatus,
      publishedAt: input.status === "PUBLISHED" ? new Date() : null,
      deletedAt: null,
      version: { increment: 1 },
    },
  });
