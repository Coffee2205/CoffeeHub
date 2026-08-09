import "server-only";
import { AI_ACTIONS, type AIAction } from "../actions/ai-actions";
import { getAIConfig } from "../config/ai.config";
import {
  checklistProposalSchema,
  eventProposalSchema,
  goalAnalysisSchema,
  goalProposalSchema,
  roadmapProposalSchema,
  taskProposalSchema,
  noteProposalSchema,
} from "../schemas/proposal.schemas";
import { runWithProviderFallback } from "./ai-orchestrator";
import { getProviderCandidates } from "../providers/provider-registry";

const schemas = {
  [AI_ACTIONS.ANALYZE_GOAL]: goalAnalysisSchema,
  [AI_ACTIONS.CREATE_GOAL_PROPOSAL]: goalProposalSchema,
  [AI_ACTIONS.CREATE_ROADMAP_PROPOSAL]: roadmapProposalSchema,
  [AI_ACTIONS.CREATE_TASK_PROPOSAL]: taskProposalSchema,
  [AI_ACTIONS.CREATE_CHECKLIST_PROPOSAL]: checklistProposalSchema,
  [AI_ACTIONS.CREATE_EVENT_PROPOSAL]: eventProposalSchema,
  [AI_ACTIONS.CREATE_NOTE_PROPOSAL]: noteProposalSchema,
  [AI_ACTIONS.UPDATE_NOTE_PROPOSAL]: noteProposalSchema,
} as const;
export type ProposalAction = keyof typeof schemas;
export function isProposalAction(action: AIAction): action is ProposalAction {
  return action in schemas;
}

export async function generateProposal(input: {
  action: ProposalAction;
  prompt: string;
  context?: import("../types/ai.types").AIContextEnvelope;
  simulateError?: boolean;
}) {
  const config = getAIConfig();
  const options = {
    timeoutMs: config.timeoutMs,
    maxOutputTokens: config.maxOutputTokens,
  };
  if (input.action === AI_ACTIONS.ANALYZE_GOAL)
    return runWithProviderFallback(
      (provider) =>
        provider.generateStructured(input, goalAnalysisSchema, options),
      getProviderCandidates(),
    );
  if (input.action === AI_ACTIONS.CREATE_GOAL_PROPOSAL)
    return runWithProviderFallback(
      (provider) =>
        provider.generateStructured(input, goalProposalSchema, options),
      getProviderCandidates(),
    );
  if (input.action === AI_ACTIONS.CREATE_ROADMAP_PROPOSAL)
    return runWithProviderFallback(
      (provider) =>
        provider.generateStructured(input, roadmapProposalSchema, options),
      getProviderCandidates(),
    );
  if (input.action === AI_ACTIONS.CREATE_TASK_PROPOSAL)
    return runWithProviderFallback(
      (provider) =>
        provider.generateStructured(input, taskProposalSchema, options),
      getProviderCandidates(),
    );
  if (input.action === AI_ACTIONS.CREATE_CHECKLIST_PROPOSAL)
    return runWithProviderFallback(
      (provider) =>
        provider.generateStructured(input, checklistProposalSchema, options),
      getProviderCandidates(),
    );
  if (input.action === AI_ACTIONS.CREATE_EVENT_PROPOSAL)
    return runWithProviderFallback(
      (provider) =>
        provider.generateStructured(input, eventProposalSchema, options),
      getProviderCandidates(),
    );
  return runWithProviderFallback(
    (provider) =>
      provider.generateStructured(input, noteProposalSchema, options),
    getProviderCandidates(),
  );
}
