import "server-only";
import { AI_ACTIONS, type AIAction } from "../actions/ai-actions";
import { getAIConfig } from "../config/ai.config";
import { AIError } from "../errors/ai-error";
import { getProvider } from "../providers/provider-registry";
import {
  checklistProposalSchema,
  eventProposalSchema,
  goalAnalysisSchema,
  goalProposalSchema,
  roadmapProposalSchema,
  taskProposalSchema,
  noteProposalSchema,
} from "../schemas/proposal.schemas";

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
export type MockProposalAction = keyof typeof schemas;
export function isMockProposalAction(
  action: AIAction,
): action is MockProposalAction {
  return action in schemas;
}

export async function generateMockProposal(input: {
  action: MockProposalAction;
  prompt: string;
  simulateError?: boolean;
}) {
  const config = getAIConfig();
  if (!config.useMockProvider)
    throw new AIError("ACTION_NOT_ALLOWED", "Mock Provider đang bị tắt.");
  const provider = getProvider("mock");
  const options = {
    timeoutMs: config.timeoutMs,
    maxOutputTokens: config.maxOutputTokens,
  };
  if (input.action === AI_ACTIONS.ANALYZE_GOAL)
    return provider.generateStructured(input, goalAnalysisSchema, options);
  if (input.action === AI_ACTIONS.CREATE_GOAL_PROPOSAL)
    return provider.generateStructured(input, goalProposalSchema, options);
  if (input.action === AI_ACTIONS.CREATE_ROADMAP_PROPOSAL)
    return provider.generateStructured(input, roadmapProposalSchema, options);
  if (input.action === AI_ACTIONS.CREATE_TASK_PROPOSAL)
    return provider.generateStructured(input, taskProposalSchema, options);
  if (input.action === AI_ACTIONS.CREATE_CHECKLIST_PROPOSAL)
    return provider.generateStructured(input, checklistProposalSchema, options);
  if (input.action === AI_ACTIONS.CREATE_EVENT_PROPOSAL)
    return provider.generateStructured(input, eventProposalSchema, options);
  return provider.generateStructured(input, noteProposalSchema, options);
}
