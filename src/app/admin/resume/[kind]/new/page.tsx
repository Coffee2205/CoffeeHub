import { notFound } from "next/navigation";
import { createResumeAction } from "@/features/resume/resume.actions";
import { ResumeForm } from "@/features/resume/components/resume-form";
import { RESUME_KINDS, type ResumeKind } from "@/features/resume/resume.schema";
const valid = (kind: string): kind is ResumeKind => RESUME_KINDS.some((item) => item === kind);
export default async function NewResumePage({ params, searchParams }: { params: Promise<{ kind: string }>; searchParams: Promise<{ error?: string }> }) { const [{ kind }, query] = await Promise.all([params, searchParams]); if (!valid(kind)) notFound(); return <main className="mx-auto max-w-4xl px-[var(--page-gutter)] py-10"><h1 className="text-3xl font-semibold">Thêm nội dung</h1><ResumeForm kind={kind} action={createResumeAction.bind(null, kind)} error={query.error} /></main>; }
