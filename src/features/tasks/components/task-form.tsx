import { Button, Input, Textarea } from "@/components/ui";
import type { Task } from "@/generated/prisma/client";
import { TASK_PRIORITIES, TASK_STATUSES } from "../task.schema";
type Relations = Awaited<
  ReturnType<typeof import("../task.repository").getTaskRelations>
>;
export function TaskForm({
  action,
  task,
  relations,
  error,
}: {
  action: (form: FormData) => void | Promise<void>;
  task?: Task;
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
          defaultValue={task?.title}
          autoFocus={!task}
        />
      </Field>
      <Field label="Trạng thái">
        <select
          name="status"
          defaultValue={task?.status ?? "TODO"}
          className="min-h-11 rounded-sm border border-border bg-background-secondary px-3.5"
        >
          {TASK_STATUSES.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </Field>
      <Field label="Ưu tiên">
        <select
          name="priority"
          defaultValue={task?.priority ?? "MEDIUM"}
          className="min-h-11 rounded-sm border border-border bg-background-secondary px-3.5"
        >
          {TASK_PRIORITIES.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </Field>
      <Field label="Deadline">
        <Input
          name="dueAt"
          type="date"
          defaultValue={task?.dueAt?.toISOString().slice(0, 10) ?? ""}
        />
      </Field>
      <div />
      <Field label="Goal">
        <select
          name="goalId"
          defaultValue={task?.goalId ?? ""}
          className="min-h-11 rounded-sm border border-border bg-background-secondary px-3.5"
        >
          <option value="">Không liên kết</option>
          {relations.map((g) => (
            <option key={g.id} value={g.id}>
              {g.title}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Roadmap">
        <select
          name="roadmapId"
          defaultValue={task?.roadmapId ?? ""}
          className="min-h-11 rounded-sm border border-border bg-background-secondary px-3.5"
        >
          <option value="">Không liên kết</option>
          {relations.flatMap((g) =>
            g.roadmaps.map((r) => (
              <option key={r.id} value={r.id}>
                {g.title} / {r.title}
              </option>
            )),
          )}
        </select>
      </Field>
      <Field label="Stage" wide>
        <select
          name="roadmapStageId"
          defaultValue={task?.roadmapStageId ?? ""}
          className="min-h-11 rounded-sm border border-border bg-background-secondary px-3.5"
        >
          <option value="">Không liên kết</option>
          {relations.flatMap((g) =>
            g.roadmaps.flatMap((r) =>
              r.stages.map((s) => (
                <option key={s.id} value={s.id}>
                  {g.title} / {r.title} / {s.title}
                </option>
              )),
            ),
          )}
        </select>
        <span className="text-xs text-muted">
          Khi chọn Roadmap hoặc Stage, hãy chọn cả chuỗi quan hệ tương ứng.
        </span>
      </Field>
      <Field label="Mô tả" wide>
        <Textarea
          name="description"
          maxLength={5000}
          className="min-h-36"
          defaultValue={task?.description ?? ""}
        />
      </Field>
      <div className="md:col-span-2">
        <Button type="submit">{task ? "Lưu thay đổi" : "Tạo Task"}</Button>
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
