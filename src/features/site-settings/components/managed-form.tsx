import Link from "next/link";
import type { Faq, SiteLink } from "@/generated/prisma/client";
import { LINK_KINDS, STATUSES, type ManagedKind } from "../site-settings.schema";

export function ManagedForm({ kind, item, action, error }: { kind: ManagedKind; item?: SiteLink | Faq; action: (form: FormData) => void | Promise<void>; error?: string }) {
  const link = kind === "link" ? item as SiteLink | undefined : undefined;
  const faq = kind === "faq" ? item as Faq | undefined : undefined;
  return <form action={action} className="mt-8 grid gap-5 rounded-lg border border-border bg-surface p-6">
    {error ? <p role="alert" className="rounded-sm border border-danger/40 bg-danger/10 p-3 text-sm text-red-200">{error}</p> : null}
    {kind === "link" ? <>
      <Field label="Nhãn"><input name="label" required maxLength={120} defaultValue={link?.label} className="input" /></Field>
      <Field label="URL"><input name="url" required defaultValue={link?.url} placeholder="/about hoặc https://..." className="input" /></Field>
      <Field label="Vị trí"><select name="kind" defaultValue={link?.kind ?? "NAVIGATION"} className="input">{LINK_KINDS.map(value => <option key={value} value={value}>{value}</option>)}</select></Field>
      <label className="flex items-center gap-3 text-sm"><input type="checkbox" name="openNewTab" defaultChecked={link?.openNewTab} /> Mở trong tab mới</label>
    </> : <>
      <Field label="Câu hỏi"><input name="question" required maxLength={240} defaultValue={faq?.question} className="input" /></Field>
      <Field label="Câu trả lời"><textarea name="answer" required maxLength={5000} rows={8} defaultValue={faq?.answer} className="input" /></Field>
    </>}
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Trạng thái"><select name="status" defaultValue={item?.status ?? "DRAFT"} className="input">{STATUSES.map(value => <option key={value} value={value}>{value}</option>)}</select></Field>
      <Field label="Thứ tự"><input name="displayOrder" type="number" min="0" step="1" defaultValue={item?.displayOrder ?? 0} className="input" /></Field>
    </div>
    <div className="flex gap-3"><button className="rounded-sm bg-primary-control px-5 py-3 font-semibold text-white">Lưu</button><Link href="/admin/settings" className="rounded-sm border border-border-strong px-5 py-3 font-semibold">Hủy</Link></div>
  </form>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-2 text-sm font-medium">{label}{children}</label>; }
