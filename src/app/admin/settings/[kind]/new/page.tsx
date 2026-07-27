import { notFound } from "next/navigation";
import { createManagedAction } from "@/features/site-settings/site-settings.actions";
import { ManagedForm } from "@/features/site-settings/components/managed-form";
import { MANAGED_KINDS, type ManagedKind } from "@/features/site-settings/site-settings.schema";
const valid=(kind:string):kind is ManagedKind=>MANAGED_KINDS.some(item=>item===kind);
export default async function NewManagedPage({params,searchParams}:{params:Promise<{kind:string}>;searchParams:Promise<{error?:string}>}){const [{kind},query]=await Promise.all([params,searchParams]);if(!valid(kind))notFound();return <main className="mx-auto max-w-4xl px-[var(--page-gutter)] py-10"><h1 className="text-3xl font-semibold">Thêm {kind === "link" ? "liên kết" : "FAQ"}</h1><ManagedForm kind={kind} action={createManagedAction.bind(null,kind)} error={query.error}/></main>;}
