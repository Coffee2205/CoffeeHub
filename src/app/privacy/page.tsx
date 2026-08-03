import type { Metadata } from "next";
import { getPublicLegalPage } from "@/features/public-site/public-site.repository";
import { PageIntro, PublicNotice, PublicShell } from "@/features/public-site/public-shell";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Privacy | CoffeeHub", description: "Thông tin quyền riêng tư của website CV." };
export default async function PrivacyPage() {
  let data: Awaited<ReturnType<typeof getPublicLegalPage>> | null = null;
  try { data = await getPublicLegalPage("privacy"); } catch (error) { console.error("Unable to load privacy content", error); }
  const content = data?.sections.length ? data.sections : data?.settings?.privacyNote ? [{ id: "privacy-note", heading: "Privacy", body: data.settings.privacyNote }] : [];
  return <PublicShell><PageIntro eyebrow="Legal" title="Privacy" description="Những thông tin được công khai và cách dữ liệu được sử dụng trên website CV." /><div className="mx-auto max-w-4xl space-y-8 px-5 py-20 sm:px-8">{!data ? <PublicNotice title="Chưa thể tải nội dung" body="Vui lòng thử lại sau." /> : content.length ? content.map((item) => <article key={item.id} className="rounded-3xl border border-white/10 p-7"><h2 className="text-2xl font-semibold">{item.heading}</h2><p className="mt-4 whitespace-pre-line leading-8 text-slate-300">{item.body}</p></article>) : <PublicNotice title="Privacy đang được cập nhật" body="Owner chưa publish nội dung privacy trong CMS." />}</div></PublicShell>;
}
