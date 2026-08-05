import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="grid min-h-screen place-items-center px-[var(--page-gutter)]">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-error">
          403
        </p>
        <h1 className="mt-3 text-3xl font-semibold">
          Bạn không có quyền truy cập
        </h1>
        <p className="mt-3 text-foreground-secondary">
          Tài khoản hiện tại không có quyền quản trị khu vực này.
        </p>
        <Link
          href="/app/dashboard"
          className="mt-6 inline-flex min-h-11 items-center rounded-sm border border-border-strong bg-surface-strong px-4 font-semibold hover:border-primary-hover"
        >
          Quay lại workspace
        </Link>
      </div>
    </main>
  );
}
