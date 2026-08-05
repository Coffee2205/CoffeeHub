import Link from "next/link";
import { Button } from "@/components/ui";
import { deleteResumeAction } from "@/features/resume/resume.actions";
import { DeleteResumeButton } from "@/features/resume/components/delete-resume-button";
import { listResumeContent } from "@/features/resume/resume.repository";
const sections = [
  { kind: "experience" as const, title: "Kinh nghiệm" },
  { kind: "skill" as const, title: "Kỹ năng" },
  { kind: "education" as const, title: "Học vấn" },
];
export default async function ResumePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [[experiences, skills, education], query] = await Promise.all([
    listResumeContent(),
    searchParams,
  ]);
  const records = {
    experience: experiences.map((item) => ({
      ...item,
      label: `${item.role} · ${item.organization}`,
    })),
    skill: skills.map((item) => ({
      ...item,
      label: `${item.name} · ${item.category}`,
    })),
    education: education.map((item) => ({
      ...item,
      label: `${item.degree} · ${item.institution}`,
    })),
  };
  return (
    <main className="mx-auto max-w-6xl px-[var(--page-gutter)] py-10">
      <div>
        <h1 className="text-3xl font-semibold">Hồ sơ nghề nghiệp</h1>
        <p className="mt-2 text-foreground-secondary">
          Quản lý kinh nghiệm, kỹ năng và học vấn.
        </p>
      </div>
      {query.saved ? (
        <p
          role="status"
          className="mt-5 rounded-sm border border-success/40 bg-success/10 p-3 text-sm text-green-200"
        >
          Thay đổi đã được lưu.
        </p>
      ) : null}
      <div className="mt-8 grid gap-8">
        {sections.map(({ kind, title }) => (
          <section key={kind}>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">{title}</h2>
              <Link
                href={`/admin/resume/${kind}/new`}
                className="rounded-sm bg-primary-control px-4 py-3 text-sm font-semibold text-white"
              >
                Thêm mới
              </Link>
            </div>
            <div className="mt-3 grid gap-3">
              {records[kind].length ? (
                records[kind].map((item) => (
                  <article
                    key={item.id}
                    className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 sm:flex-row sm:items-center"
                  >
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold">{item.label}</h3>
                      <p className="text-sm text-foreground-secondary">
                        {item.status} · thứ tự {item.displayOrder}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/resume/${kind}/${item.id}/edit`}>
                        <Button variant="secondary" size="sm">
                          Sửa
                        </Button>
                      </Link>
                      <DeleteResumeButton
                        action={deleteResumeAction.bind(null, kind, item.id)}
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
        ))}
      </div>
    </main>
  );
}
