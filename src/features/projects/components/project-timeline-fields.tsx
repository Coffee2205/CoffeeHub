"use client";

import { useState } from "react";

import { Input } from "@/components/ui";

export function ProjectTimelineFields({
  startedAt,
  endedAt,
}: {
  startedAt: string;
  endedAt: string;
}) {
  const [ongoing, setOngoing] = useState(Boolean(startedAt && !endedAt));

  return (
    <>
      <label className="grid gap-2">
        <span className="text-sm font-medium">Ngày bắt đầu</span>
        <Input
          name="startedAt"
          type="date"
          defaultValue={startedAt}
          required={ongoing}
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-medium">Ngày kết thúc</span>
        <Input
          name="endedAt"
          type="date"
          defaultValue={ongoing ? "" : endedAt}
          disabled={ongoing}
        />
      </label>
      <label className="flex min-h-11 items-start gap-3 rounded-sm border border-border bg-background-secondary p-3 md:col-span-2">
        <input
          name="ongoing"
          type="checkbox"
          checked={ongoing}
          onChange={(event) => setOngoing(event.target.checked)}
          className="mt-0.5 size-5 accent-blue-500"
        />
        <span>
          <span className="block text-sm font-medium">Đang thực hiện</span>
          <span className="mt-1 block text-xs leading-5 text-muted">
            Bật tùy chọn này để bỏ ngày kết thúc và hiển thị dự án là đang tiếp
            tục.
          </span>
        </span>
      </label>
    </>
  );
}
