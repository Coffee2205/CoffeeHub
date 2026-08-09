import type { AIProviderMetadata, AIUsage } from "../types/ai.types";
import type { GoalFormValues } from "../mappers/proposal-mappers";

export type ProposalActionState = {
  status: "idle" | "success" | "error";
  proposalId?: string;
  action?: string;
  proposal?: unknown;
  goalFormValues?: GoalFormValues;
  usage?: AIUsage;
  metadata?: AIProviderMetadata;
  error?: { code: string; message: string };
};
export const initialProposalState: ProposalActionState = { status: "idle" };
