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
            priority: "LOW | MEDIUM | HIGH | URGENT",
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

const string = { type: "string" } as const;
const stringArray = { type: "array", items: string } as const;
const optionalString = { type: ["string", "null"] } as const;
const optionalPositiveInteger = {
  type: ["integer", "null"],
  minimum: 1,
} as const;
const priority = { enum: ["LOW", "MEDIUM", "HIGH", "URGENT"] } as const;

const taskProperties = {
  title: { type: "string", maxLength: 220 },
  description: optionalString,
  priority,
  estimatedMinutes: optionalPositiveInteger,
  dueDate: optionalString,
  roadmapStageReference: optionalString,
} as const;

const providerSchemas: Partial<Record<AIAction, Record<string, unknown>>> = {
  [AI_ACTIONS.ANALYZE_GOAL]: {
    type: "object",
    additionalProperties: false,
    properties: {
      summary: string,
      objective: string,
      constraints: stringArray,
      successCriteria: stringArray,
      assumptions: stringArray,
      risks: stringArray,
      clarifyingQuestions: stringArray,
      recommendedNextSteps: stringArray,
    },
    required: [
      "summary",
      "objective",
      "constraints",
      "successCriteria",
      "assumptions",
      "risks",
      "clarifyingQuestions",
      "recommendedNextSteps",
    ],
  },
  [AI_ACTIONS.CREATE_GOAL_PROPOSAL]: {
    type: "object",
    additionalProperties: false,
    properties: {
      title: { type: "string", maxLength: 180 },
      description: optionalString,
      priority,
      startDate: optionalString,
      targetDate: optionalString,
      successCriteria: { ...stringArray, maxItems: 20 },
      assumptions: { ...stringArray, maxItems: 20 },
      risks: { ...stringArray, maxItems: 20 },
    },
    required: [
      "title",
      "description",
      "priority",
      "startDate",
      "targetDate",
      "successCriteria",
      "assumptions",
      "risks",
    ],
  },
  [AI_ACTIONS.CREATE_TASK_PROPOSAL]: {
    type: "object",
    additionalProperties: false,
    properties: taskProperties,
    required: Object.keys(taskProperties),
  },
  [AI_ACTIONS.CREATE_CHECKLIST_PROPOSAL]: {
    type: "object",
    additionalProperties: false,
    properties: {
      title: { type: "string", maxLength: 220 },
      items: {
        type: "array",
        minItems: 1,
        maxItems: 20,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            title: { type: "string", maxLength: 220 },
            order: { type: "integer", minimum: 1 },
          },
          required: ["title", "order"],
        },
      },
    },
    required: ["title", "items"],
  },
  [AI_ACTIONS.CREATE_EVENT_PROPOSAL]: {
    type: "object",
    additionalProperties: false,
    properties: {
      title: { type: "string", maxLength: 220 },
      description: optionalString,
      startsAt: { type: "string", maxLength: 16 },
      endsAt: optionalString,
      timezone: { type: "string", maxLength: 64 },
      recurrence: { enum: ["NONE", "DAILY", "WEEKLY", "MONTHLY"] },
    },
    required: [
      "title",
      "description",
      "startsAt",
      "endsAt",
      "timezone",
      "recurrence",
    ],
  },
  [AI_ACTIONS.CREATE_NOTE_PROPOSAL]: {
    type: "object",
    additionalProperties: false,
    properties: {
      title: { type: "string", maxLength: 220 },
      content: { type: "string", maxLength: 100000 },
    },
    required: ["title", "content"],
  },
  [AI_ACTIONS.UPDATE_NOTE_PROPOSAL]: {
    type: "object",
    additionalProperties: false,
    properties: {
      title: { type: "string", maxLength: 220 },
      content: { type: "string", maxLength: 100000 },
    },
    required: ["title", "content"],
  },
};

export function getStructuredOutputGuide(action: AIAction) {
  return guides[action];
}

export function getStructuredOutputSchema(action: AIAction) {
  return providerSchemas[action];
}
