"use client";

import { Button, ErrorState } from "@/components/ui";

export default function WorkspaceError({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <ErrorState title="Không thể mở workspace" description="Đã có lỗi khi tải khu vực làm việc. Vui lòng thử lại." action={<Button variant="secondary" onClick={reset}>Thử lại</Button>} />; }
