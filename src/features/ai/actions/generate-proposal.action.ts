"use server";

import { randomUUID } from "node:crypto";
import { requireUser } from "@/lib/supabase/auth";
import { AI_ACTIONS, isAIAction } from "./ai-actions";
import { safeAIError } from "../errors/ai-error";
import {
  mapAndValidateGoalProposal,
  mapAndValidateEventProposal,
  mapAndValidateChecklistProposal,
  mapAndValidateRoadmapProposal,
  mapAndValidateTaskProposal,
  mapAndValidateNoteProposal,
} from "../mappers/proposal-mappers";
import {
  goalProposalSchema,
  eventProposalSchema,
  checklistProposalSchema,
  roadmapProposalSchema,
  taskProposalSchema,
  noteProposalSchema,
} from "../schemas/proposal.schemas";
import {
  generateProposal,
  isProposalAction,
} from "../services/proposal.service";
import type { ProposalActionState } from "./proposal-state";
import { createProposalDraft } from "../services/proposal-lifecycle.service";
import { getNote } from "@/features/notes/note.repository";
import { getAssistantData } from "../chat/chat.repository";
import { checkAIRateLimit } from "../services/ai-rate-limit";
import { resolvePlanningEntities } from "../context/planning-entity-resolver";
import type { PlanningSourceContext } from "../types/ai.types";
import { buildPlanningContext } from "../context/context-builder";

export async function generateProposalAction(
  _previous: ProposalActionState,
  form: FormData,
): Promise<ProposalActionState> {
  const user = await requireUser();
  if (!(await getAssistantData(user.id)).settings.enabled)
    return {
      status: "error",
      error: { code: "AI_DISABLED", message: "AI đang bị tắt trong Settings." },
    };
  const actionValue = String(form.get("action") ?? "");
  const prompt = String(form.get("prompt") ?? "").trim();
  if (!isAIAction(actionValue) || !isProposalAction(actionValue))
    return {
      status: "error",
      error: {
        code: "ACTION_NOT_ALLOWED",
        message: "Action chưa được hỗ trợ trong Proposal UI.",
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
    checkAIRateLimit(user.id);
    const sourceContext = Object.fromEntries(
      [
        ["conversationId", String(form.get("conversationId") ?? "")],
        ["goalId", String(form.get("sourceGoalId") ?? "")],
        ["roadmapId", String(form.get("sourceRoadmapId") ?? "")],
        ["stageId", String(form.get("sourceStageId") ?? "")],
        ["taskId", String(form.get("sourceTaskId") ?? "")],
      ].filter(([, value]) => value),
    ) as PlanningSourceContext;
    const planning = await resolvePlanningEntities({
      userId: user.id,
      action: actionValue,
      request: prompt,
      sourceContext,
    });
    const result = await generateProposal({
      action: actionValue,
      prompt,
      context: buildPlanningContext({
        timezone: "Asia/Ho_Chi_Minh",
        existingPlanning: planning.candidates,
        sourceContext,
      }),
      simulateError: form.get("simulateError") === "on",
    });
    if (actionValue === AI_ACTIONS.UPDATE_NOTE_PROPOSAL) {
      const noteId = String(form.get("noteId") ?? "");
      const note = await getNote(user.id, noteId);
      if (!note)
        return {
          status: "error",
          error: {
            code: "INVALID_REQUEST",
            message: "Hãy chọn một Note thuộc owner để tạo update proposal.",
          },
        };
      result.data = {
        ...(result.data as Record<string, unknown>),
        noteId: note.id,
        expectedVersion: note.version,
      } as typeof result.data;
    }
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
    if (actionValue === AI_ACTIONS.CREATE_EVENT_PROPOSAL)
      mapAndValidateEventProposal(eventProposalSchema.parse(result.data));
    if (
      actionValue === AI_ACTIONS.CREATE_NOTE_PROPOSAL ||
      actionValue === AI_ACTIONS.UPDATE_NOTE_PROPOSAL
    )
      mapAndValidateNoteProposal(noteProposalSchema.parse(result.data));
    const draft =
      actionValue === AI_ACTIONS.ANALYZE_GOAL
        ? null
        : await createProposalDraft(
            user.id,
            actionValue,
            result.data,
            planning.relationship,
            planning.sourceContext,
          );
    return {
      status: "success",
      proposalId: draft?.id ?? randomUUID(),
      action: actionValue,
      proposal: result.data,
      goalFormValues,
      roadmapFormValues,
      taskFormValues,
      checklistFormValues,
      relationship: planning.relationship,
      candidates: planning.candidates,
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
