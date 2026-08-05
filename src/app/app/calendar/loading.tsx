export default function CalendarLoading() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Đang tải Calendar">
      <div className="h-10 w-52 animate-pulse rounded bg-background-tertiary" />
      <div className="h-80 animate-pulse rounded-lg bg-surface" />
      <div className="h-28 animate-pulse rounded-lg bg-surface" />
    </div>
  );
}
