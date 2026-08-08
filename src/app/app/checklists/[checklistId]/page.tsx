import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Button, Card, EmptyState } from "@/components/ui";
import { ChecklistForm } from "@/features/checklists/components/checklist-form";
import { ChecklistItemForm } from "@/features/checklists/components/checklist-item-form";
import { ChecklistItemToggle } from "@/features/checklists/components/checklist-item-toggle";
import {
  addChecklistItemAction,
  archiveChecklistAction,
  deleteChecklistItemAction,
  updateChecklistAction,
} from "@/features/checklists/checklist.actions";
import {
  getChecklist,
  getChecklistRelations,
} from "@/features/checklists/checklist.repository";
import { summarizeChecklistItems } from "@/features/checklists/checklist.schema";
import { requireUser } from "@/lib/supabase/auth";

type Query = {
  error?: string;
  saved?: string;
  archived?: string;
  itemSaved?: string;
  itemError?: string;
};

function contextLabel(checklist: Awaited<ReturnType<typeof getChecklist>>) {
  if (!checklist) return "Checklist độc lập";
  if (checklist.goal) return `Goal · ${checklist.goal.title}`;
  if (checklist.roadmap)
    return `Roadmap · ${checklist.roadmap.goal.title} / ${checklist.roadmap.title}`;
  if (checklist.task)
    return `Task · ${checklist.task.goal?.title ?? "Không có Goal"}${checklist.task.roadmap ? ` / ${checklist.task.roadmap.title}` : ""} / ${checklist.task.title}`;
  return "Checklist độc lập";
}

export default async function ChecklistDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ checklistId: string }>;
  searchParams: Promise<Query>;
}) {
  const user = await requireUser();
  const [{ checklistId }, query] = await Promise.all([params, searchParams]);
  const [checklist, relations] = await Promise.all([
    getChecklist(user.id, checklistId),
    getChecklistRelations(user.id),
  ]);
  if (!checklist) notFound();
  const summary = summarizeChecklistItems(checklist.items);
  return (
    <div className="space-y-6">
      <Link
        href="/app/checklists"
        className="text-sm font-semibold text-primary-hover"
      >
        ← Checklists
      </Link>
      <header className="space-y-3">
        <Badge variant="primary">Checklist detail</Badge>
        <h1 className="text-3xl font-semibold">{checklist.title}</h1>
        <p className="text-sm text-foreground-secondary">
          {contextLabel(checklist)}
        </p>
        <div
          className="h-2 max-w-xl overflow-hidden rounded-full bg-background-tertiary"
          role="progressbar"
          aria-label={`Tiến độ ${checklist.title}`}
          aria-valuenow={summary.progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${summary.progress}%` }}
          />
        </div>
        <p className="text-sm text-muted">
          {summary.progress}% · {summary.completed}/{summary.total} item hoàn
          thành
        </p>
      </header>
      {query.saved ? (
        <p
          role="status"
          className="rounded-sm border border-success/30 bg-success/10 px-4 py-3 text-sm text-green-200"
        >
          Checklist đã được lưu.
        </p>
      ) : null}
      {query.itemSaved ? (
        <p
          role="status"
          className="rounded-sm border border-success/30 bg-success/10 px-4 py-3 text-sm text-green-200"
        >
          Item checklist đã được cập nhật.
        </p>
      ) : null}
      <ChecklistForm
        action={updateChecklistAction.bind(null, checklist.id)}
        checklist={checklist}
        relations={relations}
        error={query.error}
      />
      <ChecklistItemForm
        action={addChecklistItemAction.bind(null, checklist.id)}
        error={query.itemError}
      />
      {checklist.items.length ? (
        <div className="grid gap-3">
          {checklist.items.map((item) => (
            <Card
              key={item.id}
              className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-start gap-3">
                <ChecklistItemToggle
                  checklistId={checklist.id}
                  itemId={item.id}
                  initialCompleted={item.completed}
                />
                <div className="min-w-0">
                  <p
                    className={`font-medium ${item.completed ? "text-muted line-through" : ""}`}
                  >
                    {item.title}
                  </p>
                  <p className="text-xs text-muted">
                    Item #{item.position + 1}
                  </p>
                </div>
              </div>
              <form
                action={deleteChecklistItemAction.bind(
                  null,
                  checklist.id,
                  item.id,
                )}
              >
                <Button type="submit" variant="danger" size="sm">
                  Xóa
                </Button>
              </form>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Chưa có item"
          description="Thêm item đầu tiên để bắt đầu theo dõi tiến độ Checklist."
        />
      )}
      <form action={archiveChecklistAction.bind(null, checklist.id)}>
        <Button type="submit" variant="secondary">
          Lưu trữ Checklist
        </Button>
      </form>
    </div>
  );
}
