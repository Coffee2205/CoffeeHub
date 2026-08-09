"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { removeNoteDraft } from "@/features/sync/note-draft-store";
import { deleteNoteAction } from "../note.actions";

export function DeleteNoteButton({
  noteId,
  noteTitle,
  redirectAfterDelete = false,
}: {
  noteId: string;
  noteTitle: string;
  redirectAfterDelete?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const confirmDelete = () =>
    startTransition(async () => {
      setError("");
      const result = await deleteNoteAction(noteId);
      if (result.status === "error") {
        setError(result.error);
        return;
      }
      await removeNoteDraft(noteId);
      setOpen(false);
      if (redirectAfterDelete) router.push("/app/notes?deleted=1");
      else router.refresh();
    });

  return (
    <>
      <Button type="button" variant="danger" onClick={() => setOpen(true)}>
        Xóa
      </Button>
      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`delete-note-${noteId}`}
          className="fixed inset-0 z-50 grid place-items-end bg-black/70 p-4 sm:place-items-center"
        >
          <div className="w-full max-w-md rounded-lg border border-border bg-background p-5 shadow-xl">
            <h2 id={`delete-note-${noteId}`} className="text-lg font-semibold">
              Xóa ghi chú?
            </h2>
            <p className="mt-2 text-sm leading-6 text-foreground-secondary">
              “{noteTitle}” sẽ được chuyển khỏi danh sách. Thao tác chỉ thực
              hiện sau khi bạn xác nhận.
            </p>
            {error ? (
              <p role="alert" className="mt-3 text-sm text-red-200">
                {error}
              </p>
            ) : null}
            <div className="mt-5 flex justify-end gap-3">
              <Button
                type="button"
                disabled={pending}
                onClick={() => setOpen(false)}
              >
                Hủy
              </Button>
              <Button
                type="button"
                variant="danger"
                disabled={pending}
                onClick={confirmDelete}
              >
                {pending ? "Đang xóa…" : "Xác nhận xóa"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
