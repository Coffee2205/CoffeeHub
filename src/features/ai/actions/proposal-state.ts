import type { AIProviderMetadata, AIUsage } from "../types/ai.types";
import type {
  PlanningCandidates,
  PlanningRelationship,
} from "../types/ai.types";
import type {
  ChecklistFormValues,
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
  checklistFormValues?: ChecklistFormValues;
  relationship?: PlanningRelationship;
  candidates?: PlanningCandidates;
  version?: number;
  confirmationId?: string;
  payloadHash?: string;
  message?: string;
  links?: Array<{ label: string; href: string }>;
  usage?: AIUsage;
  metadata?: AIProviderMetadata;
  error?: { code: string; message: string };
};
export const initialProposalState: ProposalActionState = { status: "idle" };
