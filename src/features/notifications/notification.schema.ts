import {
  isSupportedTimezone,
  localDateTimeToUtc,
} from "@/features/calendar/event.schema";

export const REMINDER_RECURRENCES = [
  "NONE",
  "DAILY",
  "WEEKLY",
  "MONTHLY",
] as const;
export type ReminderInput = {
  title: string;
  scheduledFor: Date;
  timezone: string;
  recurrence: (typeof REMINDER_RECURRENCES)[number];
  goalId: string | null;
  taskId: string | null;
  eventId: string | null;
  checklistId: string | null;
};
const value = (form: FormData, key: string) =>
  String(form.get(key) ?? "").trim();
export function parseReminderForm(form: FormData): {
  data?: ReminderInput;
  errors: string[];
} {
  const title = value(form, "title");
  const timezone = value(form, "timezone");
  const scheduledFor = localDateTimeToUtc(
    value(form, "scheduledFor"),
    timezone,
  );
  const recurrence = REMINDER_RECURRENCES.find(
    (item) => item === value(form, "recurrence"),
  );
  const relations = {
    goalId: value(form, "goalId") || null,
    taskId: value(form, "taskId") || null,
    eventId: value(form, "eventId") || null,
    checklistId: value(form, "checklistId") || null,
  };
  const errors: string[] = [];
  if (!title || title.length > 220)
    errors.push("Tiêu đề phải có từ 1 đến 220 ký tự.");
  if (!isSupportedTimezone(timezone)) errors.push("Múi giờ không hợp lệ.");
  if (!scheduledFor) errors.push("Thời điểm nhắc không hợp lệ.");
  if (!recurrence) errors.push("Chu kỳ lặp không hợp lệ.");
  if (Object.values(relations).filter(Boolean).length > 1)
    errors.push("Chỉ chọn một entity liên kết.");
  if (!scheduledFor || !recurrence || errors.length) return { errors };
  return {
    data: { title, scheduledFor, timezone, recurrence, ...relations },
    errors,
  };
}
export function parsePreferenceForm(form: FormData) {
  const lead = Number(value(form, "defaultLeadMinutes"));
  const errors =
    Number.isInteger(lead) && lead >= 0 && lead <= 10080
      ? []
      : ["Thời gian báo trước phải từ 0 đến 10.080 phút."];
  return errors.length
    ? { errors }
    : {
        data: {
          inAppEnabled: form.get("inAppEnabled") === "on",
          browserEnabled: form.get("browserEnabled") === "on",
          defaultLeadMinutes: lead,
        },
        errors,
      };
}
