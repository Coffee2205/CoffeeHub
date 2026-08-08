"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Note } from "@/generated/prisma/client";
import { saveNoteAction, type NoteSnapshot } from "../note.actions";
import {
  mergeNoteDraft,
  postponeNoteDraft,
  readNoteDraft,
  removeNoteDraft,
  writeNoteDraft,
} from "@/features/sync/note-draft-store";

type SaveState =
  | "idle"
  | "saving"
  | "saved"
  | "error"
  | "offline"
  | "syncing"
  | "conflict";

const labels: Record<SaveState, string> = {
  idle: "Sẵn sàng",
  saving: "Đang lưu…",
  saved: "Đã lưu",
  error: "Lưu thất bại — sẽ thử lại",
  offline: "Ngoại tuyến — bản nháp đã lưu trên thiết bị",
  syncing: "Đang đồng bộ…",
  conflict: "Có xung đột phiên bản",
};

export function NoteEditor({ note, userId }: { note: Note; userId: string }) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [version, setVersion] = useState(note.version);
  const [state, setState] = useState<SaveState>("idle");
  const [remote, setRemote] = useState<NoteSnapshot | null>(null);
  const [online, setOnline] = useState(true);
  const hydrated = useRef(false);
  const latest = useRef({ title, content, version });
  const lastSaved = useRef(`${note.title}\u0000${note.content}`);

  useEffect(() => {
    latest.current = { title, content, version };
  }, [content, title, version]);

  const persist = useCallback(
    async (draft = latest.current) => {
      const stored = await readNoteDraft(note.id);
      const queued = mergeNoteDraft(
        stored?.userId === userId ? stored : undefined,
        {
          noteId: note.id,
          userId,
          ...draft,
          updatedAt: Date.now(),
        },
      );
      await writeNoteDraft(queued);
      if (!navigator.onLine) {
        setState("offline");
        return;
      }
      setState((current) => (current === "offline" ? "syncing" : "saving"));
      try {
        if (queued.nextAttemptAt > Date.now()) {
          setState("error");
          return;
        }
        const result = await saveNoteAction(
          note.id,
          queued.version,
          { title: queued.title, content: queued.content },
          queued.idempotencyKey,
        );
        if (result.status === "saved") {
          setVersion(result.note.version);
          latest.current.version = result.note.version;
          lastSaved.current = `${result.note.title}\u0000${result.note.content}`;
          await removeNoteDraft(note.id);
          setState("saved");
          setRemote(null);
        } else if (result.status === "conflict") {
          setRemote(result.note);
          setState("conflict");
        } else {
          await writeNoteDraft(postponeNoteDraft(queued));
          setState("error");
        }
      } catch {
        const postponed = postponeNoteDraft(queued);
        await writeNoteDraft(postponed);
        setState(navigator.onLine ? "error" : "offline");
      }
    },
    [note.id, userId],
  );

  useEffect(() => {
    if (state !== "error" || !online) return;
    let timer: number | undefined;
    void readNoteDraft(note.id).then((draft) => {
      if (!draft || draft.userId !== userId) return;
      timer = window.setTimeout(
        () => void persist(),
        Math.max(0, draft.nextAttemptAt - Date.now()),
      );
    });
    return () => window.clearTimeout(timer);
  }, [note.id, online, persist, state, userId]);

  useEffect(() => {
    void readNoteDraft(note.id).then(async (draft) => {
      if (draft && draft.userId !== userId) {
        await removeNoteDraft(note.id);
      } else if (draft && draft.updatedAt > note.updatedAt.getTime()) {
        setTitle(draft.title);
        setContent(draft.content);
        setVersion(draft.version);
        latest.current = {
          title: draft.title,
          content: draft.content,
          version: draft.version,
        };
        setOnline(navigator.onLine);
        setState(navigator.onLine ? "syncing" : "offline");
        if (navigator.onLine) void persist(draft);
      }
      hydrated.current = true;
    });
  }, [note.id, note.updatedAt, persist, userId]);

  useEffect(() => {
    if (!hydrated.current || state === "conflict" || state === "saving") return;
    if (`${title}\u0000${content}` === lastSaved.current) return;
    const timer = window.setTimeout(() => void persist(), 1000);
    return () => window.clearTimeout(timer);
  }, [
    content,
    note.content,
    note.title,
    note.version,
    persist,
    state,
    title,
    version,
  ]);

  useEffect(() => {
    const sync = () => {
      setOnline(true);
      if (state === "offline" || state === "error") void persist();
    };
    const offline = () => {
      setOnline(false);
      setState("offline");
    };
    window.addEventListener("online", sync);
    window.addEventListener("offline", offline);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", offline);
    };
  }, [persist, state]);

  function useRemoteVersion() {
    if (!remote) return;
    setTitle(remote.title);
    setContent(remote.content);
    setVersion(remote.version);
    latest.current = {
      title: remote.title,
      content: remote.content,
      version: remote.version,
    };
    void removeNoteDraft(note.id);
    lastSaved.current = `${remote.title}\u0000${remote.content}`;
    setRemote(null);
    setState("saved");
  }

  function keepLocalVersion() {
    if (!remote) return;
    setVersion(remote.version);
    latest.current.version = remote.version;
    setRemote(null);
    setState("syncing");
    void persist({ ...latest.current, version: remote.version });
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-sm text-muted">
          {labels[state]}
        </p>
        {(state === "error" || state === "offline") && online ? (
          <button
            type="button"
            onClick={() => void persist()}
            className="min-h-11 rounded-sm border border-border px-4 text-sm font-semibold hover:border-primary"
          >
            Thử lại
          </button>
        ) : null}
      </div>
      {state === "conflict" && remote ? (
        <div
          role="alert"
          className="rounded-lg border border-warning/50 bg-warning/10 p-4"
        >
          <h2 className="font-semibold">Ghi chú đã thay đổi ở nơi khác</h2>
          <p className="mt-2 text-sm text-foreground-secondary">
            Chọn bản trên máy chủ để bỏ bản nháp, hoặc giữ bản nháp để ghi đè có
            chủ đích.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={useRemoteVersion}
              className="min-h-11 rounded-sm border border-border px-4 text-sm font-semibold"
            >
              Dùng bản máy chủ
            </button>
            <button
              type="button"
              onClick={keepLocalVersion}
              className="min-h-11 rounded-sm bg-primary-control px-4 text-sm font-semibold text-white"
            >
              Giữ bản nháp của tôi
            </button>
          </div>
        </div>
      ) : null}
      <label className="grid gap-2">
        <span className="text-sm font-medium">Tiêu đề</span>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={220}
          className="min-h-12 rounded-sm border border-border bg-background-secondary px-4 text-xl font-semibold outline-none focus:border-primary"
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-medium">Nội dung</span>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className="min-h-[55vh] resize-y rounded-sm border border-border bg-background-secondary p-4 leading-7 outline-none focus:border-primary"
          placeholder="Viết ghi chú của bạn…"
        />
      </label>
    </section>
  );
}
