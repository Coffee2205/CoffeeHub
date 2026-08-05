import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Button } from "@/components/ui";
import {
  archiveTaskAction,
  updateTaskAction,
} from "@/features/tasks/task.actions";
import { TaskForm } from "@/features/tasks/components/task-form";
import { getTask, getTaskRelations } from "@/features/tasks/task.repository";
import { requireUser } from "@/lib/supabase/auth";
export default async function TaskDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ taskId: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const user = await requireUser();
  const [{ taskId }, query] = await Promise.all([params, searchParams]);
  const [task, relations] = await Promise.all([
    getTask(user.id, taskId),
    getTaskRelations(user.id),
  ]);
  if (!task) notFound();
  return (
    <div className="space-y-6">
      <Link
        href="/app/tasks"
        className="text-sm font-semibold text-primary-hover"
      >
        ← Tasks
      </Link>
      <header>
        <Badge variant="primary">Task detail</Badge>
        <h1 className="mt-4 text-3xl font-semibold">{task.title}</h1>
      </header>
      {query.saved ? (
        <p
          role="status"
          className="rounded-sm border border-success/30 bg-success/10 px-4 py-3 text-sm text-green-200"
        >
          Task đã được lưu.
        </p>
      ) : null}
      <TaskForm
        action={updateTaskAction.bind(null, task.id)}
        task={task}
        relations={relations}
        error={query.error}
      />
      <form action={archiveTaskAction.bind(null, task.id)}>
        <Button type="submit" variant="secondary">
          Lưu trữ Task
        </Button>
      </form>
    </div>
  );
}
