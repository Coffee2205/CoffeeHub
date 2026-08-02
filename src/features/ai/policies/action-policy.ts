import { AI_ACTIONS, type AIAction } from "../actions/ai-actions";

type Policy = { requiresConfirmation: boolean; writesDatabase: boolean; allowed: boolean };
export const AI_ACTION_POLICY: Record<AIAction, Policy> = {
  [AI_ACTIONS.CHAT]: { requiresConfirmation: false, writesDatabase: false, allowed: true },
  [AI_ACTIONS.ANALYZE_GOAL]: { requiresConfirmation: false, writesDatabase: false, allowed: true },
  [AI_ACTIONS.CREATE_GOAL_PROPOSAL]: { requiresConfirmation: true, writesDatabase: true, allowed: true },
  [AI_ACTIONS.CREATE_ROADMAP_PROPOSAL]: { requiresConfirmation: true, writesDatabase: true, allowed: true },
  [AI_ACTIONS.CREATE_TASK_PROPOSAL]: { requiresConfirmation: true, writesDatabase: true, allowed: true },
  [AI_ACTIONS.CREATE_CHECKLIST_PROPOSAL]: { requiresConfirmation: true, writesDatabase: true, allowed: true },
  [AI_ACTIONS.CREATE_DAILY_PLAN]: { requiresConfirmation: true, writesDatabase: true, allowed: true },
  [AI_ACTIONS.CREATE_WEEKLY_PLAN]: { requiresConfirmation: true, writesDatabase: true, allowed: true },
  [AI_ACTIONS.REVIEW_PROGRESS]: { requiresConfirmation: false, writesDatabase: false, allowed: true },
  [AI_ACTIONS.SUMMARIZE_NOTES]: { requiresConfirmation: false, writesDatabase: false, allowed: true },
};

export const FORBIDDEN_AI_OPERATIONS = ["delete_goal", "delete_roadmap", "delete_task", "drop_table", "modify_auth", "modify_role", "publish_cms", "delete_media", "modify_site_settings", "run_migration", "bulk_update"] as const;
