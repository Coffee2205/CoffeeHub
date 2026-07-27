import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { requireUser } from "@/lib/supabase/auth";

export default async function WorkspaceLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await requireUser();
  return <div className="min-h-screen lg:pl-64"><AppSidebar user={user} /><div className="min-h-screen"><AppHeader user={user} /><main id="main-content" className="mx-auto w-full max-w-[var(--content-width)] px-[var(--page-gutter)] py-6 pb-24 sm:py-8 lg:pb-10">{children}</main></div><MobileBottomNav /></div>;
}
