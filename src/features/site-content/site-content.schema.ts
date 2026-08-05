export const SITE_CONTENT_KINDS = ["post", "section"] as const;
export const CONTENT_STATUSES = ["DRAFT", "PUBLISHED", "HIDDEN"] as const;
export type SiteContentKind = (typeof SITE_CONTENT_KINDS)[number];
type Common = {
  status: (typeof CONTENT_STATUSES)[number];
  displayOrder: number;
};
export type PostInput = Common & {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
};
export type SectionInput = Common & {
  pageKey: string;
  sectionKey: string;
  heading: string;
  body: string;
  ctaLabel: string | null;
  ctaUrl: string | null;
};
export type SiteContentInput = PostInput | SectionInput;
const value = (form: FormData, key: string) =>
  String(form.get(key) ?? "").trim();
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
function key(input: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input);
}
function url(input: string, errors: string[]) {
  if (!input) return null;
  try {
    const parsed = new URL(input, "https://coffeehub.invalid");
    if (parsed.origin === "https://coffeehub.invalid") {
      if (!input.startsWith("/")) throw new Error();
      return input;
    }
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
    return parsed.toString();
  } catch {
    errors.push("CTA URL phải là đường dẫn nội bộ hoặc HTTP(S) hợp lệ.");
    return null;
  }
}
export function parseSiteContentForm(
  kind: SiteContentKind,
  form: FormData,
): { data?: SiteContentInput; errors: string[] } {
  const errors: string[] = [];
  const shared = common(form, errors);
  const body = value(form, "body");
  if (!body || body.length > 20000)
    errors.push("Nội dung phải có 1–20000 ký tự.");
  if (kind === "post") {
    const title = value(form, "title");
    const slug = value(form, "slug").toLowerCase();
    const excerpt = value(form, "excerpt");
    if (!title || title.length > 180)
      errors.push("Tiêu đề phải có 1–180 ký tự.");
    if (!key(slug) || slug.length > 180)
      errors.push("Slug chỉ gồm chữ thường, số và dấu gạch ngang.");
    if (!excerpt || excerpt.length > 320)
      errors.push("Tóm tắt phải có 1–320 ký tự.");
    if (!shared.status || errors.length) return { errors };
    return {
      errors,
      data: {
        title,
        slug,
        excerpt,
        body,
        status: shared.status,
        displayOrder: shared.displayOrder,
      },
    };
  }
  const pageKey = value(form, "pageKey").toLowerCase();
  const sectionKey = value(form, "sectionKey").toLowerCase();
  const heading = value(form, "heading");
  const ctaLabel = value(form, "ctaLabel") || null;
  const rawCtaUrl = value(form, "ctaUrl");
  const ctaUrl = url(rawCtaUrl, errors);
  if (!key(pageKey) || pageKey.length > 80)
    errors.push("Page key không hợp lệ.");
  if (!key(sectionKey) || sectionKey.length > 80)
    errors.push("Section key không hợp lệ.");
  if (!heading || heading.length > 180)
    errors.push("Heading phải có 1–180 ký tự.");
  if (ctaLabel && ctaLabel.length > 120)
    errors.push("CTA label tối đa 120 ký tự.");
  if (Boolean(ctaLabel) !== Boolean(rawCtaUrl))
    errors.push("CTA label và URL phải được nhập cùng nhau.");
  if (!shared.status || errors.length) return { errors };
  return {
    errors,
    data: {
      pageKey,
      sectionKey,
      heading,
      body,
      ctaLabel,
      ctaUrl,
      status: shared.status,
      displayOrder: shared.displayOrder,
    },
  };
}
