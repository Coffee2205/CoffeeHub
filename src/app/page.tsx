import type { Metadata } from "next";
import Link from "next/link";

import { getPublicHomeData, type PublicHomeData } from "@/features/public-site/public-site.repository";

export const dynamic = "force-dynamic";

async function loadHome(): Promise<{ data: PublicHomeData | null; failed: boolean }> {
  try {
    return { data: await getPublicHomeData(), failed: false };
  } catch (error) {
    console.error("Unable to load published public content", error);
    return { data: null, failed: true };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await loadHome();
  const settings = data?.settings;
  return {
    title: settings?.seoTitle ?? settings?.siteName ?? "CoffeeHub",
    description: settings?.seoDescription ?? "Không gian công khai cho những dự án, câu chuyện và hành trình đang được xây dựng.",
    alternates: settings?.canonicalUrl ? { canonical: settings.canonicalUrl } : undefined,
  };
}

const Arrow = () => <span aria-hidden="true">↗</span>;

export default async function Home() {
  const { data, failed } = await loadHome();
  const settings = data?.settings;
  const profile = data?.profile;
  const sections = data?.sections ?? [];
  const projects = data?.projects ?? [];
  const faqs = data?.faqs ?? [];
  const navigation = (data?.links ?? []).filter((link) => link.kind === "NAVIGATION");
  const footer = (data?.links ?? []).filter((link) => link.kind === "FOOTER");
  const social = (data?.links ?? []).filter((link) => link.kind === "SOCIAL");
  const hasPublishedContent = Boolean(settings || profile || sections.length || projects.length || faqs.length);
  const siteName = settings?.siteName ?? "CoffeeHub";

  return (
    <div className="min-h-screen bg-[#050914] text-slate-50">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050914]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight" aria-label={`${siteName} — trang chủ`}>
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-300 text-sm font-black text-[#041020]">C</span>
            <span>{siteName}</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-slate-300 md:flex" aria-label="Điều hướng chính">
            {navigation.map((link) => <a key={link.id} href={link.url} target={link.openNewTab ? "_blank" : undefined} rel={link.openNewTab ? "noreferrer" : undefined} className="transition hover:text-white">{link.label}</a>)}
            <Link href="/login" className="rounded-full border border-blue-400/30 px-4 py-2 text-blue-200 transition hover:bg-blue-400/10">Đăng nhập</Link>
          </nav>
          <Link href="/login" className="rounded-full border border-blue-400/30 px-4 py-2 text-sm text-blue-200 md:hidden">Đăng nhập</Link>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="pointer-events-none absolute left-1/2 top-0 h-[34rem] w-[50rem] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[120px]" />
          <div className="relative mx-auto grid min-h-[42rem] max-w-6xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.2fr_.8fr] lg:py-28">
            <div>
              <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/5 px-4 py-2 text-xs font-medium uppercase tracking-[.2em] text-cyan-200">
                <span className="size-1.5 rounded-full bg-cyan-300" /> Public workspace
              </p>
              <h1 className="max-w-4xl text-5xl font-semibold leading-[.98] tracking-[-.055em] text-balance sm:text-7xl lg:text-8xl">
                {profile?.headline ?? settings?.tagline ?? "Ý tưởng tốt cần một nơi để lớn lên."}
              </h1>
              <p className="mt-7 max-w-2xl whitespace-pre-line text-base leading-8 text-slate-300 sm:text-lg">
                {profile?.bio ?? "Một không gian tập trung cho công việc, dự án và những điều đáng chia sẻ. Nội dung mới sẽ xuất hiện tại đây ngay khi được xuất bản từ CoffeeHub CMS."}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                {sections[0]?.ctaLabel && sections[0]?.ctaUrl ? <a href={sections[0].ctaUrl} className="rounded-full bg-blue-500 px-6 py-3 font-medium text-white transition hover:bg-blue-400">{sections[0].ctaLabel} <Arrow /></a> : null}
                <a href="#projects" className="rounded-full border border-white/15 px-6 py-3 font-medium text-slate-200 transition hover:bg-white/5">Khám phá nội dung</a>
              </div>
            </div>
            <div className="relative mx-auto aspect-square w-full max-w-sm">
              <div className="absolute inset-0 rotate-6 rounded-[2.5rem] border border-blue-300/20 bg-gradient-to-br from-blue-500/20 to-cyan-300/5" />
              <div className="absolute inset-5 -rotate-3 rounded-[2rem] border border-white/10 bg-[#09152b]/90 p-8 shadow-2xl shadow-blue-950/70">
                <div className="flex h-full flex-col justify-between">
                  <span className="text-xs uppercase tracking-[.25em] text-cyan-300">Now building</span>
                  <div><p className="text-3xl font-semibold tracking-tight">{profile?.displayName ?? siteName}</p><p className="mt-3 text-sm leading-6 text-slate-400">{projects.length ? `${projects.length} dự án đã xuất bản và đang sẵn sàng để khám phá.` : "Những dự án đầu tiên đang được chuẩn bị để xuất bản."}</p></div>
                  <span className="font-mono text-xs text-blue-300">published / live</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {failed ? <Notice title="Chưa thể tải nội dung" body="CoffeeHub đang giữ trang ở trạng thái an toàn. Vui lòng thử tải lại sau ít phút." /> : null}
        {!failed && !hasPublishedContent ? <Notice title="Không gian đang được chuẩn bị" body="Chưa có nội dung công khai. Quản trị viên có thể tạo nội dung trong CMS và chọn Published để nội dung xuất hiện tại đây." /> : null}

        {sections.length > 0 ? <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8"><div className="grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-2">{sections.map((section, index) => <article key={section.id} className="bg-[#081121] p-8 sm:p-10"><span className="font-mono text-xs text-blue-300">0{index + 1}</span><h2 className="mt-8 text-3xl font-semibold tracking-tight">{section.heading}</h2><p className="mt-4 whitespace-pre-line leading-7 text-slate-400">{section.body}</p>{section.ctaLabel && section.ctaUrl ? <a href={section.ctaUrl} className="mt-7 inline-flex gap-2 text-sm font-medium text-cyan-300">{section.ctaLabel} <Arrow /></a> : null}</article>)}</div></section> : null}

        <section id="projects" className="border-y border-white/10 bg-[#07101e]">
          <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
            <div className="flex items-end justify-between gap-6"><div><p className="text-xs uppercase tracking-[.22em] text-blue-300">Selected work</p><h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Dự án nổi bật</h2></div><span className="hidden font-mono text-xs text-slate-500 sm:block">{String(projects.length).padStart(2, "0")} published</span></div>
            {projects.length ? <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{projects.map((project) => <article key={project.id} className="group flex min-h-72 flex-col rounded-3xl border border-white/10 bg-white/[.025] p-7 transition hover:-translate-y-1 hover:border-blue-400/30"><div className="flex flex-wrap gap-2">{project.techStack.slice(0, 3).map((tech) => <span key={tech} className="rounded-full bg-blue-400/10 px-3 py-1 text-xs text-blue-200">{tech}</span>)}</div><div className="mt-auto"><h3 className="text-2xl font-semibold tracking-tight">{project.title}</h3><p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">{project.summary}</p>{project.liveUrl ? <a href={project.liveUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex gap-2 text-sm text-cyan-300">Xem dự án <Arrow /></a> : null}</div></article>)}</div> : <p className="mt-10 rounded-3xl border border-dashed border-white/15 p-8 text-slate-400">Chưa có dự án được xuất bản. Các dự án Published từ CMS sẽ tự động xuất hiện ở khu vực này.</p>}
          </div>
        </section>

        {faqs.length ? <section className="mx-auto max-w-4xl px-5 py-24 sm:px-8"><p className="text-center text-xs uppercase tracking-[.22em] text-blue-300">FAQ</p><h2 className="mt-4 text-center text-4xl font-semibold tracking-tight">Điều bạn có thể muốn biết</h2><div className="mt-12 divide-y divide-white/10 border-y border-white/10">{faqs.map((faq) => <details key={faq.id} className="group py-6"><summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium"><span>{faq.question}</span><span className="text-blue-300 transition group-open:rotate-45">+</span></summary><p className="max-w-3xl whitespace-pre-line pt-4 leading-7 text-slate-400">{faq.answer}</p></details>)}</div></section> : null}
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1fr_auto] md:items-end"><div><p className="text-lg font-semibold">{siteName}</p><p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">{settings?.footerText ?? "Nơi ý tưởng, dự án và hành trình được kết nối."}</p></div><div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">{[...social, ...footer].map((link) => <a key={link.id} href={link.url} target={link.openNewTab ? "_blank" : undefined} rel={link.openNewTab ? "noreferrer" : undefined} className="hover:text-white">{link.label}</a>)}</div></div>
      </footer>
    </div>
  );
}

function Notice({ title, body }: { title: string; body: string }) {
  return <section className="mx-auto max-w-6xl px-5 pt-10 sm:px-8" aria-live="polite"><div className="rounded-2xl border border-blue-300/20 bg-blue-400/5 p-5"><h2 className="font-medium text-blue-100">{title}</h2><p className="mt-1 text-sm leading-6 text-slate-400">{body}</p></div></section>;
}
