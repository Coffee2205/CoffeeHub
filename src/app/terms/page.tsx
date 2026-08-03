import type { Metadata } from "next";
import { getPublicLegalPage } from "@/features/public-site/public-site.repository";
import { PageIntro, PublicNotice, PublicShell } from "@/features/public-site/public-shell";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Terms | CoffeeHub", description: "Điều khoản sử dụng website CV." };
export default async function TermsPage() {
  let data: Awaited<ReturnType<typeof getPublicLegalPage>> | null = null;
  try { data = await getPublicLegalPage("terms"); } catch (error) { console.error("Unable to load terms content", error); }
  return <PublicShell><PageIntro eyebrow="Legal" title="Terms" description="Điều khoản áp dụng khi truy cập website CV và portfolio." /><div className="mx-auto max-w-4xl space-y-8 px-5 py-20 sm:px-8">{!data ? <PublicNotice title="Chưa thể tải nội dung" body="Vui lòng thử lại sau." /> : data.sections.length ? data.sections.map((item) => <article key={item.id} className="rounded-3xl border border-white/10 p-7"><h2 className="text-2xl font-semibold">{item.heading}</h2><p className="mt-4 whitespace-pre-line leading-8 text-slate-300">{item.body}</p></article>) : <PublicNotice title="Terms đang được cập nhật" body="Owner chưa publish nội dung terms trong CMS." />}</div></PublicShell>;
}
