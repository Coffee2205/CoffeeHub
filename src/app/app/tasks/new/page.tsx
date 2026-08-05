import Link from "next/link";
import { Badge } from "@/components/ui";
import { createTaskAction } from "@/features/tasks/task.actions";
import { TaskForm } from "@/features/tasks/components/task-form";
import { getTaskRelations } from "@/features/tasks/task.repository";
import { requireUser } from "@/lib/supabase/auth";
export default async function NewTaskPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await requireUser();
  const [relations, query] = await Promise.all([
    getTaskRelations(user.id),
    searchParams,
  ]);
  return (
    <div className="space-y-6">
      <Link
        href="/app/tasks"
        className="text-sm font-semibold text-primary-hover"
      >
        ← Tasks
      </Link>
      <header>
        <Badge variant="primary">Task mới</Badge>
        <h1 className="mt-4 text-3xl font-semibold">Tạo Task</h1>
      </header>
      <TaskForm
        action={createTaskAction}
        relations={relations}
        error={query.error}
      />
    </div>
  );
}
