import type { AIAction } from "../actions/ai-actions";

export type AIProviderName = "openai" | "groq" | "gemini" | "mock";
export type AIUsage = { promptTokens?: number; completionTokens?: number; totalTokens?: number; estimatedCost?: number; currency?: string };
export type AIProviderMetadata = { provider: AIProviderName; model: string; requestId?: string; latencyMs?: number; fallbackUsed?: boolean };
export type AIChatInput = { action: AIAction; prompt: string; context?: AIContextEnvelope; language?: string; timezone?: string };
export type AIChatResult = { text: string; usage: AIUsage; metadata: AIProviderMetadata };
export type AIStreamChunk = { type: "text" | "done"; value: string };
export type AIGenerationOptions = { timeoutMs?: number; maxOutputTokens?: number };
export type AIProviderResult<T> = { data: T; usage: AIUsage; metadata: AIProviderMetadata };
export type RuntimeSchema<T> = { parse(value: unknown): T };

export type GoalProposal = { title: string; description?: string; priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"; startDate?: string; targetDate?: string; successCriteria: string[]; assumptions: string[]; risks: string[] };
export type TaskProposal = { title: string; description?: string; priority: GoalProposal["priority"]; estimatedMinutes?: number; dueDate?: string; roadmapStageReference?: string };
export type RoadmapStageProposal = { title: string; description?: string; order: number; estimatedDays?: number; tasks: TaskProposal[] };
export type RoadmapProposal = { title: string; description?: string; estimatedDurationDays?: number; stages: RoadmapStageProposal[] };
export type ChecklistProposal = { title: string; items: Array<{ title: string; order: number }> };
export type TimeBlockProposal = { title: string; startsAt: string; endsAt: string; taskReference?: string };
export type DailyPlanProposal = { title: string; dateRange: { start: string; end: string }; timeBlocks: TimeBlockProposal[]; assumptions: string[]; warnings: string[] };
export type WeeklyPlanProposal = DailyPlanProposal;
export type GoalReviewProposal = { summary: string; progress: number; wins: string[]; risks: string[]; nextActions: string[] };

export type UserContext = { locale: string; timezone: string };
export type WorkspaceContext = { activeGoalCount: number; activeTaskCount: number };
export type GoalContext = { title: string; description?: string; targetDate?: string };
export type RoadmapContext = { title: string; stageCount: number };
export type TaskContext = { title: string; status: string; dueDate?: string };
export type CalendarContext = { availableMinutesPerWeek?: number; upcomingEventCount: number };
export type NotesContext = { noteCount: number; excerpts: string[] };
export type PlanningPreferencesContext = { preferredDays?: string[]; maximumTasksPerDay?: number };
export type AIContextEnvelope = { user: UserContext; workspace?: WorkspaceContext; goal?: GoalContext; roadmap?: RoadmapContext; tasks?: TaskContext[]; calendar?: CalendarContext; notes?: NotesContext; preferences?: PlanningPreferencesContext; tokenBudget: number };

export type AIProposalStatus = "DRAFT" | "CONFIRMED" | "COMMITTED" | "REJECTED" | "EXPIRED" | "FAILED";
export type AIConversation = { id: string; userId: string; createdAt: string };
export type AIConversationMessage = { id: string; conversationId: string; role: "user" | "assistant" | "system"; content: string; createdAt: string };
export type AIProposal = { id: string; action: AIAction; status: AIProposalStatus; payload: unknown; createdAt: string };
export type AIUsageLog = AIUsage & { proposalId?: string; metadata: AIProviderMetadata };
export type AIActionLog = { id: string; userId: string; action: AIAction; status: "PROPOSED" | "CONFIRMED" | "FAILED"; proposalId?: string; createdAt: string };
