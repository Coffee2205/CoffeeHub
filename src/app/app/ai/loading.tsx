export default function AILoading() {
  return (
    <div className="space-y-4" aria-busy="true">
      <div className="h-10 w-64 animate-pulse rounded bg-surface-strong" />
      <div className="h-96 animate-pulse rounded-lg border border-border bg-surface" />
    </div>
  );
}
