import type { ContentStatus } from "@/generated/prisma/client";
import Link from "next/link";

import {
  getAdminPreviewData,
  type AdminPreviewData,
} from "@/features/public-site/admin-preview.repository";
import { requireAdmin } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

const statusStyles: Record<ContentStatus, string> = {
  DRAFT: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  PUBLISHED: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  HIDDEN: "border-slate-400/30 bg-slate-400/10 text-slate-300",
};

function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

export default async function AdminPreviewPage() {
  await requireAdmin();

  let data: AdminPreviewData | null = null;
  let failed = false;
  try {
    data = await getAdminPreviewData();
  } catch (error) {
    console.error("Unable to load Admin content preview", error);
    failed = true;
  }

  return (
    <main className="mx-auto max-w-6xl px-[var(--page-gutter)] py-10">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-hover">
            Admin-only preview
          </p>
          <h1 className="mt-3 text-3xl font-semibold">
            Xem trước nội dung website
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-foreground-secondary">
            Kiểm tra Draft, Published và Hidden trước khi xuất bản. Nội dung
            trong trang này không được dùng bởi các route công khai.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="rounded-lg border border-border px-4 py-3 text-sm font-semibold text-primary-hover"
        >
          Mở website công khai ↗
        </Link>
      </div>

      {failed ? (
        <section
          className="mt-8 rounded-xl border border-error/30 bg-error/5 p-6"
          role="alert"
        >
          <h2 className="font-semibold">Không thể tải bản xem trước</h2>
          <p className="mt-2 text-sm text-foreground-secondary">
            Kiểm tra kết nối Supabase rồi tải lại trang. Không có draft nào được
            đưa ra public khi preview gặp lỗi.
          </p>
        </section>
      ) : data ? (
        <PreviewContent data={data} />
      ) : null}
    </main>
  );
}

function PreviewContent({ data }: { data: AdminPreviewData }) {
  const allItems = [
    ...data.settings,
    ...data.profiles,
    ...data.experiences,
    ...data.skills,
    ...data.education,
    ...data.sections,
    ...data.projects,
    ...data.posts,
    ...data.faqs,
    ...data.links,
  ];
  const total = allItems.length;
  const draftCount = allItems.filter((item) => item.status === "DRAFT").length;
  const hiddenCount = allItems.filter(
    (item) => item.status === "HIDDEN",
  ).length;

  if (total === 0) {
    return (
      <section className="mt-8 rounded-xl border border-dashed border-border bg-surface p-8">
        <h2 className="text-xl font-semibold">Chưa có nội dung để xem trước</h2>
        <p className="mt-3 text-foreground-secondary">
          Tạo một Profile, Project hoặc Website section trong Admin, lưu ở trạng
          thái Draft rồi quay lại đây.
        </p>
        <Link
          href="/admin/site-content"
          className="mt-5 inline-block text-sm font-semibold text-primary-hover"
        >
          Tạo nội dung website →
        </Link>
      </section>
    );
  }

  return (
    <>
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <Metric label="Tổng nội dung" value={total} />
        <Metric label="Draft đang xem trước" value={draftCount} />
        <Metric label="Published" value={total - draftCount - hiddenCount} />
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <PreviewGroup
          title="Cài đặt website"
          editHref="/admin/settings"
          items={data.settings.map((item) => ({
            id: item.id,
            title: item.siteName ?? "CoffeeHub",
            detail: item.tagline ?? item.seoDescription,
            status: item.status,
          }))}
        />
        <PreviewGroup
          title="Hồ sơ"
          editHref="/admin/profile"
          items={data.profiles.map((item) => ({
            id: item.id,
            title: item.displayName || "Hồ sơ chưa đặt tên",
            detail: item.headline ?? item.bio,
            status: item.status,
          }))}
        />
        <PreviewGroup
          title="Kinh nghiệm"
          editHref="/admin/resume"
          items={data.experiences.map((item) => ({
            id: item.id,
            title: item.role,
            detail: `${item.organization} · thứ tự ${item.displayOrder}`,
            status: item.status,
          }))}
        />
        <PreviewGroup
          title="Kỹ năng"
          editHref="/admin/resume"
          items={data.skills.map((item) => ({
            id: item.id,
            title: item.name,
            detail: `${item.category} · ${item.proficiency}`,
            status: item.status,
          }))}
        />
        <PreviewGroup
          title="Học vấn"
          editHref="/admin/resume"
          items={data.education.map((item) => ({
            id: item.id,
            title: item.degree,
            detail: `${item.institution}${item.fieldOfStudy ? ` · ${item.fieldOfStudy}` : ""}`,
            status: item.status,
          }))}
        />
        <PreviewGroup
          title="Sections"
          editHref="/admin/site-content"
          items={data.sections.map((item) => ({
            id: item.id,
            title: item.heading,
            detail: `${item.pageKey} · thứ tự ${item.displayOrder}`,
            status: item.status,
          }))}
        />
        <PreviewGroup
          title="Dự án"
          editHref="/admin/projects"
          items={data.projects.map((item) => ({
            id: item.id,
            title: item.title,
            detail: item.summary,
            status: item.status,
          }))}
        />
        <PreviewGroup
          title="Bài viết"
          editHref="/admin/site-content"
          items={data.posts.map((item) => ({
            id: item.id,
            title: item.title,
            detail: item.excerpt ?? item.slug,
            status: item.status,
          }))}
        />
        <PreviewGroup
          title="FAQ"
          editHref="/admin/settings"
          items={data.faqs.map((item) => ({
            id: item.id,
            title: item.question,
            detail: item.answer,
            status: item.status,
          }))}
        />
        <PreviewGroup
          title="Điều hướng và liên kết"
          editHref="/admin/settings"
          items={data.links.map((item) => ({
            id: item.id,
            title: item.label,
            detail: `${item.kind} · ${item.url}`,
            status: item.status,
          }))}
        />
      </div>
    </>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <p className="text-sm text-foreground-secondary">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}

type PreviewItem = {
  id: string;
  title: string;
  detail: string | null;
  status: ContentStatus;
};

function PreviewGroup({
  title,
  editHref,
  items,
}: {
  title: string;
  editHref: string;
  items: PreviewItem[];
}) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Link
          href={editHref}
          className="text-sm font-semibold text-primary-hover"
        >
          Chỉnh sửa →
        </Link>
      </div>
      {items.length ? (
        <div className="mt-5 space-y-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-lg border border-border bg-background-secondary p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-semibold">{item.title}</h3>
                <StatusBadge status={item.status} />
              </div>
              {item.detail ? (
                <p className="mt-2 line-clamp-3 whitespace-pre-line text-sm leading-6 text-foreground-secondary">
                  {item.detail}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-5 text-sm text-foreground-secondary">
          Chưa có nội dung trong nhóm này.
        </p>
      )}
    </section>
  );
}
