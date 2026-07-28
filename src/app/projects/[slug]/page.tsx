import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPublicProject } from "@/features/public-site/public-site.repository";
import { PublicShell } from "@/features/public-site/public-shell";

type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; try { const project = await getPublicProject(slug); return project ? { title: `${project.title} | CoffeeHub`, description: project.summary } : { title: "Dự án | CoffeeHub" }; } catch { return { title: "Dự án | CoffeeHub" }; } }

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  let project: Awaited<ReturnType<typeof getPublicProject>> | undefined;
  try { project = await getPublicProject(slug); } catch (error) { console.error("Unable to load public project", error); }
  if (project === null) notFound();
  if (!project) return <PublicShell><div className="mx-auto max-w-4xl px-5 py-28 sm:px-8"><h1 className="text-4xl font-semibold">Chưa thể tải dự án</h1><p className="mt-4 text-slate-400">Kết nối CMS hiện chưa sẵn sàng. Vui lòng thử lại sau.</p></div></PublicShell>;
  return <PublicShell><article className="mx-auto max-w-4xl px-5 py-20 sm:px-8 sm:py-28"><Link href="/projects" className="text-sm text-cyan-300">← Tất cả dự án</Link><p className="mt-12 text-xs uppercase tracking-[.22em] text-blue-300">{project.role ?? "Project case study"}</p><h1 className="mt-5 text-5xl font-semibold tracking-[-.05em] text-balance sm:text-7xl">{project.title}</h1><p className="mt-7 text-xl leading-9 text-slate-300">{project.summary}</p><div className="mt-10 flex flex-wrap gap-2">{project.techStack.map((tech) => <span key={tech} className="rounded-full border border-blue-300/20 px-4 py-2 text-sm text-blue-100">{tech}</span>)}</div><div className="mt-16 whitespace-pre-line border-t border-white/10 pt-12 text-base leading-8 text-slate-300">{project.description}</div><div className="mt-12 flex flex-wrap gap-3">{project.liveUrl ? <a href={project.liveUrl} target="_blank" rel="noreferrer" className="rounded-full bg-blue-500 px-6 py-3 font-medium">Mở sản phẩm ↗</a> : null}{project.githubUrl ? <a href={project.githubUrl} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-6 py-3 font-medium">Xem mã nguồn ↗</a> : null}</div></article></PublicShell>;
}
