export default function ChecklistsLoading() {
  return (
    <div
      className="space-y-5"
      aria-busy="true"
      aria-label="Đang tải Checklists"
    >
      <div className="h-8 w-44 animate-pulse rounded bg-surface-subtle" />
      <div className="h-12 w-full animate-pulse rounded bg-surface-subtle" />
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-lg bg-surface-subtle"
          />
        ))}
      </div>
    </div>
  );
}
