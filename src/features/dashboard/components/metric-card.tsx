import { Card } from "@/components/ui";

type MetricCardProps = { label: string; value: number; hint: string; tone?: "default" | "warning" };

export function MetricCard({ label, value, hint, tone = "default" }: MetricCardProps) {
  return <Card className="min-h-36"><p className="text-sm font-medium text-muted">{label}</p><p className={tone === "warning" ? "mt-3 font-mono text-3xl font-semibold text-warning" : "mt-3 font-mono text-3xl font-semibold text-foreground"}>{value}</p><p className="mt-2 text-xs leading-5 text-muted">{hint}</p></Card>;
}
