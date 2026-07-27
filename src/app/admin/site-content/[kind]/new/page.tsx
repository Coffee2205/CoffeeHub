import { notFound } from "next/navigation";
import { createSiteContentAction } from "@/features/site-content/site-content.actions";
import { SiteContentForm } from "@/features/site-content/components/site-content-form";
import { SITE_CONTENT_KINDS, type SiteContentKind } from "@/features/site-content/site-content.schema";
const valid = (kind: string): kind is SiteContentKind => SITE_CONTENT_KINDS.some((item) => item === kind);
export default async function NewSiteContentPage({ params, searchParams }: { params: Promise<{ kind: string }>; searchParams: Promise<{ error?: string }> }) { const [{ kind }, query] = await Promise.all([params, searchParams]); if (!valid(kind)) notFound(); return <main className="mx-auto max-w-4xl px-[var(--page-gutter)] py-10"><h1 className="text-3xl font-semibold">Thêm nội dung website</h1><SiteContentForm kind={kind} action={createSiteContentAction.bind(null, kind)} error={query.error} /></main>; }
