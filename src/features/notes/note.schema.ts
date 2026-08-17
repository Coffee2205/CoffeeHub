export type NoteInput = {
  title: string;
  content: string;
  goalId?: string | null;
  roadmapId?: string | null;
  roadmapStageId?: string | null;
  taskId?: string | null;
  eventId?: string | null;
};

export function parseNoteInput(input: NoteInput) {
  const title = input.title.trim();
  const errors: string[] = [];

  if (!title || title.length > 220) {
    errors.push("Tiêu đề phải có từ 1 đến 220 ký tự.");
  }

  return errors.length
    ? { errors }
    : { data: { ...input, title, content: input.content } };
}
