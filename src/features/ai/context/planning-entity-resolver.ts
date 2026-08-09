import "server-only";

import { getPrisma } from "@/lib/prisma";
import { AI_ACTIONS, type AIAction } from "../actions/ai-actions";
import type {
  PlanningCandidates,
  PlanningRelationship,
  PlanningSourceContext,
} from "../types/ai.types";
import {
  readPlanningContextSummary,
  rankPlanningCandidates,
  validateRelationshipHierarchy,
} from "./planning-relationship";

const LIMITS = { goals: 10, roadmaps: 10, stages: 20, tasks: 30 } as const;

export async function resolvePlanningEntities(input: {
  userId: string;
  action: AIAction;
  request: string;
  sourceContext?: PlanningSourceContext;
}) {
  const conversationContext = input.sourceContext?.conversationId
    ? await resolveConversationPlanningContext(
        input.userId,
        input.sourceContext.conversationId,
      )
    : {};
  const sourceContext = Object.fromEntries(
    Object.entries({ ...conversationContext, ...input.sourceContext }).filter(
      ([, value]) => value !== undefined,
    ),
  ) as PlanningSourceContext;
  const candidates = await loadPlanningCandidates(input.userId);
  const explicitCandidates = await loadExplicitCandidates(
    input.userId,
    sourceContext,
  );
  candidates.goals = includeExplicit(candidates.goals, explicitCandidates.goal);
  candidates.roadmaps = includeExplicit(
    candidates.roadmaps,
    explicitCandidates.roadmap,
  );
  candidates.stages = includeExplicit(
    candidates.stages,
    explicitCandidates.stage,
  );
  candidates.tasks = includeExplicit(candidates.tasks, explicitCandidates.task);
  const explicit = resolveExplicitContext(candidates, sourceContext);
  const rankedGoals = rankPlanningCandidates(
    input.request,
    candidates.goals,
    LIMITS.goals,
  );
  const rankedRoadmaps = rankPlanningCandidates(
    input.request,
    candidates.roadmaps,
    LIMITS.roadmaps,
  );
  const rankedStages = rankPlanningCandidates(
    input.request,
    candidates.stages,
    LIMITS.stages,
  );
  const rankedTasks = rankPlanningCandidates(
    input.request,
    candidates.tasks,
    LIMITS.tasks,
  );

  const relationship = recommendRelationship({
    action: input.action,
    explicit,
    goals: rankedGoals,
    roadmaps: rankedRoadmaps,
    stages: rankedStages,
    tasks: rankedTasks,
  });

  return {
    candidates: {
      goals: includeExplicit(
        rankedGoals.map(({ candidate }) => candidate),
        explicit.goal,
      ),
      roadmaps: includeExplicit(
        rankedRoadmaps.map(({ candidate }) => candidate),
        explicit.roadmap,
      ),
      stages: includeExplicit(
        rankedStages.map(({ candidate }) => candidate),
        explicit.stage,
      ),
      tasks: includeExplicit(
        rankedTasks.map(({ candidate }) => candidate),
        explicit.task,
      ),
    },
    relationship,
    sourceContext,
  };
}

