export type RoadmapInput = { title: string; description: string | null };
export const ROADMAP_STAGE_STATUSES = ["PLANNED", "ACTIVE", "COMPLETED", "PAUSED", "SKIPPED"] as const;
export type StageInput = { title: string; description: string | null; startsAt: Date | null; endsAt: Date | null; status: (typeof ROADMAP_STAGE_STATUSES)[number]; successCriteria: string[] };

const value = (form: FormData, key: string) =>
  String(form.get(key) ?? "").trim();

function parseNamedItem(
  form: FormData,
  kind: "Roadmap" | "Milestone",
): { data?: RoadmapInput; errors: string[] } {
  const title = value(form, "title");
  const description = value(form, "description") || null;
  const errors: string[] = [];
  if (!title || title.length > 180)
    errors.push(`${kind} phải có tiêu đề từ 1 đến 180 ký tự.`);
  if (description && description.length > 3000)
    errors.push("Mô tả không được vượt quá 3.000 ký tự.");
  return errors.length ? { errors } : { data: { title, description }, errors };
}

export const parseRoadmapForm = (form: FormData) =>
  parseNamedItem(form, "Roadmap");
export const parseStageForm = (form: FormData): { data?: StageInput; errors: string[] } => {
  const base = parseNamedItem(form, "Milestone");
  if (!base.data) return { errors: base.errors };
  const startsAt = value(form, "startsAt") ? new Date(`${value(form, "startsAt")}T00:00:00.000Z`) : null;
  const endsAt = value(form, "endsAt") ? new Date(`${value(form, "endsAt")}T23:59:59.999Z`) : null;
  const status = ROADMAP_STAGE_STATUSES.find((item) => item === value(form, "status")) ?? "PLANNED";
  const successCriteria = value(form, "successCriteria").split("\n").map((item) => item.trim()).filter(Boolean);
  const errors = [...base.errors];
  if (startsAt && endsAt && startsAt > endsAt) errors.push("Stage start must be before its end.");
  if (successCriteria.length > 20 || successCriteria.some((item) => item.length > 240)) errors.push("Stage supports at most 20 success criteria of 240 characters.");
  return errors.length ? { errors } : { data: { ...base.data, startsAt, endsAt, status, successCriteria }, errors };
};

export type MilestoneStatus = "PLANNED" | "ACTIVE" | "COMPLETED";

export function milestoneProgress(statuses: string[]): {
  completed: number;
  percentage: number;
  status: MilestoneStatus;
} {
  const completed = statuses.filter((status) => status === "COMPLETED").length;
  const percentage = statuses.length
    ? Math.round((completed / statuses.length) * 100)
    : 0;
  const status =
    statuses.length > 0 && completed === statuses.length
      ? "COMPLETED"
      : statuses.some((item) => item === "IN_PROGRESS" || item === "COMPLETED")
        ? "ACTIVE"
        : "PLANNED";
  return { completed, percentage, status };
}
