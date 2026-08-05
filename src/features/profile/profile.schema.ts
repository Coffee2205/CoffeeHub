import { PROJECT_STATUSES } from "@/features/projects/project.schema";
export type ProfileInput = {
  displayName: string;
  headline: string;
  bio: string;
  status: (typeof PROJECT_STATUSES)[number];
};
export function parseProfileForm(form: FormData): {
  data?: ProfileInput;
  errors: string[];
} {
  const displayName = String(form.get("displayName") ?? "").trim();
  const headline = String(form.get("headline") ?? "").trim();
  const bio = String(form.get("bio") ?? "").trim();
  const status = PROJECT_STATUSES.find((item) => item === form.get("status"));
  const errors: string[] = [];
  if (!displayName || displayName.length > 120)
    errors.push("Tên hiển thị phải có 1–120 ký tự.");
  if (!headline || headline.length > 180)
    errors.push("Headline phải có 1–180 ký tự.");
  if (!bio || bio.length > 5000)
    errors.push("Giới thiệu phải có 1–5000 ký tự.");
  if (!status) errors.push("Trạng thái không hợp lệ.");
  return status && !errors.length
    ? { data: { displayName, headline, bio, status }, errors }
    : { errors };
}
