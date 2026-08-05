import type { SiteSetting } from "@/generated/prisma/client";
import { STATUSES } from "../site-settings.schema";
export function SiteSettingForm({
  setting,
  action,
  error,
}: {
  setting: SiteSetting | null;
  action: (form: FormData) => void | Promise<void>;
  error?: string;
}) {
  return (
    <form
      action={action}
      className="mt-4 grid gap-4 rounded-lg border border-border bg-surface p-6"
    >
      {error ? (
        <p
          role="alert"
          className="rounded-sm border border-danger/40 bg-danger/10 p-3 text-sm text-red-200"
        >
          {error}
        </p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tên website">
          <input
            className="input"
            name="siteName"
            required
            maxLength={120}
            defaultValue={setting?.siteName}
          />
        </Field>
        <Field label="Tagline">
          <input
            className="input"
            name="tagline"
            required
            maxLength={240}
            defaultValue={setting?.tagline}
          />
        </Field>
      </div>
      <Field label="Nội dung footer">
        <textarea
          className="input"
          name="footerText"
          required
          maxLength={500}
          rows={3}
          defaultValue={setting?.footerText}
        />
      </Field>
      <Field label="Thông báo quyền riêng tư">
        <textarea
          className="input"
          name="privacyNote"
          required
          maxLength={5000}
          rows={5}
          defaultValue={setting?.privacyNote}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="SEO title">
          <input
            className="input"
            name="seoTitle"
            required
            maxLength={70}
            defaultValue={setting?.seoTitle}
          />
        </Field>
        <Field label="Canonical URL">
          <input
            className="input"
            name="canonicalUrl"
            type="url"
            defaultValue={setting?.canonicalUrl ?? ""}
          />
        </Field>
      </div>
      <Field label="SEO description">
        <textarea
          className="input"
          name="seoDescription"
          required
          maxLength={180}
          rows={3}
          defaultValue={setting?.seoDescription}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Đường dẫn ảnh SEO">
          <input
            className="input"
            name="seoImagePath"
            placeholder="/images/og.jpg"
            defaultValue={setting?.seoImagePath ?? ""}
          />
        </Field>
        <Field label="Trạng thái">
          <select
            className="input"
            name="status"
            defaultValue={setting?.status ?? "DRAFT"}
          >
            {STATUSES.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </Field>
      </div>
      <button className="w-fit rounded-sm bg-primary-control px-5 py-3 font-semibold text-white">
        Lưu cài đặt
      </button>
    </form>
  );
}
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      {children}
    </label>
  );
}
