import { createProjectAction } from "@/features/projects/project.actions";
import { ProjectForm } from "@/features/projects/components/project-form";
export default async function NewProjectPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) { const { error } = await searchParams; return <main className="mx-auto max-w-4xl px-[var(--page-gutter)] py-10"><h1 className="mb-6 text-3xl font-semibold">Project mới</h1><ProjectForm action={createProjectAction} error={error} /></main>; }
