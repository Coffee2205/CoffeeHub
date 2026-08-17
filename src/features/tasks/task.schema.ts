export const TASK_STATUSES = [
  "TODO",
  "IN_PROGRESS",
  "BLOCKED",
  "COMPLETED",
  "CANCELLED",
] as const;
export const TASK_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

export type TaskInput = {
  title: string;
  description: string | null;
  status: (typeof TASK_STATUSES)[number];
  priority: (typeof TASK_PRIORITIES)[number];
  dueAt: Date | null;
  goalId: string | null;
  roadmapId: string | null;
  roadmapStageId: string | null;
  estimatedMinutes: number | null;
  expectedResult: string | null;
  resources: { name: string; type: string }[];
  source: string | null;
  externalKey: string | null;
  isOptional: boolean;
};

const value = (form: FormData, key: string) =>
  String(form.get(key) ?? "").trim();

export function parseTaskForm(form: FormData): {
  data?: TaskInput;
  errors: string[];
} {
  const title = value(form, "title");
  const description = value(form, "description") || null;
  const status = TASK_STATUSES.find((item) => item === value(form, "status"));
  const priority = TASK_PRIORITIES.find(
    (item) => item === value(form, "priority"),
  );
  const dueValue = value(form, "dueAt");
  const dueAt = dueValue ? new Date(`${dueValue}T23:59:59.999Z`) : null;
  const goalId = value(form, "goalId") || null;
  const roadmapId = value(form, "roadmapId") || null;
  const roadmapStageId = value(form, "roadmapStageId") || null;
  const durationValue = value(form, "estimatedMinutes");
  const estimatedMinutes = durationValue ? Number(durationValue) : null;
  const expectedResult = value(form, "expectedResult") || null;
  const source = value(form, "source") || null;
  const externalKey = value(form, "externalKey") || null;
  const isOptional = form.get("isOptional") === "on";
  const resources = value(form, "resources").split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
    const [name, type = "other"] = line.split("|").map((item) => item.trim());
    return { name, type };
  });
  const errors: string[] = [];
  if (!title || title.length > 220)
    errors.push("Tiêu đề phải có từ 1 đến 220 ký tự.");
  if (description && description.length > 5000)
    errors.push("Mô tả không được vượt quá 5.000 ký tự.");
  if (!status) errors.push("Trạng thái không hợp lệ.");
  if (!priority) errors.push("Mức ưu tiên không hợp lệ.");
  if (dueAt && Number.isNaN(dueAt.valueOf()))
    errors.push("Deadline không hợp lệ.");
  if (estimatedMinutes !== null && (!Number.isInteger(estimatedMinutes) || estimatedMinutes <= 0)) errors.push("Duration must be a positive number of minutes.");
  if (expectedResult && expectedResult.length > 2000) errors.push("Expected result is too long.");
  if (source && source.length > 160) errors.push("Source is too long.");
  if (externalKey && externalKey.length > 255) errors.push("External key is too long.");
  if (resources.some((item) => !item.name || item.name.length > 240 || item.type.length > 80)) errors.push("Resources must use Name | type format.");
  if (!status || !priority || errors.length) return { errors };
  return {
    data: {
      title,
      description,
      status,
      priority,
      dueAt,
      goalId,
      roadmapId,
      roadmapStageId,
      estimatedMinutes,
      expectedResult,
      resources,
      source,
      externalKey,
      isOptional,
    },
    errors,
  };
}

export function isTaskOverdue(
  dueAt: Date | null,
  status: string,
  now = new Date(),
) {
  return Boolean(
    dueAt && dueAt < now && status !== "COMPLETED" && status !== "CANCELLED",
  );
}
