import { notFound } from "next/navigation";
import { updateSiteContentAction } from "@/features/site-content/site-content.actions";
import { SiteContentForm } from "@/features/site-content/components/site-content-form";
import { getSiteContentItem } from "@/features/site-content/site-content.repository";
import {
  SITE_CONTENT_KINDS,
  type SiteContentKind,
} from "@/features/site-content/site-content.schema";
const valid = (kind: string): kind is SiteContentKind =>
  SITE_CONTENT_KINDS.some((item) => item === kind);
export default async function EditSiteContentPage({
  params,
  searchParams,
}: {
  params: Promise<{ kind: string; itemId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ kind, itemId }, query] = await Promise.all([params, searchParams]);
  if (!valid(kind)) notFound();
  const item = await getSiteContentItem(kind, itemId);
  if (!item) notFound();
  return (
    <main className="mx-auto max-w-4xl px-[var(--page-gutter)] py-10">
      <h1 className="text-3xl font-semibold">Sửa nội dung website</h1>
      <SiteContentForm
        kind={kind}
        item={item}
        action={updateSiteContentAction.bind(null, kind, itemId)}
        error={query.error}
      />
    </main>
  );
}
