import Link from "next/link";
import { Badge, Button, Input, Textarea } from "@/components/ui";
import { createNoteAction } from "@/features/notes/note.actions";

export default async function NewNotePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const query = await searchParams;
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
