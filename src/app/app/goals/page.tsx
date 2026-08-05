import Link from "next/link";
import { Badge, Card, EmptyState } from "@/components/ui";
import { TaskStatus } from "@/generated/prisma/client";
import { listGoals } from "@/features/goals/goal.repository";
import { requireUser } from "@/lib/supabase/auth";

type Query = { archived?: string; error?: string };

export default async function GoalsPage({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  const user = await requireUser();
  const [goals, query] = await Promise.all([listGoals(user.id), searchParams]);
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="primary">Workspace</Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            Mục tiêu
          </h1>
          <p className="mt-2 text-foreground-secondary">
            Biến định hướng dài hạn thành kết quả có thể theo dõi.
          </p>
        </div>
        <Link
          href="/app/goals/new"
          className="inline-flex min-h-11 items-center justify-center rounded-sm bg-primary-control px-4 text-sm font-semibold text-white hover:bg-primary-control-hover"
        >
          Tạo Goal
        </Link>
      </header>
      {query.archived ? (
        <p
          role="status"
          className="rounded-sm border border-success/30 bg-success/10 px-4 py-3 text-sm text-green-200"
        >
          Goal đã được lưu trữ.
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
      {goals.length === 0 ? (
        <EmptyState
          title="Chưa có Goal nào"
          description="Tạo Goal đầu tiên để xác định kết quả, deadline và tiêu chí thành công."
          action={
            <Link
              href="/app/goals/new"
              className="inline-flex min-h-11 items-center rounded-sm bg-primary-control px-4 text-sm font-semibold text-white"
            >
              Tạo Goal đầu tiên
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {goals.map((goal) => {
            const completed = goal.tasks.filter(
              (task) => task.status === TaskStatus.COMPLETED,
            ).length;
            const progress = goal.tasks.length
              ? Math.round((completed / goal.tasks.length) * 100)
              : 0;
            return (
              <Link
                key={goal.id}
                href={`/app/goals/${goal.id}`}
                className="group focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30"
              >
                <Card className="h-full transition-colors group-hover:border-primary/50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Badge
                        variant={
                          goal.status === "ACTIVE" ? "success" : "neutral"
                        }
                      >
                        {goal.status}
                      </Badge>
                      <h2 className="mt-3 text-xl font-semibold">
                        {goal.title}
                      </h2>
                    </div>
                    <span className="text-xs font-semibold text-foreground-secondary">
                      {goal.priority}
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
                    {goal.description || "Chưa có mô tả."}
                  </p>
                  <div className="mt-5 flex items-center justify-between text-xs text-muted">
                    <span>
                      {goal.deadline
                        ? `Hạn ${goal.deadline.toLocaleDateString("vi-VN", { timeZone: "UTC" })}`
                        : "Chưa có deadline"}
                    </span>
                    <span>{goal._count.roadmaps} roadmap</span>
                  </div>
                  <div
                    className="mt-3 h-2 overflow-hidden rounded-full bg-background-tertiary"
                    role="progressbar"
                    aria-label={`Tiến độ ${goal.title}`}
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted">
                    {progress}% · {completed}/{goal.tasks.length} Task hoàn
                    thành
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
