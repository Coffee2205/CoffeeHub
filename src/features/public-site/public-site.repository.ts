import "server-only";

import { getPrisma } from "@/lib/prisma";

const published = { status: "PUBLISHED" as const, deletedAt: null };

export async function getPublicHomeData() {
  const db = getPrisma();

  const [settings, sections, profile, projects, faqs, links] = await Promise.all([
    db.siteSetting.findFirst({ where: published, orderBy: { publishedAt: "desc" } }),
    db.contentSection.findMany({
      where: { ...published, pageKey: "home" },
      orderBy: [{ displayOrder: "asc" }, { publishedAt: "desc" }],
    }),
    db.profile.findFirst({ where: published, orderBy: { publishedAt: "desc" } }),
    db.project.findMany({
      where: published,
      orderBy: [{ displayOrder: "asc" }, { publishedAt: "desc" }],
      take: 6,
    }),
    db.faq.findMany({ where: published, orderBy: [{ displayOrder: "asc" }, { publishedAt: "desc" }] }),
    db.siteLink.findMany({ where: published, orderBy: [{ kind: "asc" }, { displayOrder: "asc" }] }),
  ]);

  return { settings, sections, profile, projects, faqs, links };
}

export type PublicHomeData = Awaited<ReturnType<typeof getPublicHomeData>>;
