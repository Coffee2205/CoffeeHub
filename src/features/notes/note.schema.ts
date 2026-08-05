export type NoteInput = {
  title: string;
  content: string;
};

export function parseNoteInput(input: NoteInput) {
  const title = input.title.trim();
  const errors: string[] = [];

  if (!title || title.length > 220) {
    errors.push("Tiêu đề phải có từ 1 đến 220 ký tự.");
  }

  return errors.length
    ? { errors }
    : { data: { title, content: input.content } };
}
