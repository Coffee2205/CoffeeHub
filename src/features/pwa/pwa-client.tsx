"use client";

import { useEffect, useSyncExternalStore } from "react";

export function PwaClient() {
  const online = useSyncExternalStore(
    (onChange) => {
      window.addEventListener("online", onChange);
      window.addEventListener("offline", onChange);
      return () => {
        window.removeEventListener("online", onChange);
        window.removeEventListener("offline", onChange);
      };
    },
    () => navigator.onLine,
    () => true,
  );
  useEffect(() => {
    if ("serviceWorker" in navigator)
      void navigator.serviceWorker.register("/sw.js");
  }, []);
  return (
    <div
      aria-live="polite"
      className={
        online
          ? "sr-only"
          : "fixed inset-x-0 top-0 z-50 bg-warning px-3 py-2 text-center text-sm font-semibold text-background"
      }
    >
      {online
        ? "Đã kết nối"
        : "Đang ngoại tuyến — dữ liệu riêng tư không được cache"}
    </div>
  );
}
