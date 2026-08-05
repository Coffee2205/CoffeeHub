import "server-only";
import type { ContentStatus } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/prisma";
import type {
  EducationInput,
  ExperienceInput,
  ResumeInput,
  ResumeKind,
  SkillInput,
} from "./resume.schema";

const publish = (status: string) =>
  status === "PUBLISHED" ? new Date() : null;
export function listResumeContent() {
  const db = getPrisma();
  return Promise.all([
    db.experience.findMany({
      where: { deletedAt: null },
      orderBy: [{ displayOrder: "asc" }, { updatedAt: "desc" }],
    }),
    db.skill.findMany({
      where: { deletedAt: null },
      orderBy: [{ displayOrder: "asc" }, { updatedAt: "desc" }],
    }),
    db.education.findMany({
      where: { deletedAt: null },
      orderBy: [{ displayOrder: "asc" }, { updatedAt: "desc" }],
    }),
  ]);
}
export function countResumeContent() {
  const db = getPrisma();
  return Promise.all([
    db.experience.count({ where: { deletedAt: null } }),
    db.skill.count({ where: { deletedAt: null } }),
    db.education.count({ where: { deletedAt: null } }),
  ]);
}
export function getResumeItem(kind: ResumeKind, id: string) {
  const db = getPrisma();
  if (kind === "experience")
    return db.experience.findFirst({ where: { id, deletedAt: null } });
  if (kind === "skill")
    return db.skill.findFirst({ where: { id, deletedAt: null } });
  return db.education.findFirst({ where: { id, deletedAt: null } });
}
export function createResumeItem(
  kind: ResumeKind,
  userId: string,
  input: ResumeInput,
) {
  const db = getPrisma();
  const status = input.status as ContentStatus;
  if (kind === "experience")
    return db.experience.create({
      data: {
        ...(input as ExperienceInput),
        userId,
        status,
        publishedAt: publish(status),
      },
    });
  if (kind === "skill")
    return db.skill.create({
      data: {
        ...(input as SkillInput),
        userId,
        status,
        publishedAt: publish(status),
      },
    });
  return db.education.create({
    data: {
      ...(input as EducationInput),
      userId,
      status,
      publishedAt: publish(status),
    },
  });
}
export function updateResumeItem(
  kind: ResumeKind,
  id: string,
  input: ResumeInput,
) {
  const db = getPrisma();
  const status = input.status as ContentStatus;
  const data = {
    ...input,
    status,
    publishedAt: publish(status),
    version: { increment: 1 },
  };
  if (kind === "experience")
    return db.experience.update({
      where: { id },
      data: data as ExperienceInput & {
        status: ContentStatus;
        publishedAt: Date | null;
        version: { increment: number };
      },
    });
  if (kind === "skill")
    return db.skill.update({
      where: { id },
      data: data as SkillInput & {
        status: ContentStatus;
        publishedAt: Date | null;
        version: { increment: number };
      },
    });
  return db.education.update({
    where: { id },
    data: data as EducationInput & {
      status: ContentStatus;
      publishedAt: Date | null;
      version: { increment: number };
    },
  });
}
export function softDeleteResumeItem(kind: ResumeKind, id: string) {
  const db = getPrisma();
  const data = { deletedAt: new Date(), version: { increment: 1 } };
  if (kind === "experience")
    return db.experience.update({ where: { id }, data });
  if (kind === "skill") return db.skill.update({ where: { id }, data });
  return db.education.update({ where: { id }, data });
}
