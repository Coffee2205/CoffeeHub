import type { AIProviderMetadata, AIUsage } from "../types/ai.types";
import type {
  GoalFormValues,
  RoadmapFormValues,
  TaskFormValues,
} from "../mappers/proposal-mappers";

export type ProposalActionState = {
  status: "idle" | "success" | "error";
  proposalId?: string;
  action?: string;
  proposal?: unknown;
  goalFormValues?: GoalFormValues;
  roadmapFormValues?: RoadmapFormValues;
  taskFormValues?: TaskFormValues;
  usage?: AIUsage;
  metadata?: AIProviderMetadata;
  error?: { code: string; message: string };
};
export const initialProposalState: ProposalActionState = { status: "idle" };
