import { NavLink } from "@/components/navigation/nav-link";
import { mobileNavigation } from "@/components/navigation/navigation-items";

export function MobileBottomNav() {
  return (
    <nav
      aria-label="Điều hướng di động"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-background-secondary/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
    >
      {mobileNavigation.map((item) => (
        <NavLink key={item.href} item={item} mobile />
      ))}
    </nav>
  );
}
