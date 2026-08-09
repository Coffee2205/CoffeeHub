import type {
  AIContextEnvelope,
  GoalContext,
  PlanningCandidates,
  PlanningSourceContext,
  PlanningPreferencesContext,
  WorkspaceContext,
} from "../types/ai.types";
const MAX_CONTEXT_RECORDS = 20;
export function buildPlanningContext(input: {
  timezone: string;
  workspace?: WorkspaceContext;
  goal?: GoalContext;
  preferences?: PlanningPreferencesContext;
  existingPlanning?: PlanningCandidates;
  sourceContext?: PlanningSourceContext;
}): AIContextEnvelope {
  return {
    user: { locale: "vi-VN", timezone: input.timezone },
    workspace: input.workspace,
    goal: input.goal,
    preferences: input.preferences,
    existingPlanning: input.existingPlanning,
    sourceContext: input.sourceContext,
    tasks: [],
    tokenBudget: 8_000,
  };
}
export function limitContextRecords<T>(records: T[]): T[] {
  return records.slice(0, MAX_CONTEXT_RECORDS);
}
