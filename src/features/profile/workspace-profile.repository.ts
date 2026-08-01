import "server-only";

import { getPrisma } from "@/lib/prisma";
import type { WorkspaceProfileInput } from "./workspace-profile.schema";

export function getWorkspaceProfile(userId: string) {
  return getPrisma().profile.findFirst({
    where: { userId, deletedAt: null },
    select: {
      workspaceName: true,
      timezone: true,
      displayName: true,
      headline: true,
      status: true,
      publishedAt: true,
    },
  });
}

export function saveWorkspaceProfile(userId: string, input: WorkspaceProfileInput) {
  return getPrisma().profile.upsert({
    where: { userId },
    create: { userId, ...input },
    update: { ...input, version: { increment: 1 } },
    select: { workspaceName: true, timezone: true },
  });
}
