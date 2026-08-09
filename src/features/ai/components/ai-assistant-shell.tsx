"use client";

import { useActionState, useState, useTransition } from "react";
import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Textarea,
} from "@/components/ui";
import { AI_ACTIONS } from "../actions/ai-actions";
import { generateProposalAction } from "../actions/generate-proposal.action";
import {
  confirmProposalAction,
  discardProposalAction,
  updateProposalAction,
} from "../actions/proposal-lifecycle.actions";
import {
  initialProposalState,
  type ProposalActionState,
} from "../actions/proposal-state";

const options = [
  { value: AI_ACTIONS.ANALYZE_GOAL, label: "Analyze Goal" },
  { value: AI_ACTIONS.CREATE_GOAL_PROPOSAL, label: "Create Goal Proposal" },
  {
    value: AI_ACTIONS.CREATE_ROADMAP_PROPOSAL,
    label: "Create Roadmap Proposal",
  },
  { value: AI_ACTIONS.CREATE_TASK_PROPOSAL, label: "Create Task Proposal" },
  {
    value: AI_ACTIONS.CREATE_CHECKLIST_PROPOSAL,
    label: "Create Checklist Proposal",
  },
  { value: AI_ACTIONS.CREATE_EVENT_PROPOSAL, label: "Create Event Proposal" },
  { value: AI_ACTIONS.CREATE_NOTE_PROPOSAL, label: "Create Note Proposal" },
  {
    value: AI_ACTIONS.UPDATE_NOTE_PROPOSAL,
    label: "Update Note Proposal (JSON needs noteId/version)",
  },
];

