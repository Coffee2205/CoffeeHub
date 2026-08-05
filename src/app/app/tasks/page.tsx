import Link from "next/link";
import { Badge, Card, EmptyState, Input } from "@/components/ui";
import { TaskToggle } from "@/features/tasks/components/task-toggle";
import { listTasks } from "@/features/tasks/task.repository";
import {
  isTaskOverdue,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from "@/features/tasks/task.schema";
import { requireUser } from "@/lib/supabase/auth";
type Query = {
  q?: string;
  status?: string;
  priority?: string;
  archived?: string;
};
export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  const user = await requireUser();
  const query = await searchParams;
  const tasks = await listTasks(user.id, query);
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="primary">Workspace</Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            Tasks
          </h1>
          <p className="mt-2 text-foreground-secondary">
            Theo dõi việc cần làm, deadline và tiến độ trong một nơi.
          </p>
        </div>
        <Link
          href="/app/tasks/new"
          className="inline-flex min-h-11 items-center justify-center rounded-sm bg-primary-control px-4 text-sm font-semibold text-white hover:bg-primary-control-hover"
        >
          Tạo Task
        </Link>
      </header>
      {query.archived ? (
        <p
          role="status"
          className="rounded-sm border border-success/30 bg-success/10 px-4 py-3 text-sm text-green-200"
        >
          Task đã được lưu trữ.
        </p>
      ) : null}
      <form className="grid gap-3 rounded-lg border border-border bg-surface p-4 sm:grid-cols-4">
        <Input
          name="q"
          defaultValue={query.q}
          placeholder="Tìm tiêu đề hoặc mô tả"
          aria-label="Tìm Task"
        />
        <select
          name="status"
          defaultValue={query.status ?? ""}
          className="min-h-11 rounded-sm border border-border bg-background-secondary px-3"
        >
          <option value="">Mọi trạng thái</option>
          {TASK_STATUSES.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select
          name="priority"
          defaultValue={query.priority ?? ""}
          className="min-h-11 rounded-sm border border-border bg-background-secondary px-3"
        >
          <option value="">Mọi ưu tiên</option>
          {TASK_PRIORITIES.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <button className="min-h-11 rounded-sm border border-border px-4 font-semibold hover:border-primary">
          Lọc / tìm
        </button>
      </form>
      {tasks.length === 0 ? (
        <EmptyState
          title="Không có Task phù hợp"
          description="Tạo Task mới hoặc thay đổi bộ lọc để tiếp tục."
          action={
            <Link
              href="/app/tasks/new"
              className="inline-flex min-h-11 items-center rounded-sm bg-primary-control px-4 text-sm font-semibold text-white"
            >
              Tạo Task đầu tiên
            </Link>
          }
        />
      ) : (
        <div className="grid gap-3">
          {tasks.map((task) => {
            const overdue = isTaskOverdue(task.dueAt, task.status);
            return (
              <Card
                key={task.id}
                className="flex flex-col gap-4 sm:flex-row sm:items-center"
              >
                <TaskToggle
                  taskId={task.id}
                  initialCompleted={task.status === "COMPLETED"}
                />
                <Link href={`/app/tasks/${task.id}`} className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2
                      className={`font-semibold ${task.status === "COMPLETED" ? "text-muted line-through" : ""}`}
                    >
                      {task.title}
                    </h2>
                    <Badge
                      variant={
                        task.status === "COMPLETED" ? "success" : "neutral"
                      }
                    >
                      {overdue ? "OVERDUE" : task.status}
                    </Badge>
                    <span className="text-xs font-semibold text-muted">
                      {task.priority}
                    </span>
                  </div>
                  <p className="mt-2 truncate text-sm text-muted">
                    {task.goal?.title ?? "Không có Goal"}
                    {task.roadmapStage ? ` · ${task.roadmapStage.title}` : ""}
                  </p>
                </Link>
                <span
                  className={
                    overdue ? "text-sm text-red-300" : "text-sm text-muted"
                  }
                >
                  {task.dueAt
                    ? task.dueAt.toLocaleDateString("vi-VN", {
                        timeZone: "UTC",
                      })
                    : "Chưa có hạn"}
                </span>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
