"use client";

import { useState } from "react";

import { logoutAction } from "@/app/login/actions";
import { clearNoteDrafts } from "@/features/sync/note-draft-store";

export function LogoutButton() {
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    try {
      await clearNoteDrafts();
    } finally {
      await logoutAction();
    }
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => void logout()}
      className="min-h-11 rounded-sm border border-border px-3 text-sm font-semibold text-foreground-secondary hover:border-primary-hover hover:text-foreground disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "Đang đăng xuất…" : "Đăng xuất"}
    </button>
  );
}
