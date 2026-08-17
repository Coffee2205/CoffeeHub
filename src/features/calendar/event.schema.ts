export const EVENT_RECURRENCES = [
  "NONE",
  "DAILY",
  "WEEKLY",
  "MONTHLY",
] as const;

export type EventInput = {
  title: string;
  description: string | null;
  startsAt: Date;
  endsAt: Date | null;
  timezone: string;
  recurrence: (typeof EVENT_RECURRENCES)[number];
  goalId: string | null;
  taskId: string | null;
  source: string | null;
  externalKey: string | null;
};

const value = (form: FormData, key: string) =>
  String(form.get(key) ?? "").trim();

export function isSupportedTimezone(timezone: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: timezone }).format();
    return true;
  } catch {
    return false;
  }
}

function localParts(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((item) => item.type === type)?.value ?? 0);
  return {
    year: part("year"),
    month: part("month"),
    day: part("day"),
    hour: part("hour"),
    minute: part("minute"),
    second: part("second"),
  };
}

export function localDateTimeToUtc(value: string, timezone: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match || !isSupportedTimezone(timezone)) return null;
  const desired = match.slice(1).map(Number);
  let timestamp = Date.UTC(
    desired[0],
    desired[1] - 1,
    desired[2],
    desired[3],
    desired[4],
  );
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const actual = localParts(new Date(timestamp), timezone);
    const actualAsUtc = Date.UTC(
      actual.year,
      actual.month - 1,
      actual.day,
      actual.hour,
      actual.minute,
      actual.second,
    );
    const desiredAsUtc = Date.UTC(
      desired[0],
      desired[1] - 1,
      desired[2],
      desired[3],
      desired[4],
    );
    timestamp += desiredAsUtc - actualAsUtc;
  }
  const result = new Date(timestamp);
  const actual = localParts(result, timezone);
  return actual.year === desired[0] &&
    actual.month === desired[1] &&
    actual.day === desired[2] &&
    actual.hour === desired[3] &&
    actual.minute === desired[4]
    ? result
    : null;
}

export function formatDateTimeLocal(date: Date, timezone: string) {
  const part = localParts(date, timezone);
  const pad = (number: number) => String(number).padStart(2, "0");
  return `${part.year}-${pad(part.month)}-${pad(part.day)}T${pad(part.hour)}:${pad(part.minute)}`;
}

export function parseEventForm(form: FormData): {
  data?: EventInput;
  errors: string[];
} {
  const title = value(form, "title");
  const description = value(form, "description") || null;
  const timezone = value(form, "timezone");
  const startsAt = localDateTimeToUtc(value(form, "startsAt"), timezone);
  const endValue = value(form, "endsAt");
  const endsAt = endValue ? localDateTimeToUtc(endValue, timezone) : null;
  const recurrence = EVENT_RECURRENCES.find(
    (item) => item === value(form, "recurrence"),
  );
  const errors: string[] = [];
  if (!title || title.length > 220)
    errors.push("Tiêu đề phải có từ 1 đến 220 ký tự.");
  if (description && description.length > 5000)
    errors.push("Mô tả không được vượt quá 5.000 ký tự.");
  if (!isSupportedTimezone(timezone)) errors.push("Múi giờ không hợp lệ.");
  if (!startsAt) errors.push("Thời gian bắt đầu không hợp lệ.");
  if (endValue && !endsAt) errors.push("Thời gian kết thúc không hợp lệ.");
  if (startsAt && endsAt && startsAt >= endsAt)
    errors.push("Thời gian bắt đầu phải trước thời gian kết thúc.");
  if (!recurrence) errors.push("Chu kỳ lặp không hợp lệ.");
  if (value(form, "source").length > 160) errors.push("Source is too long.");
  if (value(form, "externalKey").length > 255) errors.push("External key is too long.");
  if (!startsAt || !recurrence || errors.length) return { errors };
  return {
    data: {
      title,
      description,
      startsAt,
      endsAt,
      timezone,
      recurrence,
      goalId: value(form, "goalId") || null,
      taskId: value(form, "taskId") || null,
      source: value(form, "source") || null,
      externalKey: value(form, "externalKey") || null,
    },
    errors,
  };
}