export async function resolveConversationPlanningContext(
  userId: string,
  conversationId: string,
): Promise<PlanningSourceContext> {
  const prisma = getPrisma();
  const conversation = await prisma.aIConversation.findFirst({
    where: { id: conversationId, userId, archivedAt: null },
    select: { id: true },
  });
  if (!conversation) return {};
  const messages = await prisma.aIMessage.findMany({
    where: {
      userId,
      conversationId,
      conversation: { userId, archivedAt: null },
    },
    select: { contextSummary: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  for (const message of messages) {
    const context = readPlanningContextSummary(
      message.contextSummary,
      conversationId,
    );
    if (context) return context;
  }
  return { conversationId };
}

async function loadExplicitCandidates(
  userId: string,
  context?: PlanningSourceContext,
) {
  const prisma = getPrisma();
  const [goal, roadmap, stage, task] = await Promise.all([
    context?.goalId
      ? prisma.goal.findFirst({
          where: { id: context.goalId, userId, deletedAt: null },
          select: { id: true, title: true, status: true },
        })
      : null,
    context?.roadmapId
      ? prisma.roadmap.findFirst({
          where: { id: context.roadmapId, userId, deletedAt: null },
          select: { id: true, title: true, goalId: true },
        })
      : null,
    context?.stageId
      ? prisma.roadmapStage.findFirst({
          where: { id: context.stageId, userId, deletedAt: null },
          select: {
            id: true,
            title: true,
            roadmapId: true,
            roadmap: { select: { goalId: true } },
          },
        })
      : null,
    context?.taskId
      ? prisma.task.findFirst({
          where: { id: context.taskId, userId, deletedAt: null },
          select: {
            id: true,
            title: true,
            status: true,
            goalId: true,
            roadmapId: true,
            roadmapStageId: true,
          },
        })
      : null,
  ]);
  return {
    goal: goal ? { ...goal, progress: 0 } : undefined,
    roadmap: roadmap ?? undefined,
    stage: stage
      ? {
          id: stage.id,
          title: stage.title,
          roadmapId: stage.roadmapId,
          goalId: stage.roadmap.goalId,
        }
      : undefined,
    task: task ?? undefined,
  };
}

function includeExplicit<T extends { id: string }>(items: T[], explicit?: T) {
  return explicit && !items.some((item) => item.id === explicit.id)
    ? [explicit, ...items]
    : items;
}

export async function loadPlanningCandidates(
  userId: string,
): Promise<PlanningCandidates> {
  const prisma = getPrisma();
  const [goals, roadmaps, stages, tasks] = await Promise.all([
    prisma.goal.findMany({
      where: { userId, deletedAt: null },
      select: {
        id: true,
        title: true,
        status: true,
        tasks: {
          where: { deletedAt: null, status: { not: "CANCELLED" } },
          select: { status: true },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: LIMITS.goals,
    }),
    prisma.roadmap.findMany({
      where: { userId, deletedAt: null },
      select: { id: true, title: true, goalId: true },
      orderBy: { updatedAt: "desc" },
      take: LIMITS.roadmaps,
    }),
    prisma.roadmapStage.findMany({
      where: { userId, deletedAt: null, roadmap: { deletedAt: null } },
      select: {
        id: true,
        title: true,
        roadmapId: true,
        roadmap: { select: { goalId: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: LIMITS.stages,
    }),
    prisma.task.findMany({
      where: { userId, deletedAt: null, status: { not: "CANCELLED" } },
      select: {
        id: true,
        title: true,
        status: true,
        goalId: true,
        roadmapId: true,
        roadmapStageId: true,
      },
      orderBy: { updatedAt: "desc" },
      take: LIMITS.tasks,
    }),
  ]);
  return {
    goals: goals.map((goal) => {
      const active = goal.tasks.filter((task) => task.status !== "CANCELLED");
      const completed = active.filter(
        (task) => task.status === "COMPLETED",
      ).length;
      return {
        id: goal.id,
        title: goal.title,
        status: goal.status,
        progress: active.length
          ? Math.round((completed / active.length) * 100)
          : 0,
      };
    }),
    roadmaps,
    stages: stages.map((stage) => ({
      id: stage.id,
      title: stage.title,
      roadmapId: stage.roadmapId,
      goalId: stage.roadmap.goalId,
    })),
    tasks,
  };
}

function resolveExplicitContext(
  candidates: PlanningCandidates,
  context?: PlanningSourceContext,
) {
  if (!context) return {};
  const goal = candidates.goals.find((item) => item.id === context.goalId);
  const roadmap = candidates.roadmaps.find(
    (item) => item.id === context.roadmapId,
  );
  const stage = candidates.stages.find((item) => item.id === context.stageId);
  const task = candidates.tasks.find((item) => item.id === context.taskId);
  return { goal, roadmap, stage, task };
}

function recommendRelationship(input: {
  action: AIAction;
  explicit: ReturnType<typeof resolveExplicitContext>;
  goals: ReturnType<
    typeof rankPlanningCandidates<PlanningCandidates["goals"][number]>
  >;
  roadmaps: ReturnType<
    typeof rankPlanningCandidates<PlanningCandidates["roadmaps"][number]>
  >;
  stages: ReturnType<
    typeof rankPlanningCandidates<PlanningCandidates["stages"][number]>
  >;
  tasks: ReturnType<
    typeof rankPlanningCandidates<PlanningCandidates["tasks"][number]>
  >;
}): PlanningRelationship {
  const explicit = input.explicit;
  const bestGoal = explicit.goal ?? input.goals[0]?.candidate;
  const bestRoadmap = explicit.roadmap ?? input.roadmaps[0]?.candidate;
  const bestStage = explicit.stage ?? input.stages[0]?.candidate;
  const bestTask = explicit.task ?? input.tasks[0]?.candidate;
  const ambiguity = (items: Array<{ score: number }>) =>
    items.length > 1 && items[0].score - items[1].score < 0.15;
  const explicitMatch = Boolean(
    explicit.goal || explicit.roadmap || explicit.stage || explicit.task,
  );

  if (input.action === AI_ACTIONS.CREATE_GOAL_PROPOSAL && bestGoal)
    return {
      action: "LINK_EXISTING",
      confidence: explicitMatch || !ambiguity(input.goals) ? "HIGH" : "LOW",
      goalId: bestGoal.id,
      ambiguous: !explicitMatch && ambiguity(input.goals),
    };
  if (input.action === AI_ACTIONS.CREATE_ROADMAP_PROPOSAL) {
    if (bestRoadmap)
      return {
        action: "EXTEND_EXISTING",
        confidence:
          explicitMatch || !ambiguity(input.roadmaps) ? "HIGH" : "LOW",
        goalId: bestRoadmap.goalId,
        roadmapId: bestRoadmap.id,
        ambiguous: !explicitMatch && ambiguity(input.roadmaps),
      };
    if (bestGoal)
      return {
        action: "LINK_EXISTING",
        confidence: explicitMatch || !ambiguity(input.goals) ? "HIGH" : "LOW",
        goalId: bestGoal.id,
        ambiguous: !explicitMatch && ambiguity(input.goals),
      };
  }
  if (
    input.action === AI_ACTIONS.CREATE_TASK_PROPOSAL &&
    (bestStage || bestRoadmap || bestGoal)
  )
    return {
      action: "LINK_EXISTING",
      confidence: explicitMatch ? "HIGH" : "MEDIUM",
      goalId: bestStage?.goalId ?? bestRoadmap?.goalId ?? bestGoal?.id,
      roadmapId: bestStage?.roadmapId ?? bestRoadmap?.id,
      stageId: bestStage?.id,
      ambiguous:
        !explicitMatch &&
        ambiguity(
          input.stages.length
            ? input.stages
            : input.roadmaps.length
              ? input.roadmaps
              : input.goals,
        ),
    };
  if (input.action === AI_ACTIONS.CREATE_CHECKLIST_PROPOSAL && bestTask)
    return {
      action: "LINK_EXISTING",
      confidence: explicitMatch || !ambiguity(input.tasks) ? "HIGH" : "LOW",
      taskId: bestTask.id,
      ambiguous: !explicitMatch && ambiguity(input.tasks),
    };
  return { action: "CREATE_NEW", confidence: "LOW", ambiguous: false };
}

export async function validatePlanningRelationship(
  userId: string,
  relationship: PlanningRelationship,
) {
  const prisma = getPrisma();
  const [goal, roadmap, stage, task] = await Promise.all([
    relationship.goalId
      ? prisma.goal.findFirst({
          where: { id: relationship.goalId, userId, deletedAt: null },
          select: { id: true, title: true, status: true },
        })
      : null,
    relationship.roadmapId
      ? prisma.roadmap.findFirst({
          where: { id: relationship.roadmapId, userId, deletedAt: null },
          select: { id: true, title: true, goalId: true },
        })
      : null,
    relationship.stageId
      ? prisma.roadmapStage.findFirst({
          where: { id: relationship.stageId, userId, deletedAt: null },
          select: {
            id: true,
            title: true,
            roadmapId: true,
            roadmap: { select: { goalId: true } },
          },
        })
      : null,
    relationship.taskId
      ? prisma.task.findFirst({
          where: { id: relationship.taskId, userId, deletedAt: null },
          select: {
            id: true,
            title: true,
            status: true,
            goalId: true,
            roadmapId: true,
            roadmapStageId: true,
          },
        })
      : null,
  ]);
  const candidates: PlanningCandidates = {
    goals: goal ? [{ ...goal, progress: 0 }] : [],
    roadmaps: roadmap ? [roadmap] : [],
    stages: stage
      ? [
          {
            id: stage.id,
            title: stage.title,
            roadmapId: stage.roadmapId,
            goalId: stage.roadmap.goalId,
          },
        ]
      : [],
    tasks: task ? [task] : [],
  };
  return validateRelationshipHierarchy(relationship, candidates);
}
