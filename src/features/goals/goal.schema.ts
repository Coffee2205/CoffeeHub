export const GOAL_STATUSES = ["DRAFT", "ACTIVE", "PAUSED", "COMPLETED", "ARCHIVED"] as const;
export const GOAL_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

export type GoalInput = {
  title: string;
  description: string | null;
  status: (typeof GOAL_STATUSES)[number];
  priority: (typeof GOAL_PRIORITIES)[number];
  deadline: Date | null;
  successCriteria: string[];
};

const value = (form: FormData, key: string) => String(form.get(key) ?? "").trim();

export function parseGoalForm(form: FormData): { data?: GoalInput; errors: string[] } {
  const title = value(form, "title");
  const description = value(form, "description") || null;
  const status = GOAL_STATUSES.find((item) => item === value(form, "status"));
  const priority = GOAL_PRIORITIES.find((item) => item === value(form, "priority"));
  const deadlineValue = value(form, "deadline");
  const deadline = deadlineValue ? new Date(`${deadlineValue}T23:59:59.999Z`) : null;
  const successCriteria = value(form, "successCriteria").split("\n").map((item) => item.trim()).filter(Boolean);
  const errors: string[] = [];

  if (!title || title.length > 180) errors.push("Tiêu đề phải có từ 1 đến 180 ký tự.");
  if (description && description.length > 5000) errors.push("Mô tả không được vượt quá 5.000 ký tự.");
  if (!status) errors.push("Trạng thái không hợp lệ.");
  if (!priority) errors.push("Mức ưu tiên không hợp lệ.");
  if (deadline && Number.isNaN(deadline.valueOf())) errors.push("Deadline không hợp lệ.");
  if (successCriteria.length > 20 || successCriteria.some((item) => item.length > 240)) errors.push("Tối đa 20 tiêu chí, mỗi tiêu chí không quá 240 ký tự.");

  if (!status || !priority || errors.length) return { errors };
  return { data: { title, description, status, priority, deadline, successCriteria }, errors };
}

export function readSuccessCriteria(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}
