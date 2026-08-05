import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type SaveState =
  | "idle"
  | "saving"
  | "saved"
  | "failed"
  | "offline"
  | "syncing";

export interface SaveStatusProps extends HTMLAttributes<HTMLSpanElement> {
  state: SaveState;
}

const states: Record<SaveState, { label: string; tone: string; dot: string }> =
  {
    idle: { label: "Chưa thay đổi", tone: "text-muted", dot: "bg-muted" },
    saving: {
      label: "Đang lưu",
      tone: "text-info",
      dot: "bg-info animate-pulse",
    },
    saved: { label: "Đã lưu", tone: "text-success", dot: "bg-success" },
    failed: { label: "Lưu thất bại", tone: "text-error", dot: "bg-error" },
    offline: { label: "Ngoại tuyến", tone: "text-warning", dot: "bg-warning" },
    syncing: {
      label: "Đang đồng bộ",
      tone: "text-accent-cyan",
      dot: "bg-accent-cyan animate-pulse",
    },
  };

export function SaveStatus({ state, className, ...props }: SaveStatusProps) {
  const config = states[state];

  return (
    <span
      role="status"
      className={cn(
        "inline-flex min-h-7 items-center gap-2 text-xs font-medium",
        config.tone,
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", config.dot)}
      />
      {config.label}
    </span>
  );
}
