import type { Metadata } from "next";
import Image from "next/image";

import { getProfileAvatarUrl } from "@/features/profile/profile-avatar";
import { getPublicAbout } from "@/features/public-site/public-site.repository";
import { PageIntro, PublicNotice, PublicShell } from "@/features/public-site/public-shell";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Giới thiệu | CoffeeHub", description: "Hồ sơ, kinh nghiệm, kỹ năng và học vấn đã được xuất bản trên CoffeeHub." };

export default async function AboutPage() {
  let data: Awaited<ReturnType<typeof getPublicAbout>> | null = null;
  try { data = await getPublicAbout(); } catch (error) { console.error("Unable to load public about", error); }
  const profile = data?.profile;
  const avatarUrl = await getProfileAvatarUrl(profile?.avatarPath);

  return <PublicShell><PageIntro eyebrow="About" title={profile?.displayName ?? "Câu chuyện phía sau CoffeeHub"} description={profile?.headline ?? "Một hồ sơ công khai được xây dựng từ những nội dung đã chọn xuất bản."} /><div className="mx-auto max-w-6xl space-y-20 px-5 py-20 sm:px-8">{!data ? <PublicNotice title="Chưa thể tải hồ sơ" body="Kết nối dữ liệu hiện chưa sẵn sàng. Nội dung công khai sẽ trở lại khi CoffeeHub kết nối lại với CMS." /> : !profile && !data.experiences.length && !data.skills.length && !data.education.length ? <PublicNotice title="Hồ sơ đang được chuẩn bị" body="Các mục Profile, Experience, Skill và Education sẽ xuất hiện ở đây sau khi được chọn Published trong Admin." /> : <><section className="grid gap-8 lg:grid-cols-[.65fr_1.35fr]"><div><h2 className="text-xs uppercase tracking-[.22em] text-blue-300">Giới thiệu</h2>{avatarUrl ? <div className="relative mt-6 aspect-square max-w-xs overflow-hidden rounded-3xl border border-white/10"><Image src={avatarUrl} alt={profile?.avatarAlt ?? `Ảnh chân dung ${profile?.displayName ?? "CoffeeHub"}`} fill priority sizes="(max-width: 1024px) 320px, 28vw" className="object-cover" /></div> : <div className="mt-6 grid aspect-square max-w-xs place-items-center rounded-3xl border border-dashed border-white/15 bg-white/[.02] px-6 text-center text-sm text-slate-500">Avatar sẽ xuất hiện sau khi được tải từ Admin.</div>}</div><p className="whitespace-pre-line text-xl leading-9 text-slate-300">{profile?.bio ?? "Thông tin giới thiệu đang được cập nhật."}</p></section><ResumeSections data={data} /></>}</div></PublicShell>;
}

function ResumeSections({ data }: { data: NonNullable<Awaited<ReturnType<typeof getPublicAbout>>> }) {
  return <div className="grid gap-16 lg:grid-cols-2"><section><h2 className="text-3xl font-semibold tracking-tight">Kinh nghiệm</h2><div className="mt-8 space-y-5">{data.experiences.length ? data.experiences.map((item) => <article key={item.id} className="rounded-2xl border border-white/10 p-6"><p className="text-sm text-cyan-300">{item.organization}</p><h3 className="mt-2 text-xl font-semibold">{item.role}</h3><p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-400">{item.description}</p></article>) : <p className="text-slate-500">Chưa có kinh nghiệm được xuất bản.</p>}</div></section><div className="space-y-16"><section><h2 className="text-3xl font-semibold tracking-tight">Kỹ năng</h2><div className="mt-7 flex flex-wrap gap-2">{data.skills.length ? data.skills.map((skill) => <span key={skill.id} className="rounded-full border border-blue-300/20 bg-blue-400/5 px-4 py-2 text-sm text-blue-100">{skill.name}<span className="ml-2 text-slate-500">{skill.category}</span></span>) : <p className="text-slate-500">Chưa có kỹ năng được xuất bản.</p>}</div></section><section><h2 className="text-3xl font-semibold tracking-tight">Học vấn</h2><div className="mt-7 space-y-4">{data.education.length ? data.education.map((item) => <article key={item.id} className="border-l border-blue-400/40 pl-5"><h3 className="font-semibold">{item.degree}</h3><p className="mt-1 text-sm text-slate-400">{item.institution}{item.fieldOfStudy ? ` · ${item.fieldOfStudy}` : ""}</p></article>) : <p className="text-slate-500">Chưa có học vấn được xuất bản.</p>}</div></section></div></div>;
}
