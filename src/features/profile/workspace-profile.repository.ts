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

export async function getWorkspaceProfileSnapshot(userId: string) {
  const db = getPrisma();
  const [profile, experiences, skills, education, projects] = await Promise.all(
    [
      getWorkspaceProfile(userId),
      db.experience.findMany({
        where: { userId, deletedAt: null },
        select: { status: true },
      }),
      db.skill.findMany({
        where: { userId, deletedAt: null },
        select: { status: true },
      }),
      db.education.findMany({
        where: { userId, deletedAt: null },
        select: { status: true },
      }),
      db.project.findMany({
        where: { userId, deletedAt: null },
        select: { status: true },
      }),
    ],
  );

  const summarize = (items: Array<{ status: string }>) => ({
    total: items.length,
    published: items.filter((item) => item.status === "PUBLISHED").length,
  });

  return {
    profile,
    counts: {
      experiences: summarize(experiences),
      skills: summarize(skills),
      education: summarize(education),
      projects: summarize(projects),
    },
  };
}

export function saveWorkspaceProfile(
  userId: string,
  input: WorkspaceProfileInput,
) {
  return getPrisma().profile.upsert({
    where: { userId },
    create: { userId, ...input },
    update: { ...input, version: { increment: 1 } },
    select: { workspaceName: true, timezone: true },
  });
}
