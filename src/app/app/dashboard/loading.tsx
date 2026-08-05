import { LoadingState } from "@/components/ui";

export default function DashboardLoading() {
  return (
    <div className="space-y-5">
      <div className="h-24 animate-pulse rounded-lg bg-surface-subtle motion-reduce:animate-none" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {["today", "overdue", "goals", "events"].map((item) => (
          <div
            key={item}
            className="h-36 animate-pulse rounded-lg border border-border bg-surface motion-reduce:animate-none"
          />
        ))}
      </div>
      <LoadingState
        title="Đang tổng hợp Dashboard"
        description="CoffeeHub đang đọc Task, Goal và Event của bạn."
      />
    </div>
  );
}
