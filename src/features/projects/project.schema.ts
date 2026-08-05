export const PROJECT_STATUSES = ["DRAFT", "PUBLISHED", "HIDDEN"] as const;
export type ProjectStatusInput = (typeof PROJECT_STATUSES)[number];
export type ProjectInput = {
  title: string;
  slug: string;
  summary: string;
  description: string;
  role: string | null;
  techStack: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  status: ProjectStatusInput;
  startedAt: Date | null;
  endedAt: Date | null;
  displayOrder: number;
};
const value = (form: FormData, key: string) =>
  String(form.get(key) ?? "").trim();
function url(input: string, label: string, errors: string[]) {
  if (!input) return null;
  try {
    const parsed = new URL(input);
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
    return parsed.toString();
  } catch {
    errors.push(`${label} không hợp lệ.`);
    return null;
  }
}
function date(input: string) {
  return input ? new Date(`${input}T00:00:00.000Z`) : null;
}
export function parseProjectForm(form: FormData): {
  data?: ProjectInput;
  errors: string[];
} {
  const errors: string[] = [];
  const title = value(form, "title");
  const slug = value(form, "slug").toLowerCase();
  const summary = value(form, "summary");
  const description = value(form, "description");
  if (!title || title.length > 180) errors.push("Tiêu đề phải có 1–180 ký tự.");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 180)
    errors.push("Slug chỉ gồm chữ thường, số và dấu gạch ngang.");
  if (!summary || summary.length > 320)
    errors.push("Tóm tắt phải có 1–320 ký tự.");
  if (!description) errors.push("Mô tả là bắt buộc.");
  const status = PROJECT_STATUSES.find(
    (item) => item === value(form, "status"),
  );
  if (!status) errors.push("Trạng thái không hợp lệ.");
  const displayOrder = Number(value(form, "displayOrder") || 0);
  if (!Number.isInteger(displayOrder) || displayOrder < 0)
    errors.push("Thứ tự phải là số nguyên không âm.");
  const ongoing = value(form, "ongoing") === "on";
  const startedAt = date(value(form, "startedAt"));
  const endedAt = ongoing ? null : date(value(form, "endedAt"));
  if (
    (startedAt && Number.isNaN(startedAt.valueOf())) ||
    (endedAt && Number.isNaN(endedAt.valueOf()))
  )
    errors.push("Ngày không hợp lệ.");
  if (ongoing && !startedAt)
    errors.push("Dự án đang thực hiện cần có ngày bắt đầu.");
  if (startedAt && endedAt && endedAt < startedAt)
    errors.push("Ngày kết thúc không thể trước ngày bắt đầu.");
  const githubUrl = url(value(form, "githubUrl"), "GitHub URL", errors);
  const liveUrl = url(value(form, "liveUrl"), "Live URL", errors);
  if (!status || errors.length) return { errors };
  return {
    errors,
    data: {
      title,
      slug,
      summary,
      description,
      role: value(form, "role") || null,
      techStack: value(form, "techStack")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      githubUrl,
      liveUrl,
      status,
      startedAt,
      endedAt,
      displayOrder,
    },
  };
}

export function isProjectOngoing(startedAt: Date | null, endedAt: Date | null) {
  return Boolean(startedAt && !endedAt);
}
