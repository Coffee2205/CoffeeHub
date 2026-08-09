"use server";

import { randomUUID } from "node:crypto";
import { requireUser } from "@/lib/supabase/auth";
import { AI_ACTIONS, isAIAction } from "./ai-actions";
import { safeAIError } from "../errors/ai-error";
import {
  mapAndValidateGoalProposal,
  mapAndValidateChecklistProposal,
  mapAndValidateRoadmapProposal,
  mapAndValidateTaskProposal,
} from "../mappers/proposal-mappers";
import {
  goalProposalSchema,
  checklistProposalSchema,
  roadmapProposalSchema,
  taskProposalSchema,
} from "../schemas/proposal.schemas";
import {
  generateMockProposal,
  isMockProposalAction,
} from "../services/proposal.service";
import type { ProposalActionState } from "./proposal-state";
import { createProposalDraft } from "../services/proposal-lifecycle.service";

export async function generateProposalAction(
  _previous: ProposalActionState,
  form: FormData,
): Promise<ProposalActionState> {
  const user = await requireUser();
  const actionValue = String(form.get("action") ?? "");
  const prompt = String(form.get("prompt") ?? "").trim();
  if (!isAIAction(actionValue) || !isMockProposalAction(actionValue))
    return {
      status: "error",
      error: {
        code: "ACTION_NOT_ALLOWED",
        message: "Action chưa được bật trong Mock UI.",
      },
    };
  if (prompt.length < 10 || prompt.length > 4_000)
    return {
      status: "error",
      error: {
        code: "INVALID_REQUEST",
        message: "Yêu cầu phải có 10–4.000 ký tự.",
      },
    };
  try {
    const result = await generateMockProposal({
      action: actionValue,
      prompt,
      simulateError: form.get("simulateError") === "on",
    });
    const goalFormValues =
      actionValue === AI_ACTIONS.CREATE_GOAL_PROPOSAL
        ? mapAndValidateGoalProposal(goalProposalSchema.parse(result.data))
        : undefined;
    const roadmapFormValues =
      actionValue === AI_ACTIONS.CREATE_ROADMAP_PROPOSAL
        ? mapAndValidateRoadmapProposal(
            roadmapProposalSchema.parse(result.data),
          )
        : undefined;
    const taskFormValues =
      actionValue === AI_ACTIONS.CREATE_TASK_PROPOSAL
        ? mapAndValidateTaskProposal(taskProposalSchema.parse(result.data))
        : undefined;
    const checklistFormValues =
      actionValue === AI_ACTIONS.CREATE_CHECKLIST_PROPOSAL
        ? mapAndValidateChecklistProposal(
            checklistProposalSchema.parse(result.data),
          )
        : undefined;
    const draft =
      actionValue === AI_ACTIONS.ANALYZE_GOAL
        ? null
        : await createProposalDraft(user.id, actionValue, result.data);
    return {
      status: "success",
      proposalId: draft?.id ?? randomUUID(),
      action: actionValue,
      proposal: result.data,
      goalFormValues,
      roadmapFormValues,
      taskFormValues,
      checklistFormValues,
      version: draft?.version,
      confirmationId: draft?.confirmationId,
      payloadHash: draft?.payloadHash,
      usage: result.usage,
      metadata: result.metadata,
    };
  } catch (error) {
    return { status: "error", error: safeAIError(error) };
  }
}
