import { notFound } from "next/navigation";
import { updateManagedAction } from "@/features/site-settings/site-settings.actions";
import { ManagedForm } from "@/features/site-settings/components/managed-form";
import { getManagedItem } from "@/features/site-settings/site-settings.repository";
import { MANAGED_KINDS, type ManagedKind } from "@/features/site-settings/site-settings.schema";
const valid=(kind:string):kind is ManagedKind=>MANAGED_KINDS.some(item=>item===kind);
export default async function EditManagedPage({params,searchParams}:{params:Promise<{kind:string;itemId:string}>;searchParams:Promise<{error?:string}>}){const [{kind,itemId},query]=await Promise.all([params,searchParams]);if(!valid(kind))notFound();const item=await getManagedItem(kind,itemId);if(!item)notFound();return <main className="mx-auto max-w-4xl px-[var(--page-gutter)] py-10"><h1 className="text-3xl font-semibold">Sửa {kind === "link" ? "liên kết" : "FAQ"}</h1><ManagedForm kind={kind} item={item} action={updateManagedAction.bind(null,kind,itemId)} error={query.error}/></main>;}
