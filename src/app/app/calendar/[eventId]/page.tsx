import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Button } from "@/components/ui";
import {
  archiveEventAction,
  updateEventAction,
} from "@/features/calendar/event.actions";
import { EventForm } from "@/features/calendar/components/event-form";
import {
  getEvent,
  getEventRelations,
} from "@/features/calendar/event.repository";
import { requireUser } from "@/lib/supabase/auth";

export default async function EventDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const user = await requireUser();
  const [{ eventId }, query] = await Promise.all([params, searchParams]);
  const [event, relations] = await Promise.all([
    getEvent(user.id, eventId),
    getEventRelations(user.id),
  ]);
  if (!event) notFound();
  return (
    <div className="space-y-6">
      <Link
        href="/app/calendar"
        className="text-sm font-semibold text-primary-hover"
      >
        ← Calendar
      </Link>
      <header>
        <Badge variant="primary">Event detail</Badge>
        <h1 className="mt-4 text-3xl font-semibold">{event.title}</h1>
      </header>
      {query.saved ? (
        <p
          role="status"
          className="rounded-sm border border-success/30 bg-success/10 px-4 py-3 text-sm text-green-200"
        >
          Event đã được lưu.
        </p>
      ) : null}
      <EventForm
        action={updateEventAction.bind(null, event.id)}
        event={event}
        relations={relations}
        defaultTimezone={event.timezone}
        error={query.error}
      />
      <form action={archiveEventAction.bind(null, event.id)}>
        <Button type="submit" variant="secondary">
          Lưu trữ Event
        </Button>
      </form>
    </div>
  );
}
