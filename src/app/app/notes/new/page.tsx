import Link from "next/link";
import { Badge, Button, Input, Textarea } from "@/components/ui";
import { createNoteAction } from "@/features/notes/note.actions";
import { getNoteRelations } from "@/features/notes/note.repository";
import { requireUser } from "@/lib/supabase/auth";

export default async function NewNotePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; goalId?: string; roadmapId?: string; roadmapStageId?: string; taskId?: string; eventId?: string }>;
}) {
  const [query, user] = await Promise.all([searchParams, requireUser()]);
  const relations = await getNoteRelations(user.id);
  return (
    <div className="space-y-6">
      <Link
        href="/app/notes"
        className="text-sm font-semibold text-primary-hover"
      >
        ← Ghi chú
      </Link>
      <header>
        <Badge variant="primary">Ghi chú mới</Badge>
        <h1 className="mt-4 text-3xl font-semibold">Tạo ghi chú</h1>
      </header>
      <form
        action={createNoteAction}
        className="grid gap-5 rounded-lg border border-border bg-surface p-5 sm:p-6"
      >
        {query.error ? (
          <p
            role="alert"
            className="rounded-sm border border-error/40 bg-error/10 p-3 text-sm text-red-200"
          >
            {query.error}
          </p>
        ) : null}
        <label className="grid gap-2">
          <span className="text-sm font-medium">Tiêu đề</span>
          <Input name="title" required maxLength={220} autoFocus />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <ContextSelect name="goalId" label="Goal" items={relations.goals} value={query.goalId} />
          <ContextSelect name="roadmapId" label="Roadmap" items={relations.roadmaps} value={query.roadmapId} />
          <ContextSelect name="roadmapStageId" label="Roadmap stage" items={relations.stages} value={query.roadmapStageId} />
          <ContextSelect name="taskId" label="Task" items={relations.tasks} value={query.taskId} />
          <ContextSelect name="eventId" label="Event" items={relations.events} value={query.eventId} />
        </div>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Nội dung</span>
          <Textarea name="content" className="min-h-64" />
        </label>
        <div>
          <Button type="submit">Tạo và mở editor</Button>
        </div>
      </form>
    </div>
  );
}

function ContextSelect({ name, label, items, value }: { name: string; label: string; items: { id: string; title: string }[]; value?: string }) {
  return <label className="grid gap-2"><span className="text-sm font-medium">{label}</span><select name={name} defaultValue={value ?? ""} className="min-h-11 rounded-sm border border-border bg-background-secondary px-3"><option value="">No context</option>{items.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>;
}
