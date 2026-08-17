import Link from "next/link";
import { Badge, Card, EmptyState, Input } from "@/components/ui";
import { listChecklists } from "@/features/checklists/checklist.repository";
import { summarizeChecklistItems } from "@/features/checklists/checklist.schema";
import { requireUser } from "@/lib/supabase/auth";

type Query = { q?: string; archived?: string; error?: string };

function contextLabel(
  checklist: Awaited<ReturnType<typeof listChecklists>>[number],
) {
  if (checklist.goal) return `Goal · ${checklist.goal.title}`;
  if (checklist.roadmap)
    return `Roadmap · ${checklist.roadmap.goal.title} / ${checklist.roadmap.title}`;
  if (checklist.task)
    return `Task · ${checklist.task.goal?.title ?? "Không có Goal"}${checklist.task.roadmap ? ` / ${checklist.task.roadmap.title}` : ""} / ${checklist.task.title}`;
  return "Checklist độc lập";
}

export default async function ChecklistsPage({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  const user = await requireUser();
  const [checklists, query] = await Promise.all([
    listChecklists(user.id, { q: undefined }),
    searchParams,
  ]);
  const filtered = query.q?.trim()
    ? checklists.filter((checklist) => {
        const search = query.q!.trim().toLowerCase();
        return (
          checklist.title.toLowerCase().includes(search) ||
          (checklist.description ?? "").toLowerCase().includes(search)
        );
      })
    : checklists;
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="primary">Workspace</Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            Checklists
          </h1>
          <p className="mt-2 text-foreground-secondary">
            Danh sách xác minh độc lập, có item toggle và tiến độ riêng.
          </p>
        </div>
        <Link
          href="/app/checklists/new"
          className="inline-flex min-h-11 items-center justify-center rounded-sm bg-primary-control px-4 text-sm font-semibold text-white hover:bg-primary-control-hover"
        >
          Tạo Checklist
        </Link>
      </header>
      {query.archived ? (
        <p
          role="status"
          className="rounded-sm border border-success/30 bg-success/10 px-4 py-3 text-sm text-green-200"
        >
          Checklist đã được lưu trữ.
        </p>
      ) : null}
      {query.error ? (
        <p
          role="alert"
          className="rounded-sm border border-error/30 bg-error/10 px-4 py-3 text-sm text-red-200"
        >
          {query.error}
        </p>
      ) : null}
      <form className="max-w-xl" role="search">
        <Input
          name="q"
          defaultValue={query.q}
          placeholder="Tìm theo tiêu đề hoặc mô tả"
          aria-label="Tìm Checklist"
        />
      </form>
      {filtered.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((checklist) => {
            const summary = summarizeChecklistItems(checklist.items);
            return (
              <Link key={checklist.id} href={`/app/checklists/${checklist.id}`}>
                <Card className="h-full hover:border-primary">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Badge
                        variant={
                          summary.progress === 100 ? "success" : "neutral"
                        }
                      >
                        {summary.progress}%
                      </Badge>
                      <h2 className="mt-3 text-xl font-semibold">
                        {checklist.title}
                      </h2>
                    </div>
                    <span className="text-xs font-semibold text-foreground-secondary">
                      {summary.completed}/{summary.total}
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
                    {checklist.description || "Chưa có mô tả."}
                  </p>
                  <p className="mt-4 text-xs text-muted">
                    {contextLabel(checklist)}
                  </p>
                  {checklist.task?.dueAt ? (
                    <p className="mt-2 text-xs font-semibold text-foreground-secondary">
                      Hạn Task: {checklist.task.dueAt.toLocaleDateString("vi-VN")}
                    </p>
                  ) : null}
                  <div
                    className="mt-3 h-2 overflow-hidden rounded-full bg-background-tertiary"
                    role="progressbar"
                    aria-label={`Tiến độ ${checklist.title}`}
                    aria-valuenow={summary.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${summary.progress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted">
                    {summary.total
                      ? `${summary.completed}/${summary.total} item hoàn thành`
                      : "Chưa có item"}
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title={query.q ? "Không tìm thấy Checklist" : "Chưa có Checklist"}
          description={
            query.q
              ? "Thử một từ khóa khác."
              : "Tạo Checklist đầu tiên để quản lý các item xác minh riêng."
          }
          action={
            <Link
              href="/app/checklists/new"
              className="inline-flex min-h-11 items-center rounded-sm bg-primary-control px-4 text-sm font-semibold text-white"
            >
              Tạo Checklist đầu tiên
            </Link>
          }
        />
      )}
    </div>
  );
}
