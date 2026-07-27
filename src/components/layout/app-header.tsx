export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-border bg-background/85 px-[var(--page-gutter)] backdrop-blur-xl lg:min-h-[4.5rem]">
      <div><p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Workspace</p><p className="mt-0.5 font-semibold tracking-[-0.02em]">Không gian tập trung</p></div>
      <div className="hidden items-center gap-2 sm:flex"><span className="rounded-full border border-border bg-surface-subtle px-3 py-1.5 text-xs text-muted">Foundation mode</span></div>
      <button type="button" disabled className="grid size-11 cursor-not-allowed place-items-center rounded-full border border-border bg-surface-subtle text-sm font-semibold text-muted sm:hidden" aria-label="Menu người dùng sẽ khả dụng sau khi xác thực">?</button>
    </header>
  );
}
