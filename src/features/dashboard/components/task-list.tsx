import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
} from "@/components/ui";
import {
  formatUtcDateTime,
  formatUtcTime,
} from "@/features/dashboard/formatters";
import type { DashboardTask } from "@/features/dashboard/dashboard.types";

type TaskListProps = {
  title: string;
  description: string;
  tasks: DashboardTask[];
  overdue?: boolean;
};

export function TaskList({
  title,
  description,
  tasks,
  overdue = false,
}: TaskListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {tasks.length === 0 ? (
        <EmptyState
          className="min-h-40"
          title={
            overdue ? "Không có Task quá hạn" : "Không có Task trong hôm nay"
          }
          description={
            overdue
              ? "Nhịp công việc hiện tại đang đúng hạn."
              : "Task có hạn hôm nay sẽ xuất hiện tại đây."
          }
        />
      ) : (
        <ul className="divide-y divide-border">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{task.title}</p>
                <p className="mt-1 text-xs text-muted">
                  Ưu tiên {task.priority.toLowerCase()}
                </p>
              </div>
              <time
                className={
                  overdue
                    ? "shrink-0 font-mono text-xs text-warning"
                    : "shrink-0 font-mono text-xs text-foreground-secondary"
                }
                dateTime={task.dueAt.toISOString()}
              >
                {overdue
                  ? formatUtcDateTime(task.dueAt)
                  : formatUtcTime(task.dueAt)}{" "}
                UTC
              </time>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
