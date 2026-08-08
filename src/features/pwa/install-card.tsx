"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Button, Card } from "@/components/ui";
type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};
export function InstallCard() {
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const standalone = useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia("(display-mode: standalone)");
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(display-mode: standalone)").matches,
    () => false,
  );
  useEffect(() => {
    const capture = (event: Event) => {
      event.preventDefault();
      setPrompt(event as InstallPrompt);
    };
    window.addEventListener("beforeinstallprompt", capture);
    return () => window.removeEventListener("beforeinstallprompt", capture);
  }, []);
  async function install() {
    if (!prompt) return;
    await prompt.prompt();
    await prompt.userChoice;
    setPrompt(null);
  }
  return (
    <Card>
      <h2 className="text-xl font-semibold">Cài CoffeeHub</h2>
      <p className="mt-2 text-sm leading-6 text-foreground-secondary">
        {standalone
          ? "CoffeeHub đang chạy ở chế độ ứng dụng."
          : prompt
            ? "Trình duyệt đã sẵn sàng cài ứng dụng."
            : "Nếu nút cài chưa xuất hiện, dùng menu trình duyệt. Trên iPhone Safari: Chia sẻ → Thêm vào Màn hình chính."}
      </p>
      <div className="mt-4">
        <Button
          type="button"
          onClick={install}
          disabled={!prompt || standalone}
        >
          Cài ứng dụng
        </Button>
      </div>
    </Card>
  );
}
