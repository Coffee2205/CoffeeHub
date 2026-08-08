import Link from "next/link";
import { Badge } from "@/components/ui";
import { ChecklistForm } from "@/features/checklists/components/checklist-form";
import { createChecklistAction } from "@/features/checklists/checklist.actions";
import { getChecklistRelations } from "@/features/checklists/checklist.repository";
import { requireUser } from "@/lib/supabase/auth";

export default async function NewChecklistPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await requireUser();
  const [relations, query] = await Promise.all([
    getChecklistRelations(user.id),
    searchParams,
  ]);
  return (
    <div className="space-y-6">
      <Link
        href="/app/checklists"
        className="text-sm font-semibold text-primary-hover"
      >
        ← Checklists
      </Link>
      <header>
        <Badge variant="primary">Checklist mới</Badge>
        <h1 className="mt-4 text-3xl font-semibold">Tạo Checklist</h1>
      </header>
      <ChecklistForm
        action={createChecklistAction}
        relations={relations}
        error={query.error}
      />
    </div>
  );
}
