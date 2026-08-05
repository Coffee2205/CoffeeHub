import Link from "next/link";
import { deleteSiteContentAction } from "@/features/site-content/site-content.actions";
import { DeleteContentButton } from "@/features/site-content/components/delete-content-button";
import { listSiteContent } from "@/features/site-content/site-content.repository";
export default async function SiteContentPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [[posts, sections], query] = await Promise.all([
    listSiteContent(),
    searchParams,
  ]);
  return (
    <main className="mx-auto max-w-6xl px-[var(--page-gutter)] py-10">
      <h1 className="text-3xl font-semibold">Nội dung website</h1>
      <p className="mt-2 text-foreground-secondary">
        Quản lý bài viết và các section theo từng page.
      </p>
      {query.saved ? (
        <p
          role="status"
          className="mt-5 rounded-sm border border-success/40 bg-success/10 p-3 text-sm text-green-200"
        >
          Thay đổi đã được lưu.
        </p>
      ) : null}
      <ContentList
        title="Bài viết"
        kind="post"
        items={posts.map((item) => ({
          id: item.id,
          label: item.title,
          meta: `/${item.slug}`,
          status: item.status,
          order: item.displayOrder,
        }))}
      />
      <ContentList
        title="Page sections"
        kind="section"
        items={sections.map((item) => ({
          id: item.id,
          label: item.heading,
          meta: `${item.pageKey}/${item.sectionKey}`,
          status: item.status,
          order: item.displayOrder,
        }))}
      />
    </main>
  );
}
function ContentList({
  title,
  kind,
  items,
}: {
  title: string;
  kind: "post" | "section";
  items: Array<{
    id: string;
    label: string;
    meta: string;
    status: string;
    order: number;
  }>;
}) {
  return (
    <section className="mt-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Link
          href={`/admin/site-content/${kind}/new`}
          className="rounded-sm bg-primary-control px-4 py-3 text-sm font-semibold text-white"
        >
          Thêm mới
        </Link>
      </div>
      <div className="mt-3 grid gap-3">
        {items.length ? (
          items.map((item) => (
            <article
              key={item.id}
              className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 sm:flex-row sm:items-center"
            >
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold">{item.label}</h3>
                <p className="text-sm text-foreground-secondary">
                  {item.meta} · {item.status} · thứ tự {item.order}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/site-content/${kind}/${item.id}/edit`}
                  className="inline-flex min-h-10 items-center rounded-sm border border-border-strong bg-surface-strong px-3.5 text-sm font-semibold"
                >
                  Sửa
                </Link>
                <DeleteContentButton
                  action={deleteSiteContentAction.bind(null, kind, item.id)}
                />
              </div>
            </article>
          ))
        ) : (
          <p className="rounded-lg border border-dashed border-border p-6 text-center text-foreground-secondary">
            Chưa có nội dung.
          </p>
        )}
      </div>
    </section>
  );
}
