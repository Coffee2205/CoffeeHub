import Link from "next/link";

import { Badge, Button, Card, CardDescription, CardHeader, CardTitle, Input } from "@/components/ui";
import { saveWorkspaceProfileAction } from "@/features/profile/workspace-profile.actions";
import { getWorkspaceProfileSnapshot } from "@/features/profile/workspace-profile.repository";
import { WORKSPACE_TIMEZONES } from "@/features/profile/workspace-profile.schema";
import { requireUser } from "@/lib/supabase/auth";

type SearchParams = { error?: string; saved?: string };

export default async function WorkspaceProfilePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const user = await requireUser();
  const [{ profile, counts }, query] = await Promise.all([getWorkspaceProfileSnapshot(user.id), searchParams]);
  const isPublished = profile?.status === "PUBLISHED";

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="primary">Tài khoản</Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Hồ sơ workspace</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground-secondary sm:text-base">Thông tin riêng cho trải nghiệm CoffeeHub của bạn. Nội dung portfolio công khai vẫn được quản lý riêng trong Admin.</p>
        </div>
        <Link href="/about" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-sm border border-border-strong bg-surface-strong px-4 text-sm font-semibold hover:border-primary-hover">Mở hồ sơ công khai</Link>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin workspace</CardTitle>
            <CardDescription>Tên này chỉ dùng trong workspace. Múi giờ sẽ là preference mặc định cho các tính năng lịch và lập kế hoạch.</CardDescription>
          </CardHeader>
          <form action={saveWorkspaceProfileAction} className="grid gap-5">
            {query.error ? <p role="alert" className="rounded-sm border border-error/30 bg-error/10 px-4 py-3 text-sm text-red-200">{query.error}</p> : null}
            {query.saved ? <p role="status" className="rounded-sm border border-success/30 bg-success/10 px-4 py-3 text-sm text-green-200">Đã lưu hồ sơ workspace.</p> : null}
            <label className="grid gap-2"><span className="text-sm font-medium">Tên trong workspace</span><Input name="workspaceName" maxLength={120} defaultValue={profile?.workspaceName ?? ""} placeholder={profile?.displayName ?? user.email ?? "CoffeeHub member"} /><span className="text-xs leading-5 text-muted">Để trống để CoffeeHub dùng tên public hoặc phần trước địa chỉ email.</span></label>
            <label className="grid gap-2"><span className="text-sm font-medium">Múi giờ</span><select name="timezone" defaultValue={profile?.timezone ?? "UTC"} className="min-h-11 rounded-sm border border-border bg-background-secondary px-3 text-sm focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30">{WORKSPACE_TIMEZONES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
            <div><Button type="submit">Lưu thay đổi</Button></div>
          </form>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader><CardTitle>Tài khoản đăng nhập</CardTitle><CardDescription>Email được lấy từ session Supabase đã xác minh và không chỉnh sửa tại đây.</CardDescription></CardHeader>
            <dl className="space-y-4 text-sm"><div><dt className="text-muted">Email</dt><dd className="mt-1 break-all font-medium">{user.email ?? "Chưa có email trong session"}</dd></div><div><dt className="text-muted">Vai trò</dt><dd className="mt-1 font-medium">{user.isAdmin ? "Quản trị viên" : "Thành viên"}</dd></div></dl>
          </Card>

          <Card>
            <CardHeader><CardTitle>Hiển thị công khai</CardTitle><CardDescription>Draft và Hidden không xuất hiện trên website công khai.</CardDescription></CardHeader>
            <div className="flex items-center justify-between gap-4 rounded-md border border-border bg-surface-subtle p-4"><div><p className="text-sm font-medium">Portfolio Profile</p><p className="mt-1 text-xs text-muted">{isPublished && profile?.publishedAt ? `Published · ${new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeZone: "UTC" }).format(profile.publishedAt)}` : profile?.status ?? "DRAFT"}</p></div><Badge variant={isPublished ? "success" : "neutral"}>{isPublished ? "Public" : "Private"}</Badge></div>
            {user.isAdmin ? <Link href="/admin/profile" className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-primary-hover hover:text-blue-200">Quản lý nội dung portfolio →</Link> : <p className="mt-4 text-sm leading-6 text-muted">Chỉ Admin có thể chỉnh nội dung portfolio công khai.</p>}
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nội dung hồ sơ</CardTitle>
          <CardDescription>Tổng quan dữ liệu thuộc tài khoản hiện tại. Trạng thái Draft, Published hoặc Hidden được quản lý trong Admin.</CardDescription>
        </CardHeader>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <ProfileArea title="Kinh nghiệm" summary={counts.experiences} href="/admin/resume" canManage={user.isAdmin} />
          <ProfileArea title="Kỹ năng" summary={counts.skills} href="/admin/resume" canManage={user.isAdmin} />
          <ProfileArea title="Học vấn" summary={counts.education} href="/admin/resume" canManage={user.isAdmin} />
          <ProfileArea title="Dự án" summary={counts.projects} href="/admin/projects" canManage={user.isAdmin} />
        </div>
        {user.isAdmin ? (
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/admin/profile" className="inline-flex min-h-11 items-center rounded-sm bg-primary-control px-4 text-sm font-semibold text-white hover:bg-primary-hover">Sửa hồ sơ cơ bản</Link>
            <Link href="/admin/resume" className="inline-flex min-h-11 items-center rounded-sm border border-border-strong px-4 text-sm font-semibold hover:border-primary-hover">Quản lý CV</Link>
            <Link href="/admin/projects" className="inline-flex min-h-11 items-center rounded-sm border border-border-strong px-4 text-sm font-semibold hover:border-primary-hover">Quản lý dự án</Link>
          </div>
        ) : (
          <p className="mt-5 text-sm text-muted">Bạn có thể xem tổng quan, nhưng cần quyền Admin để chỉnh nội dung công khai.</p>
        )}
      </Card>
    </div>
  );
}

function ProfileArea({ title, summary, href, canManage }: { title: string; summary: { total: number; published: number }; href: string; canManage: boolean }) {
  return (
    <div className="rounded-md border border-border bg-surface-subtle p-4">
      <p className="text-sm text-muted">{title}</p>
      <p className="mt-2 text-2xl font-semibold">{summary.total}</p>
      <p className="mt-1 text-xs text-muted">{summary.published} đang công khai</p>
      {canManage ? <Link href={href} className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-primary-hover hover:text-blue-200">Mở quản lý →</Link> : null}
    </div>
  );
}