export function AIAssistantShell({
  enabled,
  provider,
  model,
  notes,
}: {
  enabled: boolean;
  provider: string;
  model: string;
  notes: Array<{ id: string; title: string }>;
}) {
  const [state, action, pending] = useActionState(
    generateProposalAction,
    initialProposalState,
  );
  return (
    <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
      <Card>
        <CardHeader>
          <CardTitle>Tạo AI Proposal</CardTitle>
          <CardDescription>
            Mock Provider chạy cục bộ trên server và không ghi dữ liệu nghiệp
            vụ.
          </CardDescription>
        </CardHeader>
        <form action={action} className="grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-medium">Action</span>
            <select
              name="action"
              defaultValue={AI_ACTIONS.ANALYZE_GOAL}
              className="min-h-11 rounded-sm border border-border bg-background-secondary px-3"
            >
              {options.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium">Note cần cập nhật</span>
            <select
              name="noteId"
              defaultValue=""
              className="min-h-11 rounded-sm border border-border bg-background-secondary px-3"
            >
              <option value="">Chỉ dùng cho Update Note proposal</option>
              {notes.map((note) => (
                <option key={note.id} value={note.id}>
                  {note.title}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium">Yêu cầu</span>
            <Textarea
              name="prompt"
              required
              minLength={10}
              maxLength={4000}
              className="min-h-36"
              placeholder="Ví dụ: Hoàn thiện portfolio cá nhân trong 8 tuần với các mốc rõ ràng"
            />
          </label>
          <label className="flex min-h-11 items-center gap-3 rounded-sm border border-border px-3 text-sm">
            <input name="simulateError" type="checkbox" className="size-4" />
            Mô phỏng lỗi provider
          </label>
          <Button type="submit" disabled={pending}>
            {pending ? "Đang xử lý…" : "Analyze / generate mock"}
          </Button>
        </form>
        <div className="mt-5 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-primary-hover">
            Provider: {provider}
          </span>
          <span className="rounded-full border border-border px-3 py-1.5 text-muted">
            Model: {model}
          </span>
          <span className="rounded-full border border-border px-3 py-1.5 text-muted">
            AI thật: {enabled ? "enabled" : "disabled"}
          </span>
        </div>
      </Card>
      <ProposalPreview key={state.proposalId ?? state.status} state={state} />
    </div>
  );
}

function ProposalPreview({ state }: { state: ProposalActionState }) {
  if (state.status === "idle")
    return (
      <Card className="grid min-h-96 place-items-center border-dashed">
        <div className="max-w-md text-center">
          <p className="text-lg font-semibold">Chưa có proposal</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Proposal ghi được lưu riêng như bản nháp AI; chưa tạo Goal, Roadmap,
            Task hoặc Checklist cho đến khi bạn xác nhận.
          </p>
        </div>
      </Card>
    );
  if (state.status === "error") return <ErrorCard state={state} />;
  if (state.action === AI_ACTIONS.ANALYZE_GOAL)
    return <AnalysisPreview state={state} />;
  return <EditableProposal initial={state} />;
}

function EditableProposal({ initial }: { initial: ProposalActionState }) {
  const [current, setCurrent] = useState(initial);
  const [payload, setPayload] = useState(
    JSON.stringify(initial.proposal, null, 2),
  );
  const [dirty, setDirty] = useState(false);
  const [actionError, setActionError] =
    useState<ProposalActionState["error"]>();
  const [pending, startTransition] = useTransition();

  const commonForm = () => {
    const form = new FormData();
    form.set("proposalId", current.proposalId ?? "");
    form.set("version", String(current.version ?? 0));
    form.set("confirmationId", current.confirmationId ?? "");
    return form;
  };

  const update = () =>
    startTransition(async () => {
      setActionError(undefined);
      const form = commonForm();
      form.set("payload", payload);
      const next = await updateProposalAction(initialProposalState, form);
      if (next.status === "success") {
        setCurrent(next);
        setPayload(JSON.stringify(next.proposal, null, 2));
        setDirty(false);
        setActionError(undefined);
      } else {
        setActionError(next.error);
      }
    });

  const discard = () =>
    startTransition(async () => {
      setActionError(undefined);
      const next = await discardProposalAction(
        initialProposalState,
        commonForm(),
      );
      if (next.status === "error") setActionError(next.error);
      else setCurrent(next);
    });

  const confirm = () =>
    startTransition(async () => {
      setActionError(undefined);
      const form = commonForm();
      form.set("payloadHash", current.payloadHash ?? "");
      const next = await confirmProposalAction(initialProposalState, form);
      if (next.status === "error") {
        setActionError(next.error);
        if (next.error?.code === "CONFIRMATION_REQUIRED") setDirty(true);
      } else setCurrent(next);
    });

  if (current.status === "idle")
    return (
      <Card className="grid min-h-96 place-items-center border-dashed text-center">
        <div>
          <p className="font-semibold">Proposal đã được loại bỏ</p>
          <p className="mt-2 text-sm text-muted">
            Không có dữ liệu nghiệp vụ nào được tạo.
          </p>
        </div>
      </Card>
    );
  if (current.status === "error") return <ErrorCard state={current} />;
  if (current.links)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Đã tạo thành công</CardTitle>
          <CardDescription>{current.message}</CardDescription>
        </CardHeader>
        <div className="flex flex-wrap gap-3">
          {current.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center rounded-sm bg-primary px-4 font-medium text-primary-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted">
          Confirmation đã được dùng và retry cùng khóa chỉ trả lại kết quả cũ.
        </p>
      </Card>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proposal preview</CardTitle>
        <CardDescription>
          Bản nháp AI riêng biệt · chưa tạo dữ liệu kế hoạch · mọi chỉnh sửa
          được parse lại bằng schema nghiệp vụ.
        </CardDescription>
      </CardHeader>
      <div className="grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-medium">Payload có thể chỉnh sửa</span>
          <Textarea
            aria-label="Payload proposal"
            value={payload}
            onChange={(event) => {
              setPayload(event.target.value);
              setDirty(true);
            }}
            className="min-h-80 font-mono text-xs"
          />
        </label>
        {current.action === AI_ACTIONS.CREATE_ROADMAP_PROPOSAL ? (
          <p className="rounded-sm border border-border p-3 text-sm text-foreground-secondary">
            Khi xác nhận, hệ thống tạo trọn bộ Goal → Roadmap → Stage → Task
            trong một transaction. Bất kỳ bước nào lỗi sẽ rollback toàn bộ.
          </p>
        ) : null}
        {dirty ? (
          <p role="status" className="text-sm text-amber-200">
            Proposal đã thay đổi. Xác nhận cũ mất hiệu lực cho đến khi lưu lại.
          </p>
        ) : (
          <p role="status" className="text-sm text-emerald-200">
            Proposal phiên bản {current.version} đã sẵn sàng để xác nhận một
            lần.
          </p>
        )}
        {current.message ? (
          <p className="text-sm text-muted">{current.message}</p>
        ) : null}
        {actionError ? (
          <div className="rounded-sm border border-error/40 p-3" role="alert">
            <p className="font-semibold text-red-200">{actionError.code}</p>
            <p className="mt-1 text-sm text-muted">{actionError.message}</p>
          </div>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-3">
          <Button type="button" onClick={update} disabled={pending || !dirty}>
            Lưu chỉnh sửa
          </Button>
          <Button type="button" onClick={discard} disabled={pending}>
            Loại bỏ
          </Button>
          <Button type="button" onClick={confirm} disabled={pending || dirty}>
            Xác nhận và tạo
          </Button>
        </div>
        <p className="text-xs text-muted">
          {initial.metadata?.provider}/{initial.metadata?.model} · proposal{" "}
          {current.proposalId}
        </p>
      </div>
    </Card>
  );
}

function AnalysisPreview({ state }: { state: ProposalActionState }) {
  const analysis = state.proposal as Record<string, unknown>;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Goal analysis</CardTitle>
        <CardDescription>
          Kết quả chỉ đọc; không tạo proposal draft hay dữ liệu CoffeeHub.
        </CardDescription>
      </CardHeader>
      <p className="font-medium">{String(analysis.objective ?? "")}</p>
      <p className="mt-3 text-sm leading-6 text-foreground-secondary">
        {String(analysis.summary ?? "")}
      </p>
      {Object.entries(analysis)
        .filter(([, value]) => Array.isArray(value))
        .map(([key, value]) => (
          <div key={key} className="mt-4">
            <p className="text-sm font-medium">{key}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
              {(value as unknown[]).map((item, index) => (
                <li key={`${key}-${index}`}>{String(item)}</li>
              ))}
            </ul>
          </div>
        ))}
    </Card>
  );
}

function ErrorCard({ state }: { state: ProposalActionState }) {
  return (
    <Card className="border-error/40">
      <p role="alert" className="font-semibold text-red-200">
        {state.error?.code}
      </p>
      <p className="mt-2 text-sm text-muted">{state.error?.message}</p>
    </Card>
  );
}
