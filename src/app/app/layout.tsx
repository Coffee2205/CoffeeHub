import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { getWorkspaceProfile } from "@/features/profile/workspace-profile.repository";
import { requireUser } from "@/lib/supabase/auth";

export default async function WorkspaceLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireUser();
  const profile = await getWorkspaceProfile(user.id);
  const userSummary = { ...user, displayName: profile?.displayName ?? null };
  return (
    <div className="min-h-screen lg:pl-64">
      <AppSidebar user={userSummary} />
      <div className="min-h-screen">
        <AppHeader user={userSummary} />
        <main
          id="main-content"
          className="mx-auto w-full max-w-[var(--content-width)] px-[var(--page-gutter)] py-6 pb-24 sm:py-8 lg:pb-10"
        >
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
