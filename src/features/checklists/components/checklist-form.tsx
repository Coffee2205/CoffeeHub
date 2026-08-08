import { Button, Input, Textarea } from "@/components/ui";
import type { Checklist } from "@/generated/prisma/client";
import type { ChecklistInput } from "../checklist.schema";

type Relations = Awaited<
  ReturnType<typeof import("../checklist.repository").getChecklistRelations>
>;

export function ChecklistForm({
  action,
  checklist,
  relations,
  error,
}: {
  action: (form: FormData) => void | Promise<void>;
  checklist?: ChecklistInput &
    Pick<Checklist, "goalId" | "roadmapId" | "taskId">;
  relations: Relations;
  error?: string;
}) {
  return (
    <form
      action={action}
      className="grid gap-5 rounded-lg border border-border bg-surface p-5 sm:p-6 md:grid-cols-2"
    >
      {error ? (
        <p
          role="alert"
          className="rounded-sm border border-error/40 bg-error/10 p-3 text-sm text-red-200 md:col-span-2"
        >
          {error}
        </p>
      ) : null}
      <Field label="Tiêu đề" wide>
        <Input
          name="title"
          required
          maxLength={220}
          defaultValue={checklist?.title}
          autoFocus={!checklist}
        />
      </Field>
      <Field label="Goal">
        <select
          name="goalId"
          defaultValue={checklist?.goalId ?? ""}
          className="min-h-11 rounded-sm border border-border bg-background-secondary px-3.5"
        >
          <option value="">Không liên kết</option>
          {relations.goals.map((goal) => (
            <option key={goal.id} value={goal.id}>
              {goal.title}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Roadmap">
        <select
          name="roadmapId"
          defaultValue={checklist?.roadmapId ?? ""}
          className="min-h-11 rounded-sm border border-border bg-background-secondary px-3.5"
        >
          <option value="">Không liên kết</option>
          {relations.roadmaps.map((roadmap) => (
            <option key={roadmap.id} value={roadmap.id}>
              {roadmap.goal.title} / {roadmap.title}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Task" wide>
        <select
          name="taskId"
          defaultValue={checklist?.taskId ?? ""}
          className="min-h-11 rounded-sm border border-border bg-background-secondary px-3.5"
        >
          <option value="">Không liên kết</option>
          {relations.tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.goal?.title ?? "Không có Goal"}
              {task.roadmap ? ` / ${task.roadmap.title}` : ""} / {task.title}
            </option>
          ))}
        </select>
        <span className="text-xs text-muted">
          Chỉ chọn một ngữ cảnh. Checklist vẫn là domain độc lập.
        </span>
      </Field>
      <Field label="Mô tả" wide>
        <Textarea
          name="description"
          maxLength={5000}
          className="min-h-36"
          defaultValue={checklist?.description ?? ""}
        />
      </Field>
      <div className="md:col-span-2">
        <Button type="submit">
          {checklist ? "Lưu thay đổi" : "Tạo Checklist"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  wide,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={wide ? "grid gap-2 md:col-span-2" : "grid gap-2"}>
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
