"use client";
import { Button } from "@/components/ui";
export function DeleteProjectButton({ action }: { action: () => void | Promise<void> }) { return <form action={action} onSubmit={(event) => { if (!window.confirm("Xóa mềm project này?")) event.preventDefault(); }}><Button type="submit" variant="danger" size="sm">Xóa</Button></form>; }
