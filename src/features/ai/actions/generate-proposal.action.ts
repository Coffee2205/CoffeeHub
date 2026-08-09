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
  generateMockProposal,
  isMockProposalAction,
} from "../services/proposal.service";
import type { ProposalActionState } from "./proposal-state";
import { createProposalDraft } from "../services/proposal-lifecycle.service";
import { getNote } from "@/features/notes/note.repository";
import { getAssistantData } from "../chat/chat.repository";

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
