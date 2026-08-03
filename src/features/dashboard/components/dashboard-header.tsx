import { Badge } from "@/components/ui";
import { getGreeting } from "@/features/dashboard/date-ranges";

type DashboardHeaderProps = { displayName: string | null; email?: string | null; now: Date };

export function DashboardHeader({ displayName, now }: DashboardHeaderProps) {
  return <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><Badge variant="primary">Tổng quan UTC</Badge><h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">{getGreeting(now)}, {displayName ?? "bạn"}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-foreground-secondary sm:text-base">Ưu tiên hôm nay, tiến độ tuần và lịch sắp tới của riêng bạn.</p></div><p className="font-mono text-xs text-muted">{new Intl.DateTimeFormat("vi-VN", { dateStyle: "full", timeZone: "UTC" }).format(now)}</p></header>;
}
