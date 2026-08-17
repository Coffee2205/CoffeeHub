import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Button, Card, EmptyState } from "@/components/ui";
import { summarizeChecklistItems } from "@/features/checklists/checklist.schema";
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
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="primary">Task detail</Badge>
          <h1 className="mt-4 text-3xl font-semibold">{task.title}</h1>
        </div>
        <Link
          href={`/app/ai?taskId=${task.id}`}
          className="inline-flex min-h-11 items-center justify-center rounded-sm border border-primary/40 bg-primary/10 px-4 text-sm font-semibold text-primary-hover"
        >
          Ask AI về Task
        </Link>
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
      <Card>
        <h2 className="text-xl font-semibold">Planning context</h2>
        <div className="mt-3 grid gap-2 text-sm">
          <p>Goal: {task.goal ? <Link className="text-primary-hover" href={`/app/goals/${task.goal.id}`}>{task.goal.title}</Link> : "None"}</p>
          <p>Roadmap: {task.roadmap?.title ?? "None"}</p><p>Stage: {task.roadmapStage?.title ?? "None"}</p>
          <p>Estimated duration: {task.estimatedMinutes ? `${task.estimatedMinutes} minutes` : "Not set"}</p>
          <p>Expected result: {task.expectedResult ?? "Not set"}</p>
        </div>
      </Card>
      <section className="space-y-3" aria-labelledby="task-checklists">
        <div>
          <h2 id="task-checklists" className="text-xl font-semibold">
            Checklists
          </h2>
          <p className="mt-1 text-sm text-muted">
            Các bước thực hiện của Task; tiến độ Checklist không tự thay đổi
            trạng thái Task.
          </p>
        </div>
        {task.checklists.length ? (
          <div className="grid gap-3">
            {task.checklists.map((checklist) => {
              const summary = summarizeChecklistItems(checklist.items);
              return (
                <Card key={checklist.id} className="min-w-0">
                  <Link
                    href={`/app/checklists/${checklist.id}`}
                    className="break-words font-semibold text-primary-hover"
                  >
                    {checklist.title}
                  </Link>
                  <p className="mt-2 text-sm text-muted">
                    {summary.completed}/{summary.total} item ·{" "}
                    {summary.progress}%
                  </p>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="Chưa có Checklist"
            description="Task này chưa có Checklist liên kết."
          />
        )}
      </section>
      <section className="space-y-3"><div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Related Notes</h2><Link className="text-sm font-semibold text-primary-hover" href={`/app/notes/new?taskId=${task.id}${task.goalId ? `&goalId=${task.goalId}` : ""}${task.roadmapId ? `&roadmapId=${task.roadmapId}` : ""}${task.roadmapStageId ? `&roadmapStageId=${task.roadmapStageId}` : ""}`}>Add note</Link></div>{task.notes.length ? task.notes.map((note) => <Card key={note.id}><Link href={`/app/notes/${note.id}`} className="font-semibold text-primary-hover">{note.title}</Link></Card>) : <EmptyState title="No related notes" description="Capture knowledge and lessons without turning them into tasks." />}</section>
      <section className="space-y-3" aria-labelledby="task-events">
        <div>
          <h2 id="task-events" className="text-xl font-semibold">
            Lịch học liên kết
          </h2>
          <p className="mt-1 text-sm text-muted">
            Các phiên học đã lên Calendar cho riêng Task này.
          </p>
        </div>
        {task.events.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {task.events.map((event) => (
              <Card key={event.id} className="min-w-0">
                <Link
                  href={`/app/calendar/${event.id}`}
                  className="break-words font-semibold text-primary-hover"
                >
                  {event.title}
                </Link>
                <p className="mt-2 text-sm text-muted">
                  {event.startsAt.toLocaleString("vi-VN", {
                    timeZone: event.timezone,
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                <Badge className="mt-3">{event.timezone}</Badge>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Chưa có Event"
            description="Task này chưa có phiên học được lên lịch trong rolling window hiện tại."
          />
        )}
      </section>
      <form action={archiveTaskAction.bind(null, task.id)}>
        <Button type="submit" variant="secondary">
          Lưu trữ Task
        </Button>
      </form>
    </div>
  );
}
