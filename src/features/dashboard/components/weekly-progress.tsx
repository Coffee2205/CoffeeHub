import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui";

type WeeklyProgressProps = {
  completed: number;
  total: number;
  percentage: number;
};

export function WeeklyProgress({
  completed,
  total,
  percentage,
}: WeeklyProgressProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Tiến độ tuần</CardTitle>
        <CardDescription>
          Task có hạn từ thứ Hai đến hết Chủ Nhật theo UTC.
        </CardDescription>
      </CardHeader>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-4xl font-semibold">{percentage}%</p>
          <p className="mt-2 text-sm text-muted">
            {total === 0
              ? "Chưa có Task được lên lịch tuần này."
              : `${completed}/${total} Task đã hoàn thành.`}
          </p>
        </div>
        <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-blue-200">
          Tuần hiện tại
        </span>
      </div>
      <div
        className="mt-5 h-2.5 overflow-hidden rounded-full bg-background-tertiary"
        role="progressbar"
        aria-label="Tiến độ Task tuần hiện tại"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-active to-accent-cyan"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </Card>
  );
}
