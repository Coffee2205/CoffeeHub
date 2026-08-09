"use client";

import { useState, useTransition } from "react";
import { Button, Card, Input } from "@/components/ui";
import { clearAIHistoryAction, saveAISettingsAction } from "./chat.actions";
import type { AISettingsView } from "./chat.types";

export function AISettingsForm({ settings }: { settings: AISettingsView }) {
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card>
        <h2 className="text-lg font-semibold">AI và context</h2>
        <form
          action={(form) =>
            startTransition(async () => {
              await saveAISettingsAction(form);
              setMessage("Đã lưu AI settings.");
            })
          }
          className="mt-4 grid gap-4"
        >
          <Toggle
            name="enabled"
            label="Bật AI"
            defaultChecked={settings.enabled}
          />
          <Toggle
            name="historyEnabled"
            label="Lưu lịch sử hội thoại"
            defaultChecked={settings.historyEnabled}
          />
          <Toggle
            name="includeGoals"
            label="Cho phép Goal context (tối đa 10)"
            defaultChecked={settings.includeGoals}
          />
          <Toggle
            name="includeTasks"
            label="Cho phép Task context (tối đa 10)"
            defaultChecked={settings.includeTasks}
          />
          <Toggle
            name="includeNotes"
            label="Cho phép Note context (tối đa 5 excerpt, 200 ký tự)"
            defaultChecked={settings.includeNotes}
          />
          <label className="grid gap-2 text-sm">
            <span>Retention (1–365 ngày)</span>
            <Input
              name="retentionDays"
              type="number"
              min={1}
              max={365}
              defaultValue={settings.retentionDays}
            />
          </label>
          <Button type="submit" disabled={pending}>
            Lưu settings
          </Button>
        </form>
        {message ? (
          <p role="status" className="mt-3 text-sm text-emerald-200">
            {message}
          </p>
        ) : null}
      </Card>
      <Card>
        <h2 className="text-lg font-semibold">Xóa lịch sử riêng</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Đây là luồng Settings riêng, không phải lệnh chatbot. Proposal và
          audit nghiệp vụ không bị xóa.
        </p>
        <form
          action={(form) =>
            startTransition(async () =>
              setMessage(
                (await clearAIHistoryAction(form))
                  ? "Đã xóa toàn bộ conversation/message."
                  : "Chuỗi xác nhận chưa đúng.",
              ),
            )
          }
          className="mt-4 grid gap-3"
        >
          <label className="grid gap-2 text-sm">
            <span>Nhập XOA LICH SU để xác nhận</span>
            <Input name="confirmation" autoComplete="off" />
          </label>
          <Button type="submit" disabled={pending}>
            Xóa lịch sử chat
          </Button>
        </form>
      </Card>
    </div>
  );
}

function Toggle({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex min-h-11 items-center gap-3 rounded-sm border border-border px-3 text-sm">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} />
      {label}
    </label>
  );
}
