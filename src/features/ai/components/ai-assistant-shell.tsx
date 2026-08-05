"use client";

import { useActionState } from "react";
import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Textarea,
} from "@/components/ui";
import { AI_ACTIONS } from "../actions/ai-actions";
import { generateProposalAction } from "../actions/generate-proposal.action";
import {
  initialProposalState,
  type ProposalActionState,
} from "../actions/proposal-state";

const options = [
  { value: AI_ACTIONS.CREATE_GOAL_PROPOSAL, label: "Create Goal Proposal" },
  {
    value: AI_ACTIONS.CREATE_ROADMAP_PROPOSAL,
    label: "Create Roadmap Proposal",
  },
  { value: AI_ACTIONS.CREATE_TASK_PROPOSAL, label: "Create Task Proposal" },
];

export function AIAssistantShell({
  enabled,
  provider,
  model,
}: {
  enabled: boolean;
  provider: string;
  model: string;
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
            Mock Provider chạy cục bộ trên server. Không gọi OpenAI, Groq hoặc
            Gemini.
          </CardDescription>
        </CardHeader>
        <form action={action} className="grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-medium">Action</span>
            <select
              name="action"
              defaultValue={AI_ACTIONS.CREATE_GOAL_PROPOSAL}
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
            <input name="simulateError" type="checkbox" className="size-4" /> Mô
            phỏng lỗi provider
          </label>
          <Button type="submit" disabled={pending}>
            {pending ? "Đang tạo proposal…" : "Generate mock proposal"}
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
      <ProposalPreview state={state} />
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
            Chọn action và mô tả kết quả mong muốn. Proposal sẽ xuất hiện ở đây
            để bạn xem và chỉnh, nhưng không được lưu vào database.
          </p>
        </div>
      </Card>
    );
  if (state.status === "error")
    return (
      <Card className="border-error/40">
        <p role="alert" className="font-semibold text-red-200">
          {state.error?.code}
        </p>
        <p className="mt-2 text-sm text-muted">{state.error?.message}</p>
      </Card>
    );
  const proposal = state.proposal as Record<string, unknown>;
  return (
    <Card key={state.proposalId}>
      <CardHeader>
        <CardTitle>Proposal preview</CardTitle>
        <CardDescription>
          Đã qua runtime validation · chưa lưu · có thể chỉnh trước khi chuyển
          sang form nghiệp vụ.
        </CardDescription>
      </CardHeader>
      <div className="grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-medium">Tiêu đề</span>
          <Input defaultValue={String(proposal.title ?? "")} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Mô tả</span>
          <Textarea
            className="min-h-28"
            defaultValue={String(proposal.description ?? "")}
          />
        </label>
        {state.action === AI_ACTIONS.CREATE_GOAL_PROPOSAL ? (
          <GoalFields proposal={proposal} />
        ) : null}
        {state.action === AI_ACTIONS.CREATE_ROADMAP_PROPOSAL ? (
          <RoadmapFields proposal={proposal} />
        ) : null}
        {state.action === AI_ACTIONS.CREATE_TASK_PROPOSAL ? (
          <TaskFields proposal={proposal} />
        ) : null}
        <div className="rounded-sm border border-warning/40 bg-warning/10 p-3 text-sm text-amber-100">
          Confirmation required. Nút lưu đang tắt trong AI Foundation; không có
          database write.
        </div>
        <Button disabled>Save to CoffeeHub</Button>
        <p className="text-xs text-muted">
          {state.metadata?.provider}/{state.metadata?.model} ·{" "}
          {state.usage?.totalTokens ?? 0} mock tokens · proposal{" "}
          {state.proposalId}
        </p>
      </div>
    </Card>
  );
}

function GoalFields({ proposal }: { proposal: Record<string, unknown> }) {
  return (
    <>
      <label className="grid gap-2">
        <span className="text-sm font-medium">Priority</span>
        <Input defaultValue={String(proposal.priority ?? "MEDIUM")} />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-medium">Success criteria</span>
        <Textarea
          defaultValue={
            Array.isArray(proposal.successCriteria)
              ? proposal.successCriteria.join("\n")
              : ""
          }
        />
      </label>
    </>
  );
}
function RoadmapFields({ proposal }: { proposal: Record<string, unknown> }) {
  const stages = Array.isArray(proposal.stages) ? proposal.stages : [];
  return (
    <div className="rounded-sm border border-border p-3">
      <p className="text-sm font-medium">Stages ({stages.length})</p>
      {stages.map((stage, index) => (
        <Input
          key={index}
          className="mt-2"
          defaultValue={String((stage as Record<string, unknown>).title ?? "")}
          aria-label={`Stage ${index + 1}`}
        />
      ))}
    </div>
  );
}
function TaskFields({ proposal }: { proposal: Record<string, unknown> }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="grid gap-2">
        <span className="text-sm font-medium">Priority</span>
        <Input defaultValue={String(proposal.priority ?? "MEDIUM")} />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-medium">Estimated minutes</span>
        <Input
          type="number"
          defaultValue={Number(proposal.estimatedMinutes ?? 0)}
        />
      </label>
    </div>
  );
}
