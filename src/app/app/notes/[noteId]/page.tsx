import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui";
import { NoteEditor } from "@/features/notes/components/note-editor";
import { DeleteNoteButton } from "@/features/notes/components/delete-note-button";
import { getNote } from "@/features/notes/note.repository";
import { requireUser } from "@/lib/supabase/auth";

export default async function NotePage({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const user = await requireUser();
  const { noteId } = await params;
  const note = await getNote(user.id, noteId);
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
    </div>
  );
}
