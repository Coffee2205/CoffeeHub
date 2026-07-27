import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export function Textarea({ className, invalid, ...props }: TextareaProps) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={cn(
        "min-h-28 w-full resize-y rounded-sm border border-border bg-background-secondary/80 px-3.5 py-3 text-sm leading-6 text-foreground shadow-inner shadow-black/10 transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-muted focus-visible:border-primary-hover focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-error aria-invalid:ring-error/20",
        className,
      )}
      {...props}
    />
  );
}
