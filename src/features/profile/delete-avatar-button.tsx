"use client";

import { Button } from "@/components/ui";

export function DeleteAvatarButton({
  action,
}: {
  action: () => void | Promise<void>;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm("Xóa avatar khỏi Profile và Storage?"))
          event.preventDefault();
      }}
    >
      <Button type="submit" variant="danger" size="sm">
        Xóa avatar
      </Button>
    </form>
  );
}
