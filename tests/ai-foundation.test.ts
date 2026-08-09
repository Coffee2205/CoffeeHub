import assert from "node:assert/strict";
import test from "node:test";
import { AI_ACTIONS, isAIAction } from "../src/features/ai/actions/ai-actions";
import {
  buildPlanningContext,
  limitContextRecords,
} from "../src/features/ai/context/context-builder";
import { AIError } from "../src/features/ai/errors/ai-error";
import {
  mapAndValidateChecklistProposal,
  mapAndValidateEventProposal,
  mapAndValidateGoalProposal,
  mapAndValidateRoadmapProposal,
  mapAndValidateTaskProposal,
  mapAndValidateNoteProposal,
  mapGoalProposalToGoalFormValues,
} from "../src/features/ai/mappers/proposal-mappers";
import { AI_ACTION_POLICY } from "../src/features/ai/policies/action-policy";
import { MockAIProvider } from "../src/features/ai/providers/mock.provider";
import {
  checklistProposalSchema,
  eventProposalSchema,
  goalAnalysisSchema,
  goalProposalSchema,
  roadmapProposalSchema,
  taskProposalSchema,
  noteProposalSchema,
} from "../src/features/ai/schemas/proposal.schemas";
import { hashProposal } from "../src/features/ai/services/proposal-security";

test("registers typed AI actions and confirmation policy", () => {
  assert.equal(isAIAction("create_goal_proposal"), true);
  assert.equal(isAIAction("delete_goal"), false);
  assert.deepEqual(AI_ACTION_POLICY[AI_ACTIONS.CREATE_GOAL_PROPOSAL], {
    requiresConfirmation: true,
    writesDatabase: true,
    allowed: true,
  });
  assert.equal(
    AI_ACTION_POLICY[AI_ACTIONS.CREATE_EVENT_PROPOSAL].requiresConfirmation,
    true,
  );
  assert.equal(
    AI_ACTION_POLICY[AI_ACTIONS.UPDATE_NOTE_PROPOSAL].writesDatabase,
    true,
  );
});

test("mock provider returns a validated development proposal without network", async () => {
  const provider = new MockAIProvider();
  const result = await provider.generateStructured(
    {
      action: AI_ACTIONS.CREATE_GOAL_PROPOSAL,
      prompt: "Hoàn thiện CoffeeHub trong tám tuần",
    },
    goalProposalSchema,
  );
  assert.equal(result.metadata.provider, "mock");
  assert.equal(result.metadata.model, "mock-planner-v1");
  assert.equal(result.data.priority, "HIGH");
  assert.equal(result.usage.estimatedCost, 0);
});

test("mock provider analyzes a goal as validated read-only output", async () => {
  const provider = new MockAIProvider();
  const result = await provider.generateStructured(
    {
      action: AI_ACTIONS.ANALYZE_GOAL,
      prompt: "Hoàn thiện CoffeeHub trong tám tuần",
    },
    goalAnalysisSchema,
  );
  assert.equal(result.data.objective, "Hoàn thiện CoffeeHub trong tám tuần");
  assert.equal(result.data.clarifyingQuestions.length, 2);
  assert.equal(result.metadata.provider, "mock");
});

test("proposal mapper strips AI-only fields and prepares Goal form values", () => {
  const proposal = goalProposalSchema.parse({
    title: "Ship CoffeeHub",
    priority: "HIGH",
    targetDate: "2026-12-31",
    successCriteria: ["Build passes"],
    assumptions: ["Mock only"],
    risks: ["Scope"],
  });
  assert.deepEqual(mapGoalProposalToGoalFormValues(proposal), {
    title: "Ship CoffeeHub",
    description: "",
    status: "DRAFT",
    priority: "HIGH",
    deadline: "2026-12-31",
    successCriteria: "Build passes",
  });
});

test("Goal proposal maps through the existing Goal form schema", () => {
  const proposal = goalProposalSchema.parse({
    title: "Ship CoffeeHub",
    priority: "HIGH",
    targetDate: "2026-12-31",
    successCriteria: ["Build passes"],
    assumptions: [],
    risks: [],
  });
  assert.equal(mapAndValidateGoalProposal(proposal).status, "DRAFT");
});

test("Goal proposal schema rejects invalid dates and oversized criteria", () => {
  assert.throws(
    () =>
      goalProposalSchema.parse({
        title: "Ship CoffeeHub",
        priority: "HIGH",
        targetDate: "next Friday",
        successCriteria: ["x".repeat(241)],
        assumptions: [],
        risks: [],
      }),
    (error) => error instanceof AIError,
  );
});

test("Roadmap proposal maps through existing Roadmap and Milestone schemas", () => {
  const proposal = roadmapProposalSchema.parse({
    title: "Ship CoffeeHub",
    description: "Ordered delivery plan",
    estimatedDurationDays: 30,
    stages: [
      {
        title: "Foundation",
        description: "Confirm scope",
        order: 1,
        estimatedDays: 7,
        tasks: [],
      },
    ],
  });
  const values = mapAndValidateRoadmapProposal(proposal);
  assert.equal(values.stages[0]?.position, 0);
  assert.equal(values.stages[0]?.taskCount, 0);
});

