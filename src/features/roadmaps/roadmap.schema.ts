export type RoadmapInput = { title: string; description: string | null };
export type StageInput = { title: string; description: string | null };

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
export const parseStageForm = (form: FormData) =>
  parseNamedItem(form, "Milestone");

export type MilestoneStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED";

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
        ? "IN_PROGRESS"
        : "PLANNED";
  return { completed, percentage, status };
}
