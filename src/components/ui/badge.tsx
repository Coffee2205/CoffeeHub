import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type BadgeVariant = "neutral" | "primary" | "success" | "warning" | "error";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
  neutral: "border-border bg-surface-subtle text-foreground-secondary",
  primary: "border-primary/30 bg-primary/12 text-blue-200",
  success: "border-success/30 bg-success/10 text-green-200",
  warning: "border-warning/30 bg-warning/10 text-amber-200",
  error: "border-error/30 bg-error/10 text-red-200",
};

export function Badge({
  className,
  variant = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
