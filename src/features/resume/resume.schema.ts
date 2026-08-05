export const RESUME_KINDS = ["experience", "skill", "education"] as const;
export const CONTENT_STATUSES = ["DRAFT", "PUBLISHED", "HIDDEN"] as const;
export type ResumeKind = (typeof RESUME_KINDS)[number];
type Common = {
  status: (typeof CONTENT_STATUSES)[number];
  displayOrder: number;
};
export type ExperienceInput = Common & {
  role: string;
  organization: string;
  location: string | null;
  description: string;
  startedAt: Date;
  endedAt: Date | null;
};
export type SkillInput = Common & {
  name: string;
  category: string;
  proficiency: number | null;
};
export type EducationInput = Common & {
  institution: string;
  degree: string;
  fieldOfStudy: string | null;
  description: string | null;
  startedAt: Date | null;
  endedAt: Date | null;
};
export type ResumeInput = ExperienceInput | SkillInput | EducationInput;

const value = (form: FormData, key: string) =>
  String(form.get(key) ?? "").trim();
const date = (input: string) =>
  input ? new Date(`${input}T00:00:00.000Z`) : null;
function common(form: FormData, errors: string[]) {
  const status = CONTENT_STATUSES.find(
    (item) => item === value(form, "status"),
  );
  const displayOrder = Number(value(form, "displayOrder") || 0);
  if (!status) errors.push("Trạng thái không hợp lệ.");
  if (!Number.isInteger(displayOrder) || displayOrder < 0)
    errors.push("Thứ tự phải là số nguyên không âm.");
  return { status, displayOrder };
}
function validDates(
  startedAt: Date | null,
  endedAt: Date | null,
  errors: string[],
) {
  if (
    (startedAt && Number.isNaN(startedAt.valueOf())) ||
    (endedAt && Number.isNaN(endedAt.valueOf()))
  )
    errors.push("Ngày không hợp lệ.");
  if (startedAt && endedAt && endedAt < startedAt)
    errors.push("Ngày kết thúc không thể trước ngày bắt đầu.");
}
export function parseResumeForm(
  kind: ResumeKind,
  form: FormData,
): { data?: ResumeInput; errors: string[] } {
  const errors: string[] = [];
  const shared = common(form, errors);
  if (kind === "experience") {
    const role = value(form, "role");
    const organization = value(form, "organization");
    const location = value(form, "location") || null;
    const description = value(form, "description");
    const startedAt = date(value(form, "startedAt"));
    const endedAt = date(value(form, "endedAt"));
    if (!role || role.length > 180) errors.push("Vai trò phải có 1–180 ký tự.");
    if (!organization || organization.length > 180)
      errors.push("Tổ chức phải có 1–180 ký tự.");
    if (location && location.length > 180)
      errors.push("Địa điểm tối đa 180 ký tự.");
    if (!description || description.length > 5000)
      errors.push("Mô tả phải có 1–5000 ký tự.");
    if (!startedAt) errors.push("Ngày bắt đầu là bắt buộc.");
    validDates(startedAt, endedAt, errors);
    if (!shared.status || !startedAt || errors.length) return { errors };
    return {
      errors,
      data: {
        role,
        organization,
        location,
        description,
        startedAt,
        endedAt,
        status: shared.status,
        displayOrder: shared.displayOrder,
      },
    };
  }
  if (kind === "skill") {
    const name = value(form, "name");
    const category = value(form, "category");
    const raw = value(form, "proficiency");
    const proficiency = raw ? Number(raw) : null;
    if (!name || name.length > 120)
      errors.push("Tên kỹ năng phải có 1–120 ký tự.");
    if (!category || category.length > 120)
      errors.push("Nhóm kỹ năng phải có 1–120 ký tự.");
    if (
      proficiency !== null &&
      (!Number.isInteger(proficiency) || proficiency < 1 || proficiency > 5)
    )
      errors.push("Mức độ phải từ 1 đến 5.");
    if (!shared.status || errors.length) return { errors };
    return {
      errors,
      data: {
        name,
        category,
        proficiency,
        status: shared.status,
        displayOrder: shared.displayOrder,
      },
    };
  }
  const institution = value(form, "institution");
  const degree = value(form, "degree");
  const fieldOfStudy = value(form, "fieldOfStudy") || null;
  const description = value(form, "description") || null;
  const startedAt = date(value(form, "startedAt"));
  const endedAt = date(value(form, "endedAt"));
  if (!institution || institution.length > 180)
    errors.push("Cơ sở đào tạo phải có 1–180 ký tự.");
  if (!degree || degree.length > 180)
    errors.push("Bằng cấp phải có 1–180 ký tự.");
  if (fieldOfStudy && fieldOfStudy.length > 180)
    errors.push("Chuyên ngành tối đa 180 ký tự.");
  if (description && description.length > 5000)
    errors.push("Mô tả tối đa 5000 ký tự.");
  validDates(startedAt, endedAt, errors);
  if (!shared.status || errors.length) return { errors };
  return {
    errors,
    data: {
      institution,
      degree,
      fieldOfStudy,
      description,
      startedAt,
      endedAt,
      status: shared.status,
      displayOrder: shared.displayOrder,
    },
  };
}
