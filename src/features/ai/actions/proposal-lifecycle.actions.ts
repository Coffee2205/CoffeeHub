"use server";

import { requireUser } from "@/lib/supabase/auth";
import { safeAIError } from "../errors/ai-error";
import {
  commitProposal,
  discardProposalDraft,
  updateProposalDraft,
} from "../services/proposal-lifecycle.service";
import type { ProposalActionState } from "./proposal-state";

const text = (form: FormData, name: string) => String(form.get(name) ?? "");
const number = (form: FormData, name: string) => Number(text(form, name));

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
    });
    return {
      status: "success",
      proposalId: proposal.id,
      action: proposal.action,
      proposal: proposal.payload,
      version: proposal.version,
      confirmationId: proposal.confirmationId,
      payloadHash: proposal.payloadHash,
      message: "Đã lưu chỉnh sửa. Xác nhận cũ đã mất hiệu lực.",
    };
  } catch (error) {
    return { status: "error", error: safeAIError(error) };
  }
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
