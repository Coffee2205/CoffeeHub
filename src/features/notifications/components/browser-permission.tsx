"use client";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui";
export function BrowserPermission() {
  const permission = useSyncExternalStore(
    (onChange) => {
      window.addEventListener("focus", onChange);
      return () => window.removeEventListener("focus", onChange);
    },
    () => ("Notification" in window ? Notification.permission : "unsupported"),
    () => "checking",
  );
  async function request() {
    if (!("Notification" in window)) return;
    await Notification.requestPermission();
    window.dispatchEvent(new Event("focus"));
  }
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm text-foreground-secondary">
        Quyền trình duyệt: <strong>{permission}</strong>
      </span>
      <Button
        type="button"
        size="sm"
        variant="secondary"
        onClick={request}
        disabled={permission === "unsupported" || permission === "granted"}
      >
        Yêu cầu quyền
      </Button>
    </div>
  );
}
