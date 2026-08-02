"use server";

import { randomUUID } from "node:crypto";
import { requireUser } from "@/lib/supabase/auth";
import { isAIAction } from "./ai-actions";
import { safeAIError } from "../errors/ai-error";
import { generateMockProposal, isMockProposalAction } from "../services/proposal.service";
import type { ProposalActionState } from "./proposal-state";

export async function generateProposalAction(_previous: ProposalActionState, form: FormData): Promise<ProposalActionState> {
  await requireUser();
  const actionValue = String(form.get("action") ?? "");
  const prompt = String(form.get("prompt") ?? "").trim();
  if (!isAIAction(actionValue) || !isMockProposalAction(actionValue)) return { status: "error", error: { code: "ACTION_NOT_ALLOWED", message: "Action chưa được bật trong Mock UI." } };
  if (prompt.length < 10 || prompt.length > 4_000) return { status: "error", error: { code: "INVALID_REQUEST", message: "Yêu cầu phải có 10–4.000 ký tự." } };
  try {
    const result = await generateMockProposal({ action: actionValue, prompt, simulateError: form.get("simulateError") === "on" });
    return { status: "success", proposalId: randomUUID(), action: actionValue, proposal: result.data, usage: result.usage, metadata: result.metadata };
  } catch (error) {
    return { status: "error", error: safeAIError(error) };
  }
}
