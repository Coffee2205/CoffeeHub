"use client";
import { Button } from "@/components/ui";
export function DeleteMediaButton({
  action,
}: {
  action: () => void | Promise<void>;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm("Xóa ảnh này khỏi project và Storage?"))
          event.preventDefault();
      }}
    >
      <Button type="submit" variant="danger" size="sm">
        Xóa ảnh
      </Button>
    </form>
  );
}
