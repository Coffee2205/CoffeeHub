import { Button, Input } from "@/components/ui";

export function ChecklistItemForm({
  action,
  error,
}: {
  action: (form: FormData) => void | Promise<void>;
  error?: string;
}) {
  return (
    <form
      action={action}
      className="grid gap-3 rounded-lg border border-border bg-surface p-4 sm:grid-cols-[1fr_auto]"
    >
      {error ? (
        <p
          role="alert"
          className="rounded-sm border border-error/40 bg-error/10 p-3 text-sm text-red-200 sm:col-span-2"
        >
          {error}
        </p>
      ) : null}
      <Input name="title" required maxLength={220} placeholder="Thêm item" />
      <Button type="submit">Thêm item</Button>
    </form>
  );
}
