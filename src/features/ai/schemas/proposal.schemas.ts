import { AIError } from "../errors/ai-error";
import type {
  ChecklistProposal,
  DailyPlanProposal,
  GoalAnalysis,
  GoalProposal,
  GoalReviewProposal,
  RoadmapProposal,
  RuntimeSchema,
  TaskProposal,
  WeeklyPlanProposal,
} from "../types/ai.types";

const record = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new AIError(
      "SCHEMA_VALIDATION_ERROR",
      "Proposal không phải object hợp lệ.",
    );
  return value as Record<string, unknown>;
};
const text = (value: unknown, field: string, max = 5000) => {
  if (typeof value !== "string" || !value.trim() || value.length > max)
    throw new AIError("SCHEMA_VALIDATION_ERROR", `${field} không hợp lệ.`);
  return value.trim();
};
const optionalText = (value: unknown, field: string) =>
  value === undefined || value === null || value === ""
    ? undefined
    : text(value, field);
const optionalBoundedText = (value: unknown, field: string, max: number) =>
  value === undefined || value === null || value === ""
    ? undefined
    : text(value, field, max);
const strings = (value: unknown, field: string) => {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string"))
    throw new AIError("SCHEMA_VALIDATION_ERROR", `${field} không hợp lệ.`);
  return value.map((item) => item.trim()).filter(Boolean);
};
const boundedStrings = (
  value: unknown,
  field: string,
  maximumItems: number,
  maximumLength: number,
) => {
  const items = strings(value, field);
  if (
    items.length > maximumItems ||
    items.some((item) => item.length > maximumLength)
  )
    throw new AIError("SCHEMA_VALIDATION_ERROR", `${field} không hợp lệ.`);
  return items;
};
const optionalDate = (value: unknown, field: string) => {
  const result = optionalText(value, field);
  if (result && !/^\d{4}-\d{2}-\d{2}$/.test(result))
    throw new AIError("SCHEMA_VALIDATION_ERROR", `${field} không hợp lệ.`);
  return result;
};
const optionalPositiveInteger = (value: unknown, field: string) => {
  if (value === undefined || value === null) return undefined;
  if (!Number.isInteger(value) || Number(value) <= 0)
    throw new AIError("SCHEMA_VALIDATION_ERROR", `${field} không hợp lệ.`);
  return Number(value);
};
const priority = (value: unknown): GoalProposal["priority"] => {
  if (
    !(["LOW", "MEDIUM", "HIGH", "URGENT"] as const).includes(
      value as GoalProposal["priority"],
    )
  )
    throw new AIError("SCHEMA_VALIDATION_ERROR", "Priority không hợp lệ.");
  return value as GoalProposal["priority"];
};

export const goalAnalysisSchema: RuntimeSchema<GoalAnalysis> = {
  parse(value) {
    const item = record(value);
    return {
      summary: text(item.summary, "summary"),
      objective: text(item.objective, "objective"),
      constraints: strings(item.constraints, "constraints"),
      successCriteria: strings(item.successCriteria, "successCriteria"),
      assumptions: strings(item.assumptions, "assumptions"),
      risks: strings(item.risks, "risks"),
      clarifyingQuestions: strings(
        item.clarifyingQuestions,
        "clarifyingQuestions",
      ),
      recommendedNextSteps: strings(
        item.recommendedNextSteps,
        "recommendedNextSteps",
      ),
    };
  },
};

