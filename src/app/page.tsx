import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { toCurrentUser } from "@/lib/auth/claims";
import { getProfileAvatarUrl } from "@/features/profile/profile-avatar";
import {
  getPublicHomeData,
  type PublicHomeData,
} from "@/features/public-site/public-site.repository";
import { getVerifiedClaims } from "@/lib/supabase/auth";
import { normalizeMultilineText } from "@/lib/text/normalize-multiline-text";

export const dynamic = "force-dynamic";

async function loadHome(): Promise<{
  data: PublicHomeData | null;
  failed: boolean;
}> {
  try {
    return { data: await getPublicHomeData(), failed: false };
  } catch (error) {
    console.error("Unable to load published public CV", error);
    return { data: null, failed: true };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await loadHome();
  const settings = data?.settings;
  const profile = data?.profile;
  const title =
    settings?.seoTitle ??
    (profile?.displayName
      ? `${profile.displayName} · ${profile.headline ?? "Portfolio"}`
      : "Portfolio");
  return {
    title,
    description:
      settings?.seoDescription ??
      profile?.bio?.slice(0, 180) ??
      "CV và portfolio chuyên nghiệp.",
    alternates: settings?.canonicalUrl
      ? { canonical: settings.canonicalUrl }
      : undefined,
  };
}

const formatPeriod = (start: Date | null, end: Date | null) => {
  const year = (value: Date) =>
    new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "short",
      timeZone: "UTC",
    }).format(value);
  return start
    ? `${year(start)} — ${end ? year(end) : "Hiện tại"}`
    : end
      ? year(end)
      : null;
};

