import Link from "next/link";
import { Button } from "@/components/ui";
import { deleteProjectAction } from "@/features/projects/project.actions";
import { DeleteProjectButton } from "@/features/projects/components/delete-project-button";
import { listProjects } from "@/features/projects/project.repository";
import { isProjectOngoing } from "@/features/projects/project.schema";
export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [projects, query] = await Promise.all([listProjects(), searchParams]);
  return (
    <main className="mx-auto max-w-6xl px-[var(--page-gutter)] py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Projects</h1>
          <p className="mt-2 text-foreground-secondary">
            Tạo, sửa, xuất bản, ẩn và xóa mềm.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="rounded-sm bg-primary-control px-4 py-3 text-sm font-semibold text-white"
        >
          Project mới
        </Link>
      </div>
      {query.saved ? (
        <p
          role="status"
          className="mt-5 rounded-sm border border-success/40 bg-success/10 p-3 text-sm text-green-200"
        >
          Thay đổi đã được lưu.
        </p>
      ) : null}
      <div className="mt-6 grid gap-3">
        {projects.length ? (
          projects.map((project) => (
            <article
              key={project.id}
              className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 sm:flex-row sm:items-center"
            >
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold">{project.title}</h2>
                <p className="truncate text-sm text-foreground-secondary">
                  /{project.slug} · {project.status} ·{" "}
                  {isProjectOngoing(project.startedAt, project.endedAt)
                    ? "Đang thực hiện"
                    : `thứ tự ${project.displayOrder}`}
                </p>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/projects/${project.id}/edit`}>
                  <Button variant="secondary" size="sm">
                    Sửa
                  </Button>
                </Link>
                <DeleteProjectButton
                  action={deleteProjectAction.bind(null, project.id)}
                />
              </div>
            </article>
          ))
        ) : (
          <p className="rounded-lg border border-dashed border-border p-8 text-center text-foreground-secondary">
            Chưa có project.
          </p>
        )}
      </div>
    </main>
  );
}
