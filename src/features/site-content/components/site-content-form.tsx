import { Button, Input, Textarea } from "@/components/ui";
import { CONTENT_STATUSES, type SiteContentKind } from "../site-content.schema";
type Item = {
  title?: string;
  slug?: string;
  excerpt?: string;
  body: string;
  pageKey?: string;
  sectionKey?: string;
  heading?: string;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  status: string;
  displayOrder: number;
};
export function SiteContentForm({
  kind,
  action,
  item,
  error,
}: {
  kind: SiteContentKind;
  action: (form: FormData) => void | Promise<void>;
  item?: Item;
  error?: string;
}) {
  return (
    <form
      action={action}
      className="mt-6 grid gap-5 rounded-lg border border-border bg-surface p-5 md:grid-cols-2"
    >
      {error ? (
        <p
          role="alert"
          className="md:col-span-2 rounded-sm border border-error/40 bg-error/10 p-3 text-sm text-red-200"
        >
          {error}
        </p>
      ) : null}
      {kind === "post" ? (
        <>
          <Field label="Tiêu đề">
            <Input
              name="title"
              required
              maxLength={180}
              defaultValue={item?.title}
            />
          </Field>
          <Field label="Slug">
            <Input
              name="slug"
              required
              maxLength={180}
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              defaultValue={item?.slug}
            />
          </Field>
          <Field label="Tóm tắt" wide>
            <Textarea
              name="excerpt"
              required
              maxLength={320}
              defaultValue={item?.excerpt}
            />
          </Field>
        </>
      ) : (
        <>
          <Field label="Page key">
            <Input
              name="pageKey"
              required
              maxLength={80}
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              defaultValue={item?.pageKey}
            />
          </Field>
          <Field label="Section key">
            <Input
              name="sectionKey"
              required
              maxLength={80}
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              defaultValue={item?.sectionKey}
            />
          </Field>
          <Field label="Heading" wide>
            <Input
              name="heading"
              required
              maxLength={180}
              defaultValue={item?.heading}
            />
          </Field>
          <Field label="CTA label">
            <Input
              name="ctaLabel"
              maxLength={120}
              defaultValue={item?.ctaLabel ?? ""}
            />
          </Field>
          <Field label="CTA URL">
            <Input
              name="ctaUrl"
              placeholder="/login hoặc https://…"
              defaultValue={item?.ctaUrl ?? ""}
            />
          </Field>
        </>
      )}
      <Field label="Nội dung" wide>
        <Textarea
          name="body"
          required
          maxLength={20000}
          className="min-h-64"
          defaultValue={item?.body}
        />
      </Field>
      <Field label="Trạng thái">
        <select
          name="status"
          defaultValue={item?.status ?? "DRAFT"}
          className="min-h-11 rounded-sm border border-border bg-background-secondary px-3.5"
        >
          {CONTENT_STATUSES.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </Field>
      <Field label="Thứ tự">
        <Input
          name="displayOrder"
          type="number"
          min={0}
          step={1}
          defaultValue={item?.displayOrder ?? 0}
        />
      </Field>
      <div className="md:col-span-2">
        <Button type="submit">
          {item
            ? "Lưu thay đổi"
            : kind === "post"
              ? "Tạo bài viết"
              : "Tạo section"}
        </Button>
      </div>
    </form>
  );
}
function Field({
  label,
  children,
  wide,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={wide ? "grid gap-2 md:col-span-2" : "grid gap-2"}>
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
