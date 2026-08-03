export const TASK_STATUSES = ["TODO", "IN_PROGRESS", "BLOCKED", "COMPLETED", "CANCELLED"] as const;
export const TASK_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

export type TaskInput = {
  title: string; description: string | null;
  status: (typeof TASK_STATUSES)[number]; priority: (typeof TASK_PRIORITIES)[number];
  dueAt: Date | null; goalId: string | null; roadmapId: string | null; roadmapStageId: string | null;
};

const value = (form: FormData, key: string) => String(form.get(key) ?? "").trim();

export function parseTaskForm(form: FormData): { data?: TaskInput; errors: string[] } {
  const title = value(form, "title"); const description = value(form, "description") || null;
  const status = TASK_STATUSES.find((item) => item === value(form, "status"));
  const priority = TASK_PRIORITIES.find((item) => item === value(form, "priority"));
  const dueValue = value(form, "dueAt"); const dueAt = dueValue ? new Date(`${dueValue}T23:59:59.999Z`) : null;
  const goalId = value(form, "goalId") || null; const roadmapId = value(form, "roadmapId") || null; const roadmapStageId = value(form, "roadmapStageId") || null;
  const errors: string[] = [];
  if (!title || title.length > 220) errors.push("Tiêu đề phải có từ 1 đến 220 ký tự.");
  if (description && description.length > 5000) errors.push("Mô tả không được vượt quá 5.000 ký tự.");
  if (!status) errors.push("Trạng thái không hợp lệ."); if (!priority) errors.push("Mức ưu tiên không hợp lệ.");
  if (dueAt && Number.isNaN(dueAt.valueOf())) errors.push("Deadline không hợp lệ.");
  if (!status || !priority || errors.length) return { errors };
  return { data: { title, description, status, priority, dueAt, goalId, roadmapId, roadmapStageId }, errors };
}

export function isTaskOverdue(dueAt: Date | null, status: string, now = new Date()) {
  return Boolean(dueAt && dueAt < now && status !== "COMPLETED" && status !== "CANCELLED");
}
