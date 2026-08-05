import type { Metadata } from "next";
import Link from "next/link";

import { listPublicProjects } from "@/features/public-site/public-site.repository";
import {
  PageIntro,
  PublicNotice,
  PublicShell,
} from "@/features/public-site/public-shell";
import { isProjectOngoing } from "@/features/projects/project.schema";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Dự án | CoffeeHub",
  description: "Những dự án đã được xuất bản trên CoffeeHub.",
};

export default async function ProjectsPage() {
  let projects: Awaited<ReturnType<typeof listPublicProjects>> | null = null;
  try {
    projects = await listPublicProjects();
  } catch (error) {
    console.error("Unable to list public projects", error);
  }
  return (
    <PublicShell>
      <PageIntro
        eyebrow="Selected work"
        title="Dự án được xây dựng có chủ đích."
        description="Khám phá bối cảnh, vai trò, công nghệ và kết quả của từng dự án đã được xuất bản."
      />
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        {!projects ? (
          <PublicNotice
            title="Chưa thể tải dự án"
            body="CoffeeHub chưa kết nối được với CMS. Vui lòng thử lại sau."
          />
        ) : projects.length === 0 ? (
          <PublicNotice
            title="Chưa có dự án công khai"
            body="Dự án sẽ xuất hiện tại đây ngay khi quản trị viên chọn trạng thái Published."
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {projects.map((project, index) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group flex min-h-80 flex-col rounded-3xl border border-white/10 bg-[#081121] p-8 transition hover:-translate-y-1 hover:border-blue-400/30"
              >
                <span className="font-mono text-xs text-blue-300">
                  {isProjectOngoing(project.startedAt, project.endedAt)
                    ? "Đang thực hiện"
                    : String(index + 1).padStart(2, "0")}
                </span>
                <div className="mt-auto">
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-blue-400/10 px-3 py-1 text-xs text-blue-100"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <h2 className="mt-5 text-3xl font-semibold tracking-tight">
                    {project.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 leading-7 text-slate-400">
                    {project.summary}
                  </p>
                  <span className="mt-6 inline-flex text-sm text-cyan-300">
                    Xem case study →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PublicShell>
  );
}
