import "server-only";

import { cache } from "react";

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

export const getPublicChrome = cache(async () => {
  const db = getPrisma();
  const [settings, links] = await Promise.all([
    db.siteSetting.findFirst({ where: published, orderBy: { publishedAt: "desc" } }),
    db.siteLink.findMany({ where: published, orderBy: [{ kind: "asc" }, { displayOrder: "asc" }] }),
  ]);
  return { settings, links };
});

export const getPublicAbout = cache(async () => {
  const db = getPrisma();
  const [profile, experiences, skills, education] = await Promise.all([
    db.profile.findFirst({ where: published, orderBy: { publishedAt: "desc" } }),
    db.experience.findMany({ where: published, orderBy: [{ displayOrder: "asc" }, { startedAt: "desc" }] }),
    db.skill.findMany({ where: published, orderBy: [{ displayOrder: "asc" }, { name: "asc" }] }),
    db.education.findMany({ where: published, orderBy: [{ displayOrder: "asc" }, { startedAt: "desc" }] }),
  ]);
  return { profile, experiences, skills, education };
});

export const listPublicProjects = cache(() => getPrisma().project.findMany({
  where: published,
  orderBy: [{ displayOrder: "asc" }, { publishedAt: "desc" }],
}));

export const getPublicProject = cache((slug: string) => getPrisma().project.findFirst({
  where: { ...published, slug },
}));

export const listPublicPosts = cache(() => getPrisma().post.findMany({
  where: published,
  orderBy: [{ displayOrder: "asc" }, { publishedAt: "desc" }],
}));

export const getPublicPost = cache((slug: string) => getPrisma().post.findFirst({
  where: { ...published, slug },
}));
