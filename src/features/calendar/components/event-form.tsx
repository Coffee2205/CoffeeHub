import type { ReactNode } from "react";
import { Button, Input, Textarea } from "@/components/ui";
import type { Event } from "@/generated/prisma/client";
import { EVENT_RECURRENCES, formatDateTimeLocal } from "../event.schema";

type Relations = Awaited<
  ReturnType<typeof import("../event.repository").getEventRelations>
>;

const recurrenceLabels = {
  NONE: "Không lặp",
  DAILY: "Hằng ngày",
  WEEKLY: "Hằng tuần",
  MONTHLY: "Hằng tháng",
};

export function EventForm({
  action,
  event,
  relations,
  defaultTimezone,
  error,
}: {
  action: (form: FormData) => void | Promise<void>;
  event?: Event;
  relations: Relations;
  defaultTimezone: string;
  error?: string;
}) {
  const timezone = event?.timezone ?? defaultTimezone;
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
          defaultValue={event?.title}
          autoFocus={!event}
        />
      </Field>
      <Field label="Bắt đầu">
        <Input
          name="startsAt"
          type="datetime-local"
          required
          defaultValue={
            event ? formatDateTimeLocal(event.startsAt, timezone) : ""
          }
        />
      </Field>
      <Field label="Kết thúc">
        <Input
          name="endsAt"
          type="datetime-local"
          defaultValue={
            event?.endsAt ? formatDateTimeLocal(event.endsAt, timezone) : ""
          }
        />
      </Field>
      <Field label="Múi giờ">
        <Input
          name="timezone"
          required
          maxLength={64}
          list="calendar-timezones"
          defaultValue={timezone}
        />
        <datalist id="calendar-timezones">
          <option value="Asia/Ho_Chi_Minh" />
          <option value="UTC" />
          <option value="Asia/Singapore" />
          <option value="America/New_York" />
          <option value="Europe/London" />
        </datalist>
      </Field>
      <Field label="Lặp lại">
        <select
          name="recurrence"
          defaultValue={event?.recurrence ?? "NONE"}
          className="min-h-11 rounded-sm border border-border bg-background-secondary px-3.5"
        >
          {EVENT_RECURRENCES.map((recurrence) => (
            <option key={recurrence} value={recurrence}>
              {recurrenceLabels[recurrence]}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Goal">
        <select
          name="goalId"
          defaultValue={event?.goalId ?? ""}
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
      <Field label="Task">
        <select
          name="taskId"
          defaultValue={event?.taskId ?? ""}
          className="min-h-11 rounded-sm border border-border bg-background-secondary px-3.5"
        >
          <option value="">Không liên kết</option>
          {relations.tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Mô tả" wide>
        <Textarea
          name="description"
          maxLength={5000}
          className="min-h-36"
          defaultValue={event?.description ?? ""}
        />
      </Field>
      <p className="text-xs leading-5 text-muted md:col-span-2">
        Thời gian được hiểu theo múi giờ đã chọn. Nếu Task đã thuộc một Goal,
        Goal của Event phải khớp với Task đó.
      </p>
      <div className="md:col-span-2">
        <Button type="submit">{event ? "Lưu thay đổi" : "Tạo Event"}</Button>
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
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={wide ? "grid gap-2 md:col-span-2" : "grid gap-2"}>
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
