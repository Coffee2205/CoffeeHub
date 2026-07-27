import { notFound } from "next/navigation";
import { updateProjectAction } from "@/features/projects/project.actions";
import { ProjectForm } from "@/features/projects/components/project-form";
import { getProject } from "@/features/projects/project.repository";
export default async function EditProjectPage({ params, searchParams }: { params: Promise<{ projectId: string }>; searchParams: Promise<{ error?: string }> }) { const [{ projectId }, { error }] = await Promise.all([params, searchParams]); const project = await getProject(projectId); if (!project) notFound(); return <main className="mx-auto max-w-4xl px-[var(--page-gutter)] py-10"><h1 className="mb-6 text-3xl font-semibold">Sửa project</h1><ProjectForm project={project} action={updateProjectAction.bind(null, project.id)} error={error} /></main>; }
