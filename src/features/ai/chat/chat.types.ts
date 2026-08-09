export type ChatMode = "chat" | "daily_plan" | "weekly_review" | "note_summary";

export type ChatMessageView = {
  id: string;
  role: "USER" | "ASSISTANT" | "SYSTEM";
  content: string;
  createdAt: string;
};

export type ConversationView = {
  id: string;
  title: string;
  updatedAt: string;
};

export type AISettingsView = {
  enabled: boolean;
  historyEnabled: boolean;
  includeGoals: boolean;
  includeTasks: boolean;
  includeNotes: boolean;
  retentionDays: number;
};

export type ChatActionState = {
  status: "idle" | "success" | "error";
  conversationId?: string;
  message?: ChatMessageView;
  contextSummary?: string[];
  error?: string;
};
