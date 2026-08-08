export type ChecklistInput = {
  title: string;
  description: string | null;
  goalId: string | null;
  roadmapId: string | null;
  taskId: string | null;
};

export type ChecklistItemInput = {
  title: string;
};

const value = (form: FormData, key: string) =>
  String(form.get(key) ?? "").trim();

export function parseChecklistForm(form: FormData): {
  data?: ChecklistInput;
  errors: string[];
} {
  const title = value(form, "title");
  const description = value(form, "description") || null;
  const goalId = value(form, "goalId") || null;
  const roadmapId = value(form, "roadmapId") || null;
  const taskId = value(form, "taskId") || null;
  const errors: string[] = [];
  if (!title || title.length > 220)
    errors.push("Tiêu đề phải có từ 1 đến 220 ký tự.");
  if (description && description.length > 5000)
    errors.push("Mô tả không được vượt quá 5.000 ký tự.");
  if ([goalId, roadmapId, taskId].filter(Boolean).length > 1)
    errors.push("Chỉ chọn một ngữ cảnh Goal, Roadmap hoặc Task.");
  if (errors.length) return { errors };
  return {
    data: { title, description, goalId, roadmapId, taskId },
    errors,
  };
}

export function parseChecklistItemForm(form: FormData): {
  data?: ChecklistItemInput;
  errors: string[];
} {
  const title = value(form, "title");
  const errors: string[] = [];
  if (!title || title.length > 220)
    errors.push("Tên item phải có từ 1 đến 220 ký tự.");
  if (errors.length) return { errors };
  return { data: { title }, errors };
}

export function summarizeChecklistItems(items: Array<{ completed: boolean }>) {
  const total = items.length;
  const completed = items.filter((item) => item.completed).length;
  return {
    total,
    completed,
    progress: total ? Math.round((completed / total) * 100) : 0,
  };
}
