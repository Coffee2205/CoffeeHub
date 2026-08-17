import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui";
import { NoteEditor } from "@/features/notes/components/note-editor";
import { DeleteNoteButton } from "@/features/notes/components/delete-note-button";
import { updateNoteContextAction } from "@/features/notes/note.actions";
import { getNote, getNoteRelations } from "@/features/notes/note.repository";
import { requireUser } from "@/lib/supabase/auth";

export default async function NotePage({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const user = await requireUser();
  const { noteId } = await params;
  const [note, relations] = await Promise.all([getNote(user.id, noteId), getNoteRelations(user.id)]);
  if (!note) notFound();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/app/notes"
          className="text-sm font-semibold text-primary-hover"
        >
          ← Ghi chú
        </Link>
        <DeleteNoteButton
          noteId={note.id}
          noteTitle={note.title}
          redirectAfterDelete
        />
      </div>
      <header>
        <Badge variant="primary">Editor</Badge>
        <h1 className="mt-4 text-3xl font-semibold">Chỉnh sửa ghi chú</h1>
      </header>
      <NoteEditor note={note} userId={user.id} />
      <form action={updateNoteContextAction.bind(null, note.id)} className="grid gap-4 rounded-lg border border-border bg-surface p-5 sm:grid-cols-2">
        <h2 className="text-xl font-semibold sm:col-span-2">Context (optional)</h2>
        <ContextSelect name="goalId" label="Goal" items={relations.goals} value={note.goalId} />
        <ContextSelect name="roadmapId" label="Roadmap" items={relations.roadmaps} value={note.roadmapId} />
        <ContextSelect name="roadmapStageId" label="Roadmap stage" items={relations.stages} value={note.roadmapStageId} />
        <ContextSelect name="taskId" label="Task" items={relations.tasks} value={note.taskId} />
        <ContextSelect name="eventId" label="Event" items={relations.events} value={note.eventId} />
        <button className="min-h-11 rounded-sm bg-primary-control px-4 font-semibold text-white" type="submit">Save context</button>
      </form>
    </div>
  );
}

function ContextSelect({ name, label, items, value }: { name: string; label: string; items: { id: string; title: string }[]; value: string | null }) {
  return <label className="grid gap-2"><span className="text-sm font-medium">{label}</span><select name={name} defaultValue={value ?? ""} className="min-h-11 rounded-sm border border-border bg-background-secondary px-3"><option value="">No context</option>{items.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>;
}
