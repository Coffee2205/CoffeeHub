import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-primary-control bg-primary-control text-white shadow-[0_10px_30px_rgba(37,99,235,0.22)] hover:border-primary-control-hover hover:bg-primary-control-hover active:bg-primary-control-active",
  secondary:
    "border-border-strong bg-surface-strong text-foreground hover:border-primary-hover hover:bg-background-tertiary",
  ghost:
    "border-transparent bg-transparent text-foreground-secondary hover:bg-surface-subtle hover:text-foreground",
  danger:
    "border-error/40 bg-error/10 text-red-200 hover:border-error/70 hover:bg-error/20",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-10 px-3.5 text-sm",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-5 text-base",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-sm border font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-150 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45 active:translate-y-px",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
