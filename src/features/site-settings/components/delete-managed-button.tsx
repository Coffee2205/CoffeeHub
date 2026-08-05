"use client";
export function DeleteManagedButton({
  action,
}: {
  action: () => void | Promise<void>;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm("Xóa mục này?")) event.preventDefault();
      }}
    >
      <button className="min-h-10 rounded-sm border border-danger/50 px-3.5 text-sm font-semibold text-red-200">
        Xóa
      </button>
    </form>
  );
}
