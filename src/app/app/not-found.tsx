import Link from "next/link";
import { EmptyState } from "@/components/ui";

export default function WorkspaceNotFound() {
  return (
    <EmptyState
      title="Không tìm thấy nội dung"
      description="Route này chưa tồn tại hoặc bạn không có quyền truy cập."
      action={
        <Link
          href="/app/dashboard"
          className="inline-flex min-h-11 items-center rounded-sm border border-border-strong bg-surface-strong px-4 text-sm font-semibold hover:border-primary-hover"
        >
          Về Dashboard
        </Link>
      }
    />
  );
}
