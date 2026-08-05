import "server-only";
import type { ContentStatus } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/prisma";
import type { ProjectInput } from "./project.schema";
export const listProjects = () =>
  getPrisma().project.findMany({
    where: { deletedAt: null },
    orderBy: [{ displayOrder: "asc" }, { updatedAt: "desc" }],
  });
export const getProject = (id: string) =>
  getPrisma().project.findFirst({
    where: { id, deletedAt: null },
    include: {
      media: {
        include: { mediaAsset: true },
        orderBy: [{ kind: "asc" }, { displayOrder: "asc" }],
      },
    },
  });
export const countProjects = () =>
  getPrisma().project.count({ where: { deletedAt: null } });
export const createProject = (userId: string, input: ProjectInput) =>
  getPrisma().project.create({
    data: {
      ...input,
      userId,
      status: input.status as ContentStatus,
      publishedAt: input.status === "PUBLISHED" ? new Date() : null,
    },
  });
export const updateProject = (id: string, input: ProjectInput) =>
  getPrisma().project.update({
    where: { id },
    data: {
      ...input,
      status: input.status as ContentStatus,
      publishedAt: input.status === "PUBLISHED" ? new Date() : null,
      version: { increment: 1 },
    },
  });
export const softDeleteProject = (id: string) =>
  getPrisma().project.update({
    where: { id },
    data: { deletedAt: new Date(), version: { increment: 1 } },
  });
