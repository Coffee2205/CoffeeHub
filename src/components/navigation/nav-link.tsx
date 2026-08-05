"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
import { NavIcon } from "./nav-icon";
import type { NavigationItem } from "./navigation-items";

export function NavLink({
  item,
  mobile = false,
}: {
  item: NavigationItem;
  mobile?: boolean;
}) {
  const pathname = usePathname();
  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        mobile
          ? "flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-sm px-1 text-[0.6875rem] font-medium"
          : "flex min-h-11 items-center gap-3 rounded-sm px-3 text-sm font-medium",
        "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-hover",
        active
          ? "bg-primary/14 text-blue-100"
          : "text-muted hover:bg-surface-subtle hover:text-foreground",
      )}
    >
      <NavIcon name={item.icon} />
      <span className="truncate">
        {mobile ? (item.shortLabel ?? item.label) : item.label}
      </span>
    </Link>
  );
}
