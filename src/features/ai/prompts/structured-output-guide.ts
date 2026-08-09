import { AI_ACTIONS, type AIAction } from "../actions/ai-actions";

const guides: Partial<Record<AIAction, string>> = {
  [AI_ACTIONS.ANALYZE_GOAL]: JSON.stringify({
    summary: "string",
    objective: "string",
    constraints: ["string"],
    successCriteria: ["string"],
    assumptions: ["string"],
    risks: ["string"],
    clarifyingQuestions: ["string"],
    recommendedNextSteps: ["string"],
  }),
  [AI_ACTIONS.CREATE_GOAL_PROPOSAL]: JSON.stringify({
    title: "string",
    description: "string (optional)",
    priority: "LOW | MEDIUM | HIGH | URGENT",
    startDate: "YYYY-MM-DD (optional)",
    targetDate: "YYYY-MM-DD (optional)",
    successCriteria: ["string"],
    assumptions: ["string"],
    risks: ["string"],
  }),
  [AI_ACTIONS.CREATE_ROADMAP_PROPOSAL]: JSON.stringify({
    title: "string",
    description: "string (optional)",
    estimatedDurationDays: "positive integer (optional)",
    stages: [
      {
        title: "string",
        description: "string (optional)",
        order: "sequential integer starting at 1",
        estimatedDays: "positive integer (optional)",
        tasks: [
          {
            title: "string",
            description: "string (optional)",
            priority: "LOW | MEDIUM | HIGH | URGENT",
            estimatedMinutes: "positive integer (optional)",
            dueDate: "YYYY-MM-DD (optional)",
          },
        ],
      },
    ],
  }),
  [AI_ACTIONS.CREATE_TASK_PROPOSAL]: JSON.stringify({
    title: "string",
    description: "string (optional)",
    priority: "LOW | MEDIUM | HIGH | URGENT",
    estimatedMinutes: "positive integer (optional)",
    dueDate: "YYYY-MM-DD (optional)",
    roadmapStageReference: "string (optional)",
  }),
  [AI_ACTIONS.CREATE_CHECKLIST_PROPOSAL]: JSON.stringify({
    title: "string",
    items: [{ title: "string", order: "sequential integer starting at 1" }],
  }),
  [AI_ACTIONS.CREATE_EVENT_PROPOSAL]: JSON.stringify({
    title: "string",
    description: "string (optional)",
    startsAt: "YYYY-MM-DDTHH:mm",
    endsAt: "YYYY-MM-DDTHH:mm (optional)",
    timezone: "IANA timezone",
    recurrence: "NONE | DAILY | WEEKLY | MONTHLY",
  }),
  [AI_ACTIONS.CREATE_NOTE_PROPOSAL]: JSON.stringify({
    title: "string",
    content: "string",
  }),
  [AI_ACTIONS.UPDATE_NOTE_PROPOSAL]: JSON.stringify({
    title: "string",
    content: "string",
  }),
};

export function getStructuredOutputGuide(action: AIAction) {
  return guides[action];
}
