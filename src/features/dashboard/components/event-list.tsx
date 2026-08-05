import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
} from "@/components/ui";
import { formatUtcDateTime } from "@/features/dashboard/formatters";
import type { DashboardEvent } from "@/features/dashboard/dashboard.types";

export function EventList({ events }: { events: DashboardEvent[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event sắp tới</CardTitle>
        <CardDescription>Các Event bắt đầu trong 7 ngày tới.</CardDescription>
      </CardHeader>
      {events.length === 0 ? (
        <EmptyState
          className="min-h-44"
          title="Không có Event sắp tới"
          description="Lịch 7 ngày tới hiện đang trống."
        />
      ) : (
        <ol className="space-y-3">
          {events.map((event) => (
            <li
              key={event.id}
              className="rounded-md border border-border bg-surface-subtle p-3"
            >
              <p className="text-sm font-medium">{event.title}</p>
              <time
                className="mt-1 block font-mono text-xs text-muted"
                dateTime={event.startsAt.toISOString()}
              >
                {formatUtcDateTime(event.startsAt)} UTC · múi giờ Event:{" "}
                {event.timezone}
              </time>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
