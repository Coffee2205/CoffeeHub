"use client";

import { Button } from "@/components/ui";

export function ArchiveGoalButton({
  action,
}: {
  action: () => void | Promise<void>;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (
          !window.confirm(
            "Lưu trữ Goal này? Goal sẽ biến mất khỏi danh sách nhưng dữ liệu liên quan không bị xóa.",
          )
        )
          event.preventDefault();
      }}
    >
      <Button type="submit" variant="danger">
        Lưu trữ Goal
      </Button>
    </form>
  );
}
