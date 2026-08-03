"use client";

import { Button } from "@/components/ui";
export function ArchiveStageButton({ action }: { action: () => void | Promise<void> }) { return <form action={action} onSubmit={(event) => { if (!window.confirm("Lưu trữ milestone này? Milestone có Task sẽ được giữ nguyên và không thể lưu trữ.")) event.preventDefault(); }}><Button type="submit" variant="danger" size="sm">Lưu trữ</Button></form>; }
