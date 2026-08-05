import Link from "next/link";
import { Badge } from "@/components/ui";
import { createEventAction } from "@/features/calendar/event.actions";
import { EventForm } from "@/features/calendar/components/event-form";
import { getEventRelations } from "@/features/calendar/event.repository";
import { getWorkspaceProfile } from "@/features/profile/workspace-profile.repository";
import { requireUser } from "@/lib/supabase/auth";

export default async function NewEventPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await requireUser();
  const [relations, profile, query] = await Promise.all([
    getEventRelations(user.id),
    getWorkspaceProfile(user.id),
    searchParams,
  ]);
  return (
    <div className="space-y-6">
      <Link
        href="/app/calendar"
        className="text-sm font-semibold text-primary-hover"
      >
        ← Calendar
      </Link>
      <header>
        <Badge variant="primary">Event mới</Badge>
        <h1 className="mt-4 text-3xl font-semibold">Tạo Event</h1>
      </header>
      <EventForm
        action={createEventAction}
        relations={relations}
        defaultTimezone={profile?.timezone ?? "UTC"}
        error={query.error}
      />
    </div>
  );
}
