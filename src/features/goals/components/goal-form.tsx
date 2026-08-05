import { Button, Input, Textarea } from "@/components/ui";
import type { Goal } from "@/generated/prisma/client";
import {
  GOAL_PRIORITIES,
  GOAL_STATUSES,
  readSuccessCriteria,
} from "../goal.schema";

export function GoalForm({
  action,
  goal,
  error,
}: {
  action: (form: FormData) => void | Promise<void>;
  goal?: Goal;
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
          maxLength={180}
          defaultValue={goal?.title}
          autoFocus={!goal}
        />
      </Field>
      <Field label="Trạng thái">
        <select
          name="status"
          defaultValue={goal?.status ?? "DRAFT"}
          className="min-h-11 rounded-sm border border-border bg-background-secondary px-3.5"
        >
          {GOAL_STATUSES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </Field>
      <Field label="Ưu tiên">
        <select
          name="priority"
          defaultValue={goal?.priority ?? "MEDIUM"}
          className="min-h-11 rounded-sm border border-border bg-background-secondary px-3.5"
        >
          {GOAL_PRIORITIES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </Field>
      <Field label="Deadline">
        <Input
          name="deadline"
          type="date"
          defaultValue={goal?.deadline?.toISOString().slice(0, 10) ?? ""}
        />
      </Field>
      <Field label="Mô tả" wide>
        <Textarea
          name="description"
          maxLength={5000}
          className="min-h-36"
          defaultValue={goal?.description ?? ""}
        />
      </Field>
      <Field
        label="Tiêu chí thành công"
        hint="Mỗi dòng là một tiêu chí; tối đa 20 dòng."
        wide
      >
        <Textarea
          name="successCriteria"
          maxLength={5000}
          className="min-h-36"
          defaultValue={readSuccessCriteria(goal?.successCriteria).join("\n")}
        />
      </Field>
      <div className="md:col-span-2">
        <Button type="submit">{goal ? "Lưu thay đổi" : "Tạo Goal"}</Button>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
  wide,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={wide ? "grid gap-2 md:col-span-2" : "grid gap-2"}>
      <span className="text-sm font-medium">{label}</span>
      {children}
      {hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </label>
  );
}
