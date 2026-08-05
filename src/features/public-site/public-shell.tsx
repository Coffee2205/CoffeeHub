import Link from "next/link";
import type { ReactNode } from "react";

import { getPublicChrome } from "./public-site.repository";

export async function PublicShell({ children }: { children: ReactNode }) {
  let chrome: Awaited<ReturnType<typeof getPublicChrome>> | null = null;
  try {
    chrome = await getPublicChrome();
  } catch (error) {
    console.error("Unable to load public site chrome", error);
  }

  const siteName =
    chrome?.profile?.displayName ?? chrome?.settings?.siteName ?? "Portfolio";
  const links = chrome?.links ?? [];
  const navigation = links.filter((link) => link.kind === "NAVIGATION");
  const footerLinks = links.filter((link) => link.kind !== "NAVIGATION");

  return (
    <div className="min-h-screen bg-[#050914] text-slate-50">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050914]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-3 font-semibold tracking-tight"
            aria-label={`${siteName} — trang chủ`}
          >
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-300 text-sm font-black text-[#041020]">
              C
            </span>
            <span>{siteName}</span>
          </Link>
          <nav
            className="hidden items-center gap-6 text-sm text-slate-300 md:flex"
            aria-label="Điều hướng công khai"
          >
            {navigation.length ? (
              navigation.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target={link.openNewTab ? "_blank" : undefined}
                  rel={link.openNewTab ? "noreferrer" : undefined}
                  className="transition hover:text-white"
                >
                  {link.label}
                </a>
              ))
            ) : (
              <DefaultNavigation />
            )}
            <Link
              href="/login"
              className="rounded-full border border-blue-400/30 px-4 py-2 text-blue-200 transition hover:bg-blue-400/10"
            >
              Đăng nhập
            </Link>
          </nav>
          <Link
            href="/"
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200 md:hidden"
          >
            Trang chủ
          </Link>
        </div>
        <nav
          className="mx-auto flex max-w-6xl gap-6 overflow-x-auto px-5 pb-3 text-sm text-slate-400 md:hidden"
          aria-label="Điều hướng công khai trên di động"
        >
          <Link href="/about" className="shrink-0">
            Giới thiệu
          </Link>
          <Link href="/projects" className="shrink-0">
            Dự án
          </Link>
          <Link href="/posts" className="shrink-0">
            Bài viết
          </Link>
          <Link href="/login" className="shrink-0">
            Đăng nhập
          </Link>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="border-t border-white/10 bg-[#030712]">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="font-semibold">{siteName}</p>
            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-500">
              {chrome?.settings?.footerText ??
                "Nơi ý tưởng, dự án và hành trình được kết nối."}
            </p>
          </div>
          <div className="flex flex-wrap gap-5 text-sm text-slate-400">
            {footerLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target={link.openNewTab ? "_blank" : undefined}
                rel={link.openNewTab ? "noreferrer" : undefined}
                className="hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

function DefaultNavigation() {
  return (
    <>
      <Link href="/about" className="hover:text-white">
        Giới thiệu
      </Link>
      <Link href="/projects" className="hover:text-white">
        Dự án
      </Link>
      <Link href="/posts" className="hover:text-white">
        Bài viết
      </Link>
    </>
  );
}

export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="border-b border-white/10">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <p className="text-xs font-medium uppercase tracking-[.24em] text-cyan-300">
          {eyebrow}
        </p>
        <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-[-.05em] text-balance sm:text-7xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
          {description}
        </p>
      </div>
    </header>
  );
}

export function PublicNotice({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/15 bg-white/[.02] p-8 sm:p-10">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-3 max-w-2xl leading-7 text-slate-400">{body}</p>
      <Link
        href="/"
        className="mt-6 inline-flex text-sm font-medium text-cyan-300"
      >
        Quay về trang chủ →
      </Link>
    </div>
  );
}
