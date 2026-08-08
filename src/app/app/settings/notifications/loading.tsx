export default function Loading() {
  return (
    <div className="space-y-4" aria-busy="true">
      <div className="h-10 w-72 animate-pulse rounded bg-surface-subtle" />
      <div className="h-64 animate-pulse rounded-lg bg-surface-subtle" />
    </div>
  );
}