export default async function Home() {
  const [{ data, failed }, claims] = await Promise.all([
    loadHome(),
    getVerifiedClaims(),
  ]);
  const owner = toCurrentUser(claims);
  const profile = data?.profile;
  const settings = data?.settings;
  const sections = data?.sections ?? [];
  const experiences = data?.experiences ?? [];
  const skills = data?.skills ?? [];
  const education = data?.education ?? [];
  const projects = data?.projects ?? [];
  const posts = data?.posts ?? [];
  const links = data?.links ?? [];
  const navigation = links.filter((link) => link.kind === "NAVIGATION");
  const social = links.filter((link) => link.kind === "SOCIAL");
  const footer = links.filter((link) => link.kind === "FOOTER");
  const section = (key: string) =>
    sections.find((item) => item.sectionKey === key);
  const about = section("about") ?? section("objective");
  const certifications = section("certifications");
  const activities = section("activities");
  const contact = section("contact");
  const reserved = new Set([
    "about",
    "objective",
    "certifications",
    "activities",
    "contact",
  ]);
  const extras = sections.filter((item) => !reserved.has(item.sectionKey));
  const skillGroups = Map.groupBy(skills, (skill) => skill.category);
  const avatarUrl = await getProfileAvatarUrl(profile?.avatarPath);
  const hasContent = Boolean(
    profile ||
      sections.length ||
      experiences.length ||
      skills.length ||
      education.length ||
      projects.length ||
      posts.length,
  );
  const displayName = profile?.displayName ?? "Hồ sơ đang được chuẩn bị";

  return (
    <div className="min-h-screen bg-[#050914] text-slate-50">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050914]/90 backdrop-blur-xl">
        <div className="mx-auto flex min-h-18 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link
            href="/"
            className="min-w-0 truncate font-semibold tracking-tight"
          >
            {profile?.displayName ?? "Portfolio"}
          </Link>
          <nav
            className="hidden items-center gap-6 text-sm text-slate-300 md:flex"
            aria-label="Điều hướng CV"
          >
            {navigation.length ? (
              navigation.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target={item.openNewTab ? "_blank" : undefined}
                  rel={item.openNewTab ? "noreferrer" : undefined}
                  className="hover:text-white"
                >
                  {item.label}
                </a>
              ))
            ) : (
              <>
                <a href="#about">About</a>
                <a href="#skills">Skills</a>
                <a href="#experience">Experience</a>
                <a href="#projects">Projects</a>
              </>
            )}
            {owner ? (
              <>
                <Link
                  href="/app/dashboard"
                  className="rounded-full border border-blue-400/30 px-4 py-2 text-blue-200"
                >
                  Dashboard
                </Link>
                {owner.isAdmin ? (
                  <Link
                    href="/admin"
                    className="rounded-full bg-blue-500 px-4 py-2 font-medium text-white"
                  >
                    Manage CV
                  </Link>
                ) : null}
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-full border border-white/15 px-4 py-2"
              >
                Owner login
              </Link>
            )}
          </nav>
          {owner ? (
            <Link
              href="/app/dashboard"
              className="rounded-full border border-blue-400/30 px-4 py-2 text-sm text-blue-200 md:hidden"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-white/15 px-4 py-2 text-sm md:hidden"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="pointer-events-none absolute left-1/2 top-0 h-[34rem] w-[52rem] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[120px]" />
          <div className="relative mx-auto grid min-h-[42rem] max-w-6xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.2fr_.8fr] lg:py-28">
            <div>
              <p className="text-xs font-medium uppercase tracking-[.24em] text-cyan-300">
                Curriculum vitae · Portfolio
              </p>
              <h1 className="mt-5 text-5xl font-semibold leading-[.96] tracking-[-.055em] text-balance sm:text-7xl lg:text-8xl">
                {displayName}
              </h1>
              <p className="mt-6 text-xl font-medium text-blue-200 sm:text-2xl">
                {profile?.headline ??
                  "Thông tin nghề nghiệp sẽ xuất hiện sau khi Profile được publish."}
              </p>
              {profile?.bio ? (
                <p className="mt-6 max-w-2xl whitespace-pre-line text-base leading-8 text-slate-300 sm:text-lg">
                  {profile.bio}
                </p>
              ) : null}
              <div className="mt-9 flex flex-wrap gap-3">
                {contact?.ctaLabel && contact.ctaUrl ? (
                  <a
                    href={contact.ctaUrl}
                    className="rounded-full bg-blue-500 px-6 py-3 font-medium text-white hover:bg-blue-400"
                  >
                    {contact.ctaLabel} ↗
                  </a>
                ) : null}
                <a
                  href="#projects"
                  className="rounded-full border border-white/15 px-6 py-3 font-medium hover:bg-white/5"
                >
                  Xem dự án
                </a>
                {owner ? (
                  <Link
                    href="/app/dashboard"
                    className="rounded-full border border-cyan-300/30 px-6 py-3 font-medium text-cyan-200"
                  >
                    Mở Dashboard
                  </Link>
                ) : null}
                {owner?.isAdmin ? (
                  <Link
                    href="/admin"
                    className="rounded-full bg-cyan-300 px-6 py-3 font-medium text-slate-950"
                  >
                    Quản lý CV
                  </Link>
                ) : null}
              </div>
            </div>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-blue-500/20 to-cyan-300/5 shadow-2xl shadow-blue-950/70">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={profile?.avatarAlt ?? `Ảnh chân dung ${displayName}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 384px, 32vw"
                  className="object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center px-8 text-center text-sm leading-6 text-slate-400">
                  Avatar được quản lý trong Admin và chỉ hiển thị khi Profile đã
                  publish.
                </div>
              )}
            </div>
          </div>
        </section>

        {failed ? (
          <Notice
            title="Chưa thể tải CV"
            body="Kết nối dữ liệu tạm thời không khả dụng. Vui lòng thử lại sau."
          />
        ) : null}
        {!failed && !hasContent ? (
          <Notice
            title="CV đang được chuẩn bị"
            body="Chưa có nội dung được publish. Owner có thể nhập Profile và các mục CV trong Admin/CMS."
            owner={Boolean(owner)}
          />
        ) : null}

        {about ? (
          <Section id="about" eyebrow="About / Objective" title={about.heading}>
            <p className="max-w-4xl whitespace-pre-line text-xl leading-9 text-slate-300">
              {about.body}
            </p>
          </Section>
        ) : null}
        {skills.length ? (
          <Section id="skills" eyebrow="Capabilities" title="Skills">
            <div className="grid gap-5 md:grid-cols-2">
              {[...skillGroups.entries()].map(([category, items]) => (
                <article
                  key={category}
                  className="rounded-3xl border border-white/10 bg-white/[.025] p-7"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-[.18em] text-blue-300">
                    {category}
                  </h3>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {items.map((item) => (
                      <span
                        key={item.id}
                        className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200"
                      >
                        {item.name}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </Section>
        ) : null}
        {experiences.length ? (
          <Section id="experience" eyebrow="Career" title="Work Experience">
            <div className="space-y-5">
              {experiences.map((item) => (
                <article
                  key={item.id}
                  className="grid gap-5 rounded-3xl border border-white/10 bg-[#081121] p-7 md:grid-cols-[14rem_1fr]"
                >
                  <div>
                    <p className="text-sm font-medium text-cyan-300">
                      {formatPeriod(item.startedAt, item.endedAt)}
                    </p>
                    {item.location ? (
                      <p className="mt-2 text-sm text-slate-500">
                        {item.location}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold">{item.role}</h3>
                    <p className="mt-2 text-blue-200">{item.organization}</p>
                    <p className="mt-5 whitespace-pre-line leading-7 text-slate-400">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </Section>
        ) : null}
        {projects.length ? (
          <Section
            id="projects"
            eyebrow="Selected work"
            title="Featured Projects"
          >
            <div className="grid gap-5 md:grid-cols-2">
              {projects.map((item) => (
                <Link
                  key={item.id}
                  href={`/projects/${item.slug}`}
                  className="group flex min-h-72 flex-col rounded-3xl border border-white/10 bg-white/[.025] p-7 transition hover:-translate-y-1 hover:border-blue-400/40"
                >
                  <p className="text-sm text-blue-300">
                    {item.role ??
                      formatPeriod(item.startedAt, item.endedAt) ??
                      "Case study"}
                  </p>
                  <div className="mt-auto">
                    <h3 className="text-2xl font-semibold">{item.title}</h3>
                    <p className="mt-3 line-clamp-3 leading-7 text-slate-400">
                      {item.summary}
                    </p>
                    <span className="mt-6 inline-flex text-sm font-medium text-cyan-300">
                      Xem chi tiết →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Section>
        ) : null}
        {education.length || certifications ? (
          <Section
            id="education"
            eyebrow="Learning"
            title="Education & Certifications"
          >
            <div className="grid gap-5 md:grid-cols-2">
              {education.map((item) => (
                <article
                  key={item.id}
                  className="rounded-3xl border border-white/10 p-7"
                >
                  <p className="text-sm text-cyan-300">
                    {formatPeriod(item.startedAt, item.endedAt)}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold">{item.degree}</h3>
                  <p className="mt-2 text-blue-200">{item.institution}</p>
                  {item.fieldOfStudy ? (
                    <p className="mt-2 text-sm text-slate-400">
                      {item.fieldOfStudy}
                    </p>
                  ) : null}
                  {item.description ? (
                    <p className="mt-4 whitespace-pre-line leading-7 text-slate-400">
                      {item.description}
                    </p>
                  ) : null}
                </article>
              ))}
              {certifications ? <ContentCard item={certifications} /> : null}
            </div>
          </Section>
        ) : null}
        {activities ? (
          <Section
            id="activities"
            eyebrow="Community"
            title={activities.heading}
          >
            <p className="max-w-4xl whitespace-pre-line leading-8 text-slate-300">
              {normalizeMultilineText(activities.body)}
            </p>
          </Section>
        ) : null}
        {extras.map((item) => (
          <Section
            key={item.id}
            id={item.sectionKey}
            eyebrow="Profile"
            title={item.heading}
          >
            <p className="max-w-4xl whitespace-pre-line leading-8 text-slate-300">
              {item.body}
            </p>
          </Section>
        ))}
        {posts.length ? (
          <Section id="posts" eyebrow="Writing" title="Latest Posts">
            <div className="grid gap-5 md:grid-cols-3">
              {posts.map((item) => (
                <Link
                  key={item.id}
                  href={`/posts/${item.slug}`}
                  className="rounded-3xl border border-white/10 p-6 hover:border-blue-400/40"
                >
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
                    {item.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </Section>
        ) : null}
        {contact || social.length ? (
          <Section
            id="contact"
            eyebrow="Contact"
            title={contact?.heading ?? "Let’s connect"}
          >
            <div className="grid gap-8 md:grid-cols-[1fr_auto]">
              <div>
                <p className="max-w-2xl whitespace-pre-line text-lg leading-8 text-slate-300">
                  {contact?.body ??
                    "Các kênh liên hệ đã được owner chọn công khai."}
                </p>
                {contact?.ctaLabel && contact.ctaUrl ? (
                  <a
                    href={contact.ctaUrl}
                    className="mt-6 inline-flex rounded-full bg-blue-500 px-6 py-3 font-medium"
                  >
                    {contact.ctaLabel}
                  </a>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-3">
                {social.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target={item.openNewTab ? "_blank" : undefined}
                    rel={item.openNewTab ? "noreferrer" : undefined}
                    className="rounded-full border border-white/15 px-5 py-3 text-sm hover:border-cyan-300/40"
                  >
                    {item.label} ↗
                  </a>
                ))}
              </div>
            </div>
          </Section>
        ) : null}
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-[1fr_auto]">
          <div>
            <p className="font-semibold">
              {profile?.displayName ?? "Portfolio"}
            </p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              {settings?.footerText ??
                settings?.privacyNote ??
                "Chỉ nội dung được publish qua CMS mới xuất hiện trên trang này."}
            </p>
          </div>
          <div className="flex flex-wrap gap-5 text-sm text-slate-400">
            {footer.map((item) => (
              <a key={item.id} href={item.url}>
                {item.label}
              </a>
            ))}
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-b border-white/10">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <p className="text-xs font-medium uppercase tracking-[.22em] text-blue-300">
          {eyebrow}
        </p>
        <h2 className="mt-4 mb-10 text-4xl font-semibold tracking-[-.04em] sm:text-5xl">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}
function ContentCard({ item }: { item: PublicHomeData["sections"][number] }) {
  return (
    <article className="rounded-3xl border border-white/10 p-7">
      <h3 className="text-xl font-semibold">{item.heading}</h3>
      <p className="mt-4 whitespace-pre-line leading-7 text-slate-400">
        {item.body}
      </p>
      {item.ctaLabel && item.ctaUrl ? (
        <a
          href={item.ctaUrl}
          className="mt-5 inline-flex text-sm text-cyan-300"
        >
          {item.ctaLabel} ↗
        </a>
      ) : null}
    </article>
  );
}
function Notice({
  title,
  body,
  owner = false,
}: {
  title: string;
  body: string;
  owner?: boolean;
}) {
  return (
    <section
      className="mx-auto max-w-6xl px-5 py-16 sm:px-8"
      aria-live="polite"
    >
      <div className="rounded-3xl border border-dashed border-blue-300/20 bg-blue-400/5 p-8">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-3 max-w-2xl leading-7 text-slate-400">{body}</p>
        {owner ? (
          <Link
            href="/admin"
            className="mt-6 inline-flex rounded-full bg-blue-500 px-5 py-3 text-sm font-semibold"
          >
            Manage CV
          </Link>
        ) : null}
      </div>
    </section>
  );
}
