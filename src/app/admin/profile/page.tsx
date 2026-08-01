import Image from "next/image";

import { Button, Input, Textarea } from "@/components/ui";
import { deleteProfileAvatarAction, uploadProfileAvatarAction } from "@/features/profile/profile-avatar.actions";
import { getProfileAvatarUrl } from "@/features/profile/profile-avatar";
import { DeleteAvatarButton } from "@/features/profile/delete-avatar-button";
import { saveProfileAction } from "@/features/profile/profile.actions";
import { getAdminProfile } from "@/features/profile/profile.repository";
import { PROJECT_STATUSES } from "@/features/projects/project.schema";
import { requireAdmin } from "@/lib/supabase/auth";

type SearchParams = { error?: string; saved?: string; avatarError?: string; avatarSaved?: string; avatarDeleted?: string };

export default async function AdminProfilePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const user = await requireAdmin();
  const [profile, query] = await Promise.all([getAdminProfile(user.id), searchParams]);
  const avatarUrl = await getProfileAvatarUrl(profile?.avatarPath);

  return (
    <main className="mx-auto max-w-4xl px-[var(--page-gutter)] py-10">
      <h1 className="text-3xl font-semibold">Profile / About</h1>
      <p className="mt-2 text-foreground-secondary">Nội dung hồ sơ công khai; draft và hidden không xuất hiện qua Data API.</p>

      <form action={saveProfileAction} className="mt-6 grid gap-5 rounded-lg border border-border bg-surface p-5">
        {query.error ? <p role="alert" className="text-sm text-red-200">{query.error}</p> : null}
        {query.saved ? <p role="status" className="text-sm text-green-200">Profile đã được lưu.</p> : null}
        <label className="grid gap-2"><span className="text-sm font-medium">Tên hiển thị</span><Input name="displayName" required maxLength={120} defaultValue={profile?.displayName ?? ""} /></label>
        <label className="grid gap-2"><span className="text-sm font-medium">Headline</span><Input name="headline" required maxLength={180} defaultValue={profile?.headline ?? ""} /></label>
        <label className="grid gap-2"><span className="text-sm font-medium">Giới thiệu</span><Textarea name="bio" required maxLength={5000} className="min-h-52" defaultValue={profile?.bio ?? ""} /></label>
        <label className="grid gap-2"><span className="text-sm font-medium">Trạng thái</span><select name="status" defaultValue={profile?.status ?? "DRAFT"} className="min-h-11 rounded-sm border border-border bg-background-secondary px-3">{PROJECT_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label>
        <div><Button type="submit">Lưu profile</Button></div>
      </form>

      <section className="mt-6 rounded-lg border border-border bg-surface p-5">
        <h2 className="text-xl font-semibold">Avatar</h2>
        <p className="mt-1 text-sm text-foreground-secondary">JPEG, PNG hoặc WebP; tối đa 5 MB. Avatar chỉ xuất hiện công khai khi Profile ở trạng thái Published.</p>
        {query.avatarError ? <p role="alert" className="mt-4 text-sm text-red-200">{query.avatarError}</p> : null}
        {query.avatarSaved ? <p role="status" className="mt-4 text-sm text-green-200">Avatar đã được cập nhật.</p> : null}
        {query.avatarDeleted ? <p role="status" className="mt-4 text-sm text-green-200">Avatar đã được xóa.</p> : null}

        <div className="mt-5 grid gap-6 md:grid-cols-[12rem_1fr]">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-background-secondary">
            {avatarUrl ? <Image src={avatarUrl} alt={profile?.avatarAlt ?? "Avatar Profile"} fill sizes="192px" className="object-cover" /> : <div className="grid h-full place-items-center px-4 text-center text-sm text-foreground-secondary">Chưa có avatar</div>}
          </div>
          <div>
            <form action={uploadProfileAvatarAction} className="grid gap-4">
              <label className="grid gap-2 text-sm"><span>Ảnh avatar</span><Input name="file" type="file" accept="image/jpeg,image/png,image/webp" required /></label>
              <label className="grid gap-2 text-sm"><span>Alt text</span><Input name="altText" required maxLength={240} defaultValue={profile?.avatarAlt ?? (profile?.displayName ? `Ảnh chân dung ${profile.displayName}` : "")} /></label>
              <div><Button type="submit">{profile?.avatarPath ? "Thay avatar" : "Tải avatar"}</Button></div>
            </form>
            {profile?.avatarPath ? <div className="mt-4"><DeleteAvatarButton action={deleteProfileAvatarAction} /></div> : null}
          </div>
        </div>
      </section>
    </main>
  );
}
