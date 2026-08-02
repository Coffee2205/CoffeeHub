import "server-only";

import { getPrisma } from "@/lib/prisma";

export async function getAdminPreviewData() {
  const db = getPrisma();

  const [settings, profiles, experiences, skills, education, sections, projects, posts, faqs, links] = await Promise.all([
    db.siteSetting.findMany({
      where: { deletedAt: null },
      orderBy: { updatedAt: "desc" },
    }),
    db.profile.findMany({
      where: { deletedAt: null },
      orderBy: { updatedAt: "desc" },
    }),
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
    db.contentSection.findMany({
      where: { deletedAt: null },
      orderBy: [{ pageKey: "asc" }, { displayOrder: "asc" }, { updatedAt: "desc" }],
    }),
    db.project.findMany({
      where: { deletedAt: null },
      orderBy: [{ displayOrder: "asc" }, { updatedAt: "desc" }],
    }),
    db.post.findMany({
      where: { deletedAt: null },
      orderBy: [{ displayOrder: "asc" }, { updatedAt: "desc" }],
    }),
    db.faq.findMany({
      where: { deletedAt: null },
      orderBy: [{ displayOrder: "asc" }, { updatedAt: "desc" }],
    }),
    db.siteLink.findMany({
      where: { deletedAt: null },
      orderBy: [{ kind: "asc" }, { displayOrder: "asc" }, { updatedAt: "desc" }],
    }),
  ]);

  return { settings, profiles, experiences, skills, education, sections, projects, posts, faqs, links };
}

export type AdminPreviewData = Awaited<ReturnType<typeof getAdminPreviewData>>;
