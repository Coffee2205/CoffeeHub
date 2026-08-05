import { logoutAction } from "@/app/login/actions";

type UserSummary = { displayName: string | null; isAdmin: boolean };

export function AppHeader({ user }: { user: UserSummary }) {
  return (
    <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-border bg-background/85 px-[var(--page-gutter)] backdrop-blur-xl lg:min-h-[4.5rem]">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
          Workspace
        </p>
        <p className="mt-0.5 font-semibold tracking-[-0.02em]">
          Không gian tập trung
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden max-w-56 truncate rounded-full border border-border bg-surface-subtle px-3 py-1.5 text-xs text-muted sm:block">
          {user.displayName ?? "Thành viên CoffeeHub"}
          {user.isAdmin ? " · Admin" : ""}
        </span>
        <form action={logoutAction}>
          <button
            type="submit"
            className="min-h-11 rounded-sm border border-border px-3 text-sm font-semibold text-foreground-secondary hover:border-primary-hover hover:text-foreground"
          >
            Đăng xuất
          </button>
        </form>
      </div>
    </header>
  );
}
