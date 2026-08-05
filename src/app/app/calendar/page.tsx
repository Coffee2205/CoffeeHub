import Link from "next/link";
import { Badge, Card, EmptyState } from "@/components/ui";
import { listEvents } from "@/features/calendar/event.repository";
import { getWorkspaceProfile } from "@/features/profile/workspace-profile.repository";
import { requireUser } from "@/lib/supabase/auth";

const recurrenceLabels = {
  NONE: "",
  DAILY: "Lặp hằng ngày",
  WEEKLY: "Lặp hằng tuần",
  MONTHLY: "Lặp hằng tháng",
};

function currentMonth(timezone: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
  }).format(new Date());
}

function parseMonth(value: string | undefined, fallback: string) {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(value ?? "") ? value! : fallback;
}

function shiftMonth(month: string, amount: number) {
  const [year, index] = month.split("-").map(Number);
  return new Date(Date.UTC(year, index - 1 + amount, 1))
    .toISOString()
    .slice(0, 7);
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; archived?: string }>;
}) {
  const user = await requireUser();
  const [query, profile] = await Promise.all([
    searchParams,
    getWorkspaceProfile(user.id),
  ]);
  const timezone = profile?.timezone ?? "UTC";
  const month = parseMonth(query.month, currentMonth(timezone));
  const [year, monthNumber] = month.split("-").map(Number);
  const firstDay = new Date(Date.UTC(year, monthNumber - 1, 1));
  const nextMonth = new Date(Date.UTC(year, monthNumber, 1));
  const events = await listEvents(
    user.id,
    new Date(firstDay.valueOf() - 86_400_000),
    new Date(nextMonth.valueOf() + 86_400_000),
  );
  const dateKey = (date: Date) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  const visibleEvents = events.filter((event) =>
    dateKey(event.startsAt).startsWith(month),
  );
  const eventsByDay = new Map<string, typeof visibleEvents>();
  for (const event of visibleEvents) {
    const key = dateKey(event.startsAt);
    eventsByDay.set(key, [...(eventsByDay.get(key) ?? []), event]);
  }
  const leading = (firstDay.getUTCDay() + 6) % 7;
  const daysInMonth = Math.round(
    (nextMonth.valueOf() - firstDay.valueOf()) / 86_400_000,
  );
  const cells = Array.from({ length: leading + daysInMonth }, (_, index) =>
    index < leading ? null : index - leading + 1,
  );
  const monthLabel = new Intl.DateTimeFormat("vi-VN", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(firstDay);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="primary">Workspace</Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            Calendar
          </h1>
          <p className="mt-2 text-foreground-secondary">
            Lịch và agenda theo múi giờ {timezone}.
          </p>
        </div>
        <Link
          href="/app/calendar/new"
          className="inline-flex min-h-11 items-center justify-center rounded-sm bg-primary-control px-4 text-sm font-semibold text-white hover:bg-primary-control-hover"
        >
          Tạo Event
        </Link>
      </header>
      {query.archived ? (
        <p
          role="status"
          className="rounded-sm border border-success/30 bg-success/10 px-4 py-3 text-sm text-green-200"
        >
          Event đã được lưu trữ.
        </p>
      ) : null}
      <section className="rounded-lg border border-border bg-surface p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Link
            href={`/app/calendar?month=${shiftMonth(month, -1)}`}
            className="inline-flex min-h-11 items-center rounded-sm border border-border px-3 text-sm font-semibold hover:border-primary"
            aria-label="Tháng trước"
          >
            ←
          </Link>
          <h2 className="text-lg font-semibold capitalize">{monthLabel}</h2>
          <Link
            href={`/app/calendar?month=${shiftMonth(month, 1)}`}
            className="inline-flex min-h-11 items-center rounded-sm border border-border px-3 text-sm font-semibold hover:border-primary"
            aria-label="Tháng sau"
          >
            →
          </Link>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted">
          {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
            <span key={day} className="py-2">
              {day}
            </span>
          ))}
          {cells.map((day, index) => {
            const key = day ? `${month}-${String(day).padStart(2, "0")}` : "";
            const count = day ? (eventsByDay.get(key)?.length ?? 0) : 0;
            return (
              <div
                key={`${index}-${day ?? "blank"}`}
                className={`min-h-14 rounded-sm border p-1.5 text-left sm:min-h-20 sm:p-2 ${day ? "border-border bg-background-secondary" : "border-transparent"}`}
              >
                {day ? (
                  <>
                    <span className="text-sm font-medium">{day}</span>
                    {count ? (
                      <span className="mt-1 block rounded-full bg-primary/15 px-1.5 py-0.5 text-center text-[10px] text-blue-200 sm:text-xs">
                        {count} event
                      </span>
                    ) : null}
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Agenda tháng</h2>
        {visibleEvents.length === 0 ? (
          <EmptyState
            title="Tháng này chưa có Event"
            description="Tạo Event đầu tiên để bắt đầu sắp xếp lịch cá nhân."
            action={
              <Link
                href="/app/calendar/new"
                className="inline-flex min-h-11 items-center rounded-sm bg-primary-control px-4 text-sm font-semibold text-white"
              >
                Tạo Event đầu tiên
              </Link>
            }
          />
        ) : (
          visibleEvents.map((event) => (
            <Card
              key={event.id}
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <div className="min-w-28">
                <p className="font-semibold text-blue-200">
                  {event.startsAt.toLocaleDateString("vi-VN", {
                    timeZone: event.timezone,
                    weekday: "short",
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </p>
                <p className="text-sm text-muted">
                  {event.startsAt.toLocaleTimeString("vi-VN", {
                    timeZone: event.timezone,
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <Link
                href={`/app/calendar/${event.id}`}
                className="min-w-0 flex-1"
              >
                <h3 className="font-semibold">{event.title}</h3>
                <p className="mt-1 text-sm text-muted">
                  {[
                    event.goal?.title,
                    event.task?.title,
                    recurrenceLabels[event.recurrence],
                  ]
                    .filter(Boolean)
                    .join(" · ") || "Event độc lập"}
                </p>
              </Link>
              <Badge>{event.timezone}</Badge>
            </Card>
          ))
        )}
      </section>
    </div>
  );
}
