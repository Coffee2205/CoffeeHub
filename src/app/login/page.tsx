import { redirect } from "next/navigation";

import { AuthForm } from "@/app/login/auth-form";
import { Card } from "@/components/ui/card";
import { safeOwnerNextPath } from "@/lib/auth/redirects";
import { getVerifiedClaims } from "@/lib/supabase/auth";

type LoginPageProps = {
  searchParams: Promise<{ next?: string; reason?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  if (await getVerifiedClaims()) redirect("/app/dashboard");
  const params = await searchParams;
  const nextPath = safeOwnerNextPath(params.next);

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-6xl place-items-center px-[var(--page-gutter)] py-10">
      <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-hover">
            CoffeeHub
          </p>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Quay lại không gian tập trung của bạn.
          </h1>
          <p className="mt-5 max-w-lg text-foreground-secondary">
            Session được quản lý bởi Supabase Auth và xác minh ở server trước
            khi mở workspace.
          </p>
        </section>
        <Card className="p-6 sm:p-8">
          <h2 className="text-2xl font-semibold">Đăng nhập</h2>
          <p className="mt-2 mb-6 text-sm text-muted">
            Khu vực này chỉ dành cho chủ sở hữu CoffeeHub. Khách xem CV không
            cần tài khoản.
          </p>
          {params.reason === "session-expired" ? (
            <p
              role="status"
              className="mb-4 rounded-sm border border-warning/30 bg-warning/10 p-3 text-sm text-yellow-100"
            >
              Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập
              lại.
            </p>
          ) : null}
          {params.reason === "logout-failed" ? (
            <p
              role="alert"
              className="mb-4 rounded-sm border border-error/30 bg-error/10 p-3 text-sm text-red-200"
            >
              Không thể xác nhận đăng xuất với máy chủ. Vui lòng thử lại.
            </p>
          ) : null}
          {params.reason === "confirmation-failed" ? (
            <p
              role="alert"
              className="mb-4 rounded-sm border border-error/30 bg-error/10 p-3 text-sm text-red-200"
            >
              Liên kết xác nhận không hợp lệ hoặc đã hết hạn. Vui lòng liên hệ
              quản trị viên.
            </p>
          ) : null}
          <AuthForm nextPath={nextPath} />
        </Card>
      </div>
    </main>
  );
}
