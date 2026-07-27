import { requireAdmin } from "@/lib/supabase/auth";

export default async function AdminPage() {
  await requireAdmin();
  return <main className="mx-auto min-h-screen max-w-5xl px-[var(--page-gutter)] py-12"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-hover">Admin</p><h1 className="mt-3 text-3xl font-semibold">Khu vực quản trị đã được bảo vệ</h1><p className="mt-3 text-foreground-secondary">Giao diện quản trị nội dung sẽ được triển khai trong Task 07.</p></main>;
}