export const goalProposalSchema: RuntimeSchema<GoalProposal> = {
  parse(value) {
    const item = record(value);
    return {
      title: text(item.title, "title", 180),
      description: optionalText(item.description, "description"),
      priority: priority(item.priority),
      startDate: optionalDate(item.startDate, "startDate"),
      targetDate: optionalDate(item.targetDate, "targetDate"),
      successCriteria: boundedStrings(
        item.successCriteria,
        "successCriteria",
        20,
        240,
      ),
      assumptions: boundedStrings(item.assumptions, "assumptions", 20, 500),
      risks: boundedStrings(item.risks, "risks", 20, 500),
    };
  },
};
export const taskProposalSchema: RuntimeSchema<TaskProposal> = {
  parse(value) {
    const item = record(value);
    return {
      title: text(item.title, "title", 220),
      description: optionalBoundedText(item.description, "description", 5000),
      priority: priority(item.priority),
      estimatedMinutes: optionalPositiveInteger(
        item.estimatedMinutes,
        "estimatedMinutes",
      ),
      dueDate: optionalDate(item.dueDate, "dueDate"),
      roadmapStageReference: optionalBoundedText(
        item.roadmapStageReference,
        "roadmapStageReference",
        180,
      ),
    };
  },
};
export const roadmapProposalSchema: RuntimeSchema<RoadmapProposal> = {
  parse(value) {
    const item = record(value);
    if (
      !Array.isArray(item.stages) ||
      item.stages.length === 0 ||
      item.stages.length > 20
    )
      throw new AIError("SCHEMA_VALIDATION_ERROR", "stages không hợp lệ.");
    const stageOrders = item.stages.map((raw) => Number(record(raw).order));
    if (
      stageOrders.some((order) => !Number.isInteger(order) || order <= 0) ||
      new Set(stageOrders).size !== stageOrders.length ||
      ![...stageOrders]
        .sort((a, b) => a - b)
        .every((order, index) => order === index + 1)
    )
      throw new AIError("SCHEMA_VALIDATION_ERROR", "stage.order không hợp lệ.");
    return {
      title: text(item.title, "title", 180),
      description: optionalBoundedText(item.description, "description", 3000),
      estimatedDurationDays: optionalPositiveInteger(
        item.estimatedDurationDays,
        "estimatedDurationDays",
      ),
      stages: item.stages.map((raw) => {
        const stage = record(raw);
        if (!Array.isArray(stage.tasks) || stage.tasks.length > 50)
          throw new AIError(
            "SCHEMA_VALIDATION_ERROR",
            "stage.tasks không hợp lệ.",
          );
        return {
          title: text(stage.title, "stage.title", 180),
          description: optionalBoundedText(
            stage.description,
            "stage.description",
            3000,
          ),
          order: Number(stage.order),
          estimatedDays: optionalPositiveInteger(
            stage.estimatedDays,
            "stage.estimatedDays",
          ),
          tasks: stage.tasks.map((task) => taskProposalSchema.parse(task)),
        };
      }),
    };
  },
};
export const checklistProposalSchema: RuntimeSchema<ChecklistProposal> = {
  parse(value) {
    const item = record(value);
    if (
      !Array.isArray(item.items) ||
      item.items.length === 0 ||
      item.items.length > 100
    )
      throw new AIError("SCHEMA_VALIDATION_ERROR", "items không hợp lệ.");
    const orders = item.items.map((raw) => Number(record(raw).order));
    if (
      orders.some((order) => !Number.isInteger(order) || order <= 0) ||
      new Set(orders).size !== orders.length ||
      ![...orders]
        .sort((a, b) => a - b)
        .every((order, index) => order === index + 1)
    )
      throw new AIError("SCHEMA_VALIDATION_ERROR", "item.order không hợp lệ.");
    return {
      title: text(item.title, "title", 220),
      items: item.items.map((raw) => {
        const row = record(raw);
        return {
          title: text(row.title, "item.title", 220),
          order: Number(row.order),
        };
      }),
    };
  },
};
const plan = (value: unknown): DailyPlanProposal => {
  const item = record(value);
  const range = record(item.dateRange);
  if (!Array.isArray(item.timeBlocks))
    throw new AIError("SCHEMA_VALIDATION_ERROR", "timeBlocks không hợp lệ.");
  return {
    title: text(item.title, "title"),
    dateRange: {
      start: text(range.start, "dateRange.start"),
      end: text(range.end, "dateRange.end"),
    },
    timeBlocks: item.timeBlocks.map((raw) => {
      const block = record(raw);
      return {
        title: text(block.title, "timeBlock.title"),
        startsAt: text(block.startsAt, "startsAt"),
        endsAt: text(block.endsAt, "endsAt"),
        taskReference: optionalText(block.taskReference, "taskReference"),
      };
    }),
    assumptions: strings(item.assumptions, "assumptions"),
    warnings: strings(item.warnings, "warnings"),
  };
};
export const dailyPlanProposalSchema: RuntimeSchema<DailyPlanProposal> = {
  parse: plan,
};
export const weeklyPlanProposalSchema: RuntimeSchema<WeeklyPlanProposal> = {
  parse: plan,
};
export const goalReviewProposalSchema: RuntimeSchema<GoalReviewProposal> = {
  parse(value) {
    const item = record(value);
    return {
      summary: text(item.summary, "summary"),
      progress: Number(item.progress),
      wins: strings(item.wins, "wins"),
      risks: strings(item.risks, "risks"),
      nextActions: strings(item.nextActions, "nextActions"),
    };
  },
};