test("Roadmap proposal rejects non-sequential stage order and invalid duration", () => {
  assert.throws(
    () =>
      roadmapProposalSchema.parse({
        title: "Ship CoffeeHub",
        estimatedDurationDays: -1,
        stages: [{ title: "Foundation", order: 2, tasks: [] }],
      }),
    (error) => error instanceof AIError,
  );
});

test("Task proposal maps through the existing Task form schema without relation IDs", () => {
  const proposal = taskProposalSchema.parse({
    title: "Verify CoffeeHub release",
    description: "Run the release checks",
    priority: "HIGH",
    estimatedMinutes: 90,
    dueDate: "2026-12-31",
    roadmapStageReference: "Quality assurance",
  });
  const values = mapAndValidateTaskProposal(proposal);
  assert.equal(values.status, "TODO");
  assert.equal(values.roadmapStageId, "");
  assert.equal(values.estimatedMinutes, 90);
});

test("Task proposal rejects invalid date, estimate and oversized stage reference", () => {
  assert.throws(
    () =>
      taskProposalSchema.parse({
        title: "Verify CoffeeHub release",
        priority: "HIGH",
        estimatedMinutes: 0,
        dueDate: "tomorrow",
        roadmapStageReference: "x".repeat(181),
      }),
    (error) => error instanceof AIError,
  );
});

test("Checklist proposal maps through Checklist and item feature schemas", () => {
  const proposal = checklistProposalSchema.parse({
    title: "Release checklist",
    items: [
      { title: "Run tests", order: 1 },
      { title: "Verify build", order: 2 },
    ],
  });
  const values = mapAndValidateChecklistProposal(proposal);
  assert.equal(values.items.length, 2);
  assert.equal(values.items[1]?.position, 1);
  assert.equal(values.goalId, "");
});

test("Checklist proposal rejects empty and non-sequential item order", () => {
  assert.throws(
    () =>
      checklistProposalSchema.parse({
        title: "Release checklist",
        items: [{ title: "Run tests", order: 2 }],
      }),
    (error) => error instanceof AIError,
  );
});

test("proposal confirmation hash changes after an owner edit", () => {
  const original = { title: "Original", items: [{ title: "One", order: 1 }] };
  const edited = { ...original, title: "Edited" };
  assert.notEqual(hashProposal(original), hashProposal(edited));
  assert.equal(hashProposal(original), hashProposal(original));
});

test("Event proposal maps through Calendar timezone and relation validation", () => {
  const proposal = eventProposalSchema.parse({
    title: "Planning block",
    startsAt: "2026-12-31T09:00",
    endsAt: "2026-12-31T10:00",
    timezone: "Asia/Ho_Chi_Minh",
    recurrence: "WEEKLY",
  });
  const values = mapAndValidateEventProposal(proposal);
  assert.equal(values.recurrence, "WEEKLY");
  assert.equal(values.goalId, null);
  assert.ok(values.startsAt < values.endsAt!);
});

test("Event proposal rejects invalid timezone or time range", () => {
  assert.throws(
    () =>
      mapAndValidateEventProposal(
        eventProposalSchema.parse({
          title: "Invalid event",
          startsAt: "2026-12-31T10:00",
          endsAt: "2026-12-31T09:00",
          timezone: "Not/AZone",
          recurrence: "NONE",
        }),
      ),
    (error) => error instanceof AIError,
  );
});

test("Note create/update proposal uses Note schema and version binding", () => {
  const create = mapAndValidateNoteProposal(
    noteProposalSchema.parse({ title: "Daily note", content: "Content" }),
  );
  const update = mapAndValidateNoteProposal(
    noteProposalSchema.parse({
      title: "Daily note updated",
      content: "New content",
      noteId: "550e8400-e29b-41d4-a716-446655440000",
      expectedVersion: 2,
    }),
  );
  assert.equal(create.noteId, undefined);
  assert.equal(update.expectedVersion, 2);
});

test("context builder applies an explicit budget and record limit", () => {
  const context = buildPlanningContext({
    timezone: "Asia/Ho_Chi_Minh",
    workspace: { activeGoalCount: 2, activeTaskCount: 4 },
  });
  assert.equal(context.tokenBudget, 8_000);
  assert.equal(
    limitContextRecords(Array.from({ length: 25 }, (_, index) => index)).length,
    20,
  );
});

test("mock provider exposes normalized retryable errors", async () => {
  await assert.rejects(
    () =>
      new MockAIProvider().generateStructured(
        {
          action: AI_ACTIONS.CREATE_GOAL_PROPOSAL,
          prompt: "valid prompt",
          simulateError: true,
        },
        goalProposalSchema,
      ),
    (error) =>
      error instanceof AIError &&
      error.code === "PROVIDER_UNAVAILABLE" &&
      error.retryable,
  );
});
