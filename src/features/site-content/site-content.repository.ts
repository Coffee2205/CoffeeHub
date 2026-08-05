import "server-only";

import type { ContentStatus } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/prisma";
import { normalizeMultilineText } from "@/lib/text/normalize-multiline-text";
import type {
  PostInput,
  SectionInput,
  SiteContentInput,
  SiteContentKind,
} from "./site-content.schema";

const publishedAt = (status: string) =>
  status === "PUBLISHED" ? new Date() : null;
const normalizeInput = <T extends SiteContentInput>(input: T): T => ({
  ...input,
  body: normalizeMultilineText(input.body),
});

export function listSiteContent() {
  const db = getPrisma();
  return Promise.all([
    db.post.findMany({
      where: { deletedAt: null },
      orderBy: [{ displayOrder: "asc" }, { updatedAt: "desc" }],
    }),
    db.contentSection.findMany({
      where: { deletedAt: null },
      orderBy: [{ pageKey: "asc" }, { displayOrder: "asc" }],
    }),
  ]);
}

export function countSiteContent() {
  const db = getPrisma();
  return Promise.all([
    db.post.count({ where: { deletedAt: null } }),
    db.contentSection.count({ where: { deletedAt: null } }),
  ]);
}

export function getSiteContentItem(kind: SiteContentKind, id: string) {
  const db = getPrisma();
  return kind === "post"
    ? db.post.findFirst({ where: { id, deletedAt: null } })
    : db.contentSection.findFirst({ where: { id, deletedAt: null } });
}

export function createSiteContentItem(
  kind: SiteContentKind,
  userId: string,
  input: SiteContentInput,
) {
  const db = getPrisma();
  const normalizedInput = normalizeInput(input);
  const status = normalizedInput.status as ContentStatus;
  return kind === "post"
    ? db.post.create({
        data: {
          ...(normalizedInput as PostInput),
          userId,
          status,
          publishedAt: publishedAt(status),
        },
      })
    : db.contentSection.create({
        data: {
          ...(normalizedInput as SectionInput),
          userId,
          status,
          publishedAt: publishedAt(status),
        },
      });
}

export function updateSiteContentItem(
  kind: SiteContentKind,
  id: string,
  input: SiteContentInput,
) {
  const db = getPrisma();
  const normalizedInput = normalizeInput(input);
  const status = normalizedInput.status as ContentStatus;
  const common = {
    status,
    publishedAt: publishedAt(status),
    version: { increment: 1 },
  };
  return kind === "post"
    ? db.post.update({
        where: { id },
        data: { ...(normalizedInput as PostInput), ...common },
      })
    : db.contentSection.update({
        where: { id },
        data: { ...(normalizedInput as SectionInput), ...common },
      });
}

export function softDeleteSiteContentItem(kind: SiteContentKind, id: string) {
  const db = getPrisma();
  const data = { deletedAt: new Date(), version: { increment: 1 } };
  return kind === "post"
    ? db.post.update({ where: { id }, data })
    : db.contentSection.update({ where: { id }, data });
}
