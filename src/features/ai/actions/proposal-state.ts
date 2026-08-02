import type { AIProviderMetadata, AIUsage } from "../types/ai.types";

export type ProposalActionState = { status: "idle" | "success" | "error"; proposalId?: string; action?: string; proposal?: unknown; usage?: AIUsage; metadata?: AIProviderMetadata; error?: { code: string; message: string } };
export const initialProposalState: ProposalActionState = { status: "idle" };
