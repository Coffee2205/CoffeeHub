import assert from "node:assert/strict";
import test from "node:test";
import { AI_ACTIONS, isAIAction } from "../src/features/ai/actions/ai-actions";
import {
  buildPlanningContext,
  limitContextRecords,
} from "../src/features/ai/context/context-builder";
import { AIError } from "../src/features/ai/errors/ai-error";
import { mapGoalProposalToGoalFormValues } from "../src/features/ai/mappers/proposal-mappers";
import { AI_ACTION_POLICY } from "../src/features/ai/policies/action-policy";
import { MockAIProvider } from "../src/features/ai/providers/mock.provider";
import { goalProposalSchema } from "../src/features/ai/schemas/proposal.schemas";

test("registers typed AI actions and confirmation policy", () => {
  assert.equal(isAIAction("create_goal_proposal"), true);
  assert.equal(isAIAction("delete_goal"), false);
  assert.deepEqual(AI_ACTION_POLICY[AI_ACTIONS.CREATE_GOAL_PROPOSAL], {
    requiresConfirmation: true,
    writesDatabase: true,
    allowed: true,
  });
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
