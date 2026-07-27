import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface StateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

function StateFrame({
  icon,
  title,
  description,
  action,
  className,
}: StateProps & { icon: ReactNode }) {
  return (
    <div
      className={cn(
        "flex min-h-44 flex-col items-center justify-center rounded-md border border-dashed border-border bg-surface-subtle px-5 py-8 text-center",
        className,
      )}
    >
      {icon}
      {title ? <h3 className="mt-4 text-sm font-semibold text-foreground">{title}</h3> : null}
      {description ? <p className="mt-1 max-w-sm text-sm leading-6 text-muted">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function LoadingState({
  title = "Đang tải dữ liệu",
  description = "CoffeeHub đang chuẩn bị nội dung cho bạn.",
  className,
}: Omit<StateProps, "action">) {
  return (
    <StateFrame
      title={title}
      description={description}
      className={className}
      icon={
        <span
          aria-hidden="true"
          className="size-8 animate-spin rounded-full border-2 border-border border-t-primary-hover motion-reduce:animate-none"
        />
      }
    />
  );
}

export function EmptyState({
  title = "Chưa có nội dung",
  description = "Nội dung mới sẽ xuất hiện tại đây khi bạn bắt đầu.",
  action,
  className,
}: StateProps) {
  return (
    <StateFrame
      title={title}
      description={description}
      action={action}
      className={className}
      icon={
        <span className="grid size-9 place-items-center rounded-sm border border-primary/25 bg-primary/10 text-lg text-blue-200" aria-hidden="true">
          +
        </span>
      }
    />
  );
}

export function ErrorState({
  title = "Không thể tải nội dung",
  description = "Đã có lỗi xảy ra. Vui lòng thử lại sau ít phút.",
  action,
  className,
}: StateProps) {
  return (
    <StateFrame
      title={title}
      description={description}
      action={action}
      className={className}
      icon={
        <span className="grid size-9 place-items-center rounded-full border border-error/30 bg-error/10 font-semibold text-error" aria-hidden="true">
          !
        </span>
      }
    />
  );
}
