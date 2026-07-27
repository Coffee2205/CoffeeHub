import { notFound } from "next/navigation";
import { updateResumeAction } from "@/features/resume/resume.actions";
import { ResumeForm } from "@/features/resume/components/resume-form";
import { getResumeItem } from "@/features/resume/resume.repository";
import { RESUME_KINDS, type ResumeKind } from "@/features/resume/resume.schema";
const valid = (kind: string): kind is ResumeKind => RESUME_KINDS.some((item) => item === kind);
export default async function EditResumePage({ params, searchParams }: { params: Promise<{ kind: string; itemId: string }>; searchParams: Promise<{ error?: string }> }) { const [{ kind, itemId }, query] = await Promise.all([params, searchParams]); if (!valid(kind)) notFound(); const item = await getResumeItem(kind, itemId); if (!item) notFound(); return <main className="mx-auto max-w-4xl px-[var(--page-gutter)] py-10"><h1 className="text-3xl font-semibold">Sửa nội dung</h1><ResumeForm kind={kind} item={item} action={updateResumeAction.bind(null, kind, itemId)} error={query.error} /></main>; }
