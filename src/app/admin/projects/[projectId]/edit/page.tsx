import { notFound } from "next/navigation";
import { updateProjectAction } from "@/features/projects/project.actions";
import { ProjectForm } from "@/features/projects/components/project-form";
import { ProjectMediaManager } from "@/features/projects/components/project-media-manager";
import { getProject } from "@/features/projects/project.repository";
export default async function EditProjectPage({ params, searchParams }: { params: Promise<{ projectId: string }>; searchParams: Promise<{ error?: string; mediaError?: string; mediaSaved?: string }> }) { const [{ projectId }, query] = await Promise.all([params, searchParams]); const project = await getProject(projectId); if (!project) notFound(); return <main className="mx-auto max-w-4xl px-[var(--page-gutter)] py-10"><h1 className="mb-6 text-3xl font-semibold">Sửa project</h1><ProjectForm project={project} action={updateProjectAction.bind(null, project.id)} error={query.error} /><ProjectMediaManager projectId={project.id} media={project.media} error={query.mediaError} saved={Boolean(query.mediaSaved)} /></main>; }
