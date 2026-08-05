import Link from "next/link";
import { Badge, Card, EmptyState, Input } from "@/components/ui";
import { listNotes } from "@/features/notes/note.repository";
import { requireUser } from "@/lib/supabase/auth";

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; archived?: string }>;
}) {
  const user = await requireUser();
  const query = await searchParams;
  const notes = await listNotes(user.id, query.q?.trim());
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="primary">Workspace</Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            Ghi chú
          </h1>
          <p className="mt-2 text-foreground-secondary">
            Bản nháp được tự động lưu và khôi phục khi mất kết nối.
          </p>
        </div>
        <Link
          href="/app/notes/new"
          className="inline-flex min-h-11 items-center justify-center rounded-sm bg-primary-control px-4 text-sm font-semibold text-white"
        >
          Tạo ghi chú
        </Link>
      </header>
      {query.archived ? (
        <p
          role="status"
          className="rounded-sm border border-success/30 bg-success/10 px-4 py-3 text-sm text-green-200"
        >
          Ghi chú đã được lưu trữ.
        </p>
      ) : null}
      <form className="max-w-xl" role="search">
        <Input
          name="q"
          defaultValue={query.q}
          placeholder="Tìm theo tiêu đề hoặc nội dung"
          aria-label="Tìm ghi chú"
        />
      </form>
      {notes.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {notes.map((note) => (
            <Link key={note.id} href={`/app/notes/${note.id}`}>
              <Card className="h-full hover:border-primary">
                <h2 className="font-semibold">{note.title}</h2>
                <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm text-muted">
                  {note.content || "Ghi chú trống"}
                </p>
                <p className="mt-4 text-xs text-muted">
                  Cập nhật {note.updatedAt.toLocaleString("vi-VN")}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title={query.q ? "Không tìm thấy ghi chú" : "Chưa có ghi chú"}
          description={
            query.q
              ? "Thử một từ khóa khác."
              : "Tạo ghi chú đầu tiên; nội dung sẽ được tự động lưu."
          }
          action={
            <Link
              href="/app/notes/new"
              className="inline-flex min-h-11 items-center rounded-sm bg-primary-control px-4 text-sm font-semibold text-white"
            >
              Tạo ghi chú đầu tiên
            </Link>
          }
        />
      )}
    </div>
  );
}
