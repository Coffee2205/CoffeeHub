"use server";

import { requireUser } from "@/lib/supabase/auth";
import { safeAIError } from "../errors/ai-error";
import {
  commitProposal,
  discardProposalDraft,
  updateProposalDraft,
} from "../services/proposal-lifecycle.service";
import type { ProposalActionState } from "./proposal-state";
import type { PlanningRelationship } from "../types/ai.types";

const text = (form: FormData, name: string) => String(form.get(name) ?? "");
const number = (form: FormData, name: string) => Number(text(form, name));
const optional = (form: FormData, name: string) =>
  text(form, name) || undefined;
const relationship = (form: FormData): PlanningRelationship => ({
  action: (text(form, "relationshipAction") ||
    "CREATE_NEW") as PlanningRelationship["action"],
  confidence: (text(form, "relationshipConfidence") ||
    "LOW") as PlanningRelationship["confidence"],
  goalId: optional(form, "goalId"),
  roadmapId: optional(form, "roadmapId"),
  stageId: optional(form, "stageId"),
  taskId: optional(form, "taskId"),
  ambiguous: text(form, "ambiguous") === "true",
});

export async function updateProposalAction(
  _previous: ProposalActionState,
  form: FormData,
): Promise<ProposalActionState> {
  const user = await requireUser();
  try {
    const payload = JSON.parse(text(form, "payload")) as unknown;
    const proposal = await updateProposalDraft({
      userId: user.id,
      proposalId: text(form, "proposalId"),
      version: number(form, "version"),
      confirmationId: text(form, "confirmationId"),
      payload,
      relationship: relationship(form),
    });
    return {
      ..._previous,
      status: "success",
      proposalId: proposal.id,
      action: proposal.action,
      proposal: storedData(proposal.payload),
      version: proposal.version,
      confirmationId: proposal.confirmationId,
      payloadHash: proposal.payloadHash,
      relationship: storedRelationship(proposal.payload),
      message: "Đã lưu chỉnh sửa. Xác nhận cũ đã mất hiệu lực.",
    };
  } catch (error) {
    return { status: "error", error: safeAIError(error) };
  }
}

function storedRelationship(payload: unknown) {
  if (payload && typeof payload === "object" && "relationship" in payload)
    return (payload as { relationship: PlanningRelationship }).relationship;
  return undefined;
}

function storedData(payload: unknown) {
  if (payload && typeof payload === "object" && "data" in payload)
    return (payload as { data: unknown }).data;
  return payload;
}

export async function discardProposalAction(
  _previous: ProposalActionState,
  form: FormData,
): Promise<ProposalActionState> {
  const user = await requireUser();
  try {
    await discardProposalDraft({
      userId: user.id,
      proposalId: text(form, "proposalId"),
      version: number(form, "version"),
      confirmationId: text(form, "confirmationId"),
    });
    return { status: "idle", message: "Đã loại bỏ proposal." };
  } catch (error) {
    return { status: "error", error: safeAIError(error) };
  }
}

export async function confirmProposalAction(
  _previous: ProposalActionState,
  form: FormData,
): Promise<ProposalActionState> {
  const user = await requireUser();
  try {
    const result = await commitProposal({
      userId: user.id,
      proposalId: text(form, "proposalId"),
      version: number(form, "version"),
      confirmationId: text(form, "confirmationId"),
      payloadHash: text(form, "payloadHash"),
    });
    return {
      status: "success",
      proposalId: text(form, "proposalId"),
      message: "Đã xác nhận và tạo dữ liệu CoffeeHub.",
      links: result.links,
    };
  } catch (error) {
    return { status: "error", error: safeAIError(error) };
  }
}
