export const AI_ACTIONS = {
  CHAT: "chat",
  ANALYZE_GOAL: "analyze_goal",
  CREATE_GOAL_PROPOSAL: "create_goal_proposal",
  CREATE_ROADMAP_PROPOSAL: "create_roadmap_proposal",
  CREATE_TASK_PROPOSAL: "create_task_proposal",
  CREATE_CHECKLIST_PROPOSAL: "create_checklist_proposal",
  CREATE_DAILY_PLAN: "create_daily_plan",
  CREATE_WEEKLY_PLAN: "create_weekly_plan",
  REVIEW_PROGRESS: "review_progress",
  SUMMARIZE_NOTES: "summarize_notes",
} as const;

export type AIAction = (typeof AI_ACTIONS)[keyof typeof AI_ACTIONS];
export const AI_ACTION_VALUES = Object.values(AI_ACTIONS);

export function isAIAction(value: string): value is AIAction {
  return AI_ACTION_VALUES.some((action) => action === value);
}
