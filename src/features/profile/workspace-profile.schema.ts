export type WorkspaceProfileInput = {
  workspaceName: string | null;
  timezone: string;
};

const commonTimezones = [
  "UTC",
  "Asia/Ho_Chi_Minh",
  "Asia/Bangkok",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Europe/London",
  "America/New_York",
  "America/Los_Angeles",
] as const;

export const WORKSPACE_TIMEZONES = commonTimezones.map((value) => ({
  value,
  label: value === "UTC" ? "UTC" : value.replaceAll("_", " "),
}));

function isSupportedTimezone(value: string) {
  try {
    new Intl.DateTimeFormat("vi-VN", { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}

export function parseWorkspaceProfileForm(form: FormData): {
  data?: WorkspaceProfileInput;
  errors: string[];
} {
  const rawName = String(form.get("workspaceName") ?? "").trim();
  const timezone = String(form.get("timezone") ?? "").trim();
  const errors: string[] = [];

  if (rawName.length > 120)
    errors.push("Tên workspace không được vượt quá 120 ký tự.");
  if (!timezone || timezone.length > 64 || !isSupportedTimezone(timezone))
    errors.push("Múi giờ không hợp lệ.");

  return errors.length
    ? { errors }
    : { data: { workspaceName: rawName || null, timezone }, errors };
}
