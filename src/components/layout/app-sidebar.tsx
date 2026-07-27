import Link from "next/link";

import { NavLink } from "@/components/navigation/nav-link";
import { desktopNavigation } from "@/components/navigation/navigation-items";

export function AppSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-background-secondary/95 px-4 py-5 backdrop-blur-xl lg:flex lg:flex-col">
      <Link href="/app/dashboard" className="flex min-h-11 items-center gap-3 rounded-sm px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-hover">
        <span className="grid size-9 place-items-center rounded-sm bg-primary-control font-semibold text-white shadow-[0_8px_24px_rgba(37,99,235,0.28)]">C</span>
        <span><span className="block font-semibold tracking-[-0.02em]">CoffeeHub</span><span className="block text-xs text-muted">Personal workspace</span></span>
      </Link>
      <nav className="mt-7 flex-1 space-y-6 overflow-y-auto" aria-label="Điều hướng workspace">
        {desktopNavigation.map((group) => <div key={group.label}><p className="mb-2 px-3 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted">{group.label}</p><div className="space-y-1">{group.items.map((item) => <NavLink key={item.href} item={item} />)}</div></div>)}
      </nav>
      <button type="button" disabled className="mt-4 flex min-h-12 w-full cursor-not-allowed items-center gap-3 rounded-sm border border-border bg-surface-subtle px-3 text-left opacity-70" aria-label="Menu người dùng sẽ khả dụng sau khi xác thực">
        <span className="grid size-8 place-items-center rounded-full bg-background-tertiary text-xs font-semibold text-muted">?</span>
        <span><span className="block text-sm font-medium">Tài khoản</span><span className="block text-xs text-muted">Chờ thiết lập Auth</span></span>
      </button>
    </aside>
  );
}
