"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Button, Card, Input, Textarea } from "@/components/ui";
import {
  archiveConversationAction,
  loadConversationAction,
  renameConversationAction,
  sendChatAction,
} from "./chat.actions";
import type {
  AISettingsView,
  ChatMessageView,
  ConversationView,
} from "./chat.types";

export function PersonalAssistantShell({
  initialConversations,
  initialMessages,
  initialConversationId,
  settings,
}: {
  initialConversations: ConversationView[];
  initialMessages: ChatMessageView[];
  initialConversationId?: string;
  settings: AISettingsView;
}) {
  const [conversations, setConversations] = useState(initialConversations);
  const [conversationId, setConversationId] = useState(initialConversationId);
  const [messages, setMessages] = useState(initialMessages);
  const [status, setStatus] = useState<
    "idle" | "pending" | "streaming" | "error"
  >("idle");
  const [error, setError] = useState("");
  const [context, setContext] = useState<string[]>([]);
  const [pending, startTransition] = useTransition();
  const streamId = useRef(0);

  const selectConversation = (id: string) =>
    startTransition(async () => {
      setMessages(await loadConversationAction(id));
      setConversationId(id);
      setStatus("idle");
    });

  const submit = (form: FormData) => {
    const prompt = String(form.get("prompt") ?? "").trim();
    if (!prompt) return;
    const userMessage: ChatMessageView = {
      id: crypto.randomUUID(),
      role: "USER",
      content: prompt,
      createdAt: new Date().toISOString(),
    };
    setMessages((current) => [...current, userMessage]);
    setStatus("pending");
    setError("");
    if (conversationId) form.set("conversationId", conversationId);
    startTransition(async () => {
      const result = await sendChatAction(form);
      if (result.status === "error" || !result.message) {
        setStatus("error");
        setError(result.error ?? "Không thể phản hồi.");
        return;
      }
      if (result.conversationId && !conversationId) {
        setConversationId(result.conversationId);
        setConversations((current) => [
          {
            id: result.conversationId!,
            title: prompt.slice(0, 80),
            updatedAt: new Date().toISOString(),
          },
          ...current,
        ]);
      }
      setContext(result.contextSummary ?? []);
      streamAssistantMessage(result.message);
    });
  };

  const streamAssistantMessage = (message: ChatMessageView) => {
    const token = ++streamId.current;
    const words = message.content.split(" ");
    let index = 0;
    setStatus("streaming");
    setMessages((current) => [...current, { ...message, content: "" }]);
    const timer = window.setInterval(() => {
      if (token !== streamId.current) return window.clearInterval(timer);
      index += 1;
      setMessages((current) =>
        current.map((item) =>
          item.id === message.id
            ? { ...item, content: words.slice(0, index).join(" ") }
            : item,
        ),
      );
      if (index >= words.length) {
        window.clearInterval(timer);
        setStatus("idle");
      }
    }, 24);
  };

  const cancelStreaming = () => {
    streamId.current += 1;
    setStatus("idle");
  };

  useEffect(() => () => void (streamId.current += 1), []);

  return (
    <div className="grid gap-5 xl:grid-cols-[18rem_minmax(0,1fr)]">
      <Card className="h-fit">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold">Hội thoại</h2>
          <Button
            type="button"
            onClick={() => {
              setConversationId(undefined);
              setMessages([]);
              setStatus("idle");
            }}
          >
            Chat mới
          </Button>
        </div>
        <div className="mt-4 grid gap-2">
          {conversations.length ? (
            conversations.map((conversation) => (
              <ConversationRow
                key={conversation.id}
                conversation={conversation}
                active={conversation.id === conversationId}
                pending={pending}
                onSelect={() => selectConversation(conversation.id)}
                onRenamed={(title) =>
                  setConversations((current) =>
                    current.map((item) =>
                      item.id === conversation.id ? { ...item, title } : item,
                    ),
                  )
                }
                onArchived={() => {
                  setConversations((current) =>
                    current.filter((item) => item.id !== conversation.id),
                  );
                  if (conversation.id === conversationId) {
                    setConversationId(undefined);
                    setMessages([]);
                  }
                }}
              />
            ))
          ) : (
            <p className="text-sm leading-6 text-muted">
              Chưa có lịch sử. Gửi tin nhắn để bắt đầu hoặc tắt history trong
              Settings.
            </p>
          )}
        </div>
        <a className="mt-5 block text-sm text-primary" href="/app/settings/ai">
          AI settings và quyền riêng tư →
        </a>
      </Card>

      <Card className="grid min-h-[38rem] grid-rows-[auto_1fr_auto] gap-4">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">Personal Assistant</h2>
            <span className="text-xs text-muted">
              Mock Provider ·{" "}
              {settings.historyEnabled ? "history bật" : "không lưu history"}
            </span>
          </div>
          <p className="mt-2 text-sm text-muted">
            Context được allow-list và giới hạn. Chat không tự thay đổi dữ liệu;
            dùng khu vực Proposal bên dưới khi cần tạo entity.
          </p>
          {context.length ? (
            <div
              className="mt-3 flex flex-wrap gap-2"
              aria-label="Context đã dùng"
            >
              {context.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border px-2 py-1 text-xs text-muted"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div
          className="max-h-[32rem] space-y-3 overflow-y-auto rounded-sm border border-border p-3"
          aria-live="polite"
        >
          {messages.length ? (
            messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[90%] rounded-sm p-3 text-sm leading-6 whitespace-pre-wrap ${
                  message.role === "USER"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-background-secondary text-foreground-secondary"
                }`}
              >
                {message.content || "▍"}
              </div>
            ))
          ) : (
            <div className="grid h-full min-h-48 place-items-center text-center text-sm text-muted">
              Hỏi về Goal/Task, lập kế hoạch ngày/tuần hoặc tóm tắt Note.
            </div>
          )}
          {status === "pending" ? (
            <p className="text-sm text-muted">Đang suy nghĩ…</p>
          ) : null}
          {status === "error" ? (
            <p role="alert" className="text-sm text-red-200">
              {error}
            </p>
          ) : null}
        </div>

        <form action={submit} className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-[12rem_1fr]">
            <select
              name="mode"
              defaultValue="chat"
              className="min-h-11 rounded-sm border border-border bg-background-secondary px-3"
            >
              <option value="chat">Chat</option>
              <option value="daily_plan">Daily plan</option>
              <option value="weekly_review">Weekly review</option>
              <option value="note_summary">Note summary</option>
            </select>
            <Textarea
              name="prompt"
              required
              minLength={2}
              maxLength={4000}
              placeholder="Nhập tin nhắn…"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={pending || !settings.enabled}>
              Gửi
            </Button>
            {status === "streaming" ? (
              <Button type="button" onClick={cancelStreaming}>
                Hủy hiển thị
              </Button>
            ) : null}
            {status === "error" ? <Button type="submit">Thử lại</Button> : null}
            <label className="flex min-h-11 items-center gap-2 text-sm text-muted">
              <input type="checkbox" name="simulateError" /> Mô phỏng lỗi
            </label>
          </div>
        </form>
      </Card>
    </div>
  );
}

function ConversationRow({
  conversation,
  active,
  pending,
  onSelect,
  onRenamed,
  onArchived,
}: {
  conversation: ConversationView;
  active: boolean;
  pending: boolean;
  onSelect: () => void;
  onRenamed: (title: string) => void;
  onArchived: () => void;
}) {
  const [title, setTitle] = useState(conversation.title);
  const [busy, startTransition] = useTransition();
  return (
    <div
      className={`rounded-sm border p-2 ${active ? "border-primary" : "border-border"}`}
    >
      <button
        type="button"
        onClick={onSelect}
        disabled={pending}
        className="w-full text-left text-sm font-medium"
      >
        {conversation.title}
      </button>
      <div className="mt-2 flex gap-2">
        <Input
          aria-label={`Đổi tên ${conversation.title}`}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <Button
          type="button"
          disabled={busy}
          onClick={() =>
            startTransition(async () => {
              if (await renameConversationAction(conversation.id, title))
                onRenamed(title);
            })
          }
        >
          Lưu
        </Button>
        <Button
          type="button"
          disabled={busy}
          onClick={() =>
            startTransition(async () => {
              if (await archiveConversationAction(conversation.id))
                onArchived();
            })
          }
        >
          Lưu trữ
        </Button>
      </div>
    </div>
  );
}
