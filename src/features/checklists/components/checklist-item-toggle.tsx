"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toggleChecklistItemCompletedAction } from "../checklist.actions";

export function ChecklistItemToggle({
  checklistId,
  itemId,
  initialCompleted,
}: {
  checklistId: string;
  itemId: string;
  initialCompleted: boolean;
}) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function toggle() {
    const previous = completed;
    const next = !previous;
    setCompleted(next);
    setError("");
    setPending(true);
    try {
      const result = await toggleChecklistItemCompletedAction(
        checklistId,
        itemId,
        next,
      );
      if (!result.ok) {
        setCompleted(previous);
        setError(result.error);
        return;
      }
      router.refresh();
    } catch {
      setCompleted(previous);
      setError("Mất kết nối; thay đổi đã được hoàn tác.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        aria-pressed={completed}
        aria-label={
          completed ? "Đánh dấu chưa hoàn thành" : "Đánh dấu hoàn thành"
        }
        className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-background-secondary text-lg hover:border-primary disabled:opacity-60"
      >
        {completed ? "✓" : "○"}
      </button>
      {error ? (
        <span role="alert" className="text-xs text-red-300">
          {error}
        </span>
      ) : null}
    </div>
  );
}
