import { AIError } from "../errors/ai-error";
import type {
  PlanningCandidates,
  PlanningRelationship,
  PlanningSourceContext,
} from "../types/ai.types";

export function readPlanningContextSummary(
  value: unknown,
  conversationId: string,
): PlanningSourceContext | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  const context = value as Record<string, unknown>;
  if (context.kind !== "planning-context") return;
  return {
    conversationId,
    goalId: typeof context.goalId === "string" ? context.goalId : undefined,
    roadmapId:
      typeof context.roadmapId === "string" ? context.roadmapId : undefined,
    stageId: typeof context.stageId === "string" ? context.stageId : undefined,
    taskId: typeof context.taskId === "string" ? context.taskId : undefined,
  };
}

export function normalizePlanningText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function planningMatchScore(request: string, title: string) {
  const normalizedRequest = normalizePlanningText(request);
  const normalizedTitle = normalizePlanningText(title);
  if (!normalizedRequest || !normalizedTitle) return 0;
  if (normalizedRequest === normalizedTitle) return 1;
  if (normalizedRequest.includes(normalizedTitle)) return 0.95;
  const requestTokens = new Set(normalizedRequest.split(" "));
  const titleTokens = new Set(normalizedTitle.split(" "));
  const matches = [...titleTokens].filter((token) => requestTokens.has(token));
  return matches.length / Math.max(titleTokens.size, 1);
}

export function rankPlanningCandidates<T extends { title: string }>(
  request: string,
  candidates: T[],
  limit: number,
) {
  return candidates
    .map((candidate) => ({
      candidate,
      score: planningMatchScore(request, candidate.title),
    }))
    .filter(({ score }) => score >= 0.34)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
}

export function validateRelationshipHierarchy(
  relationship: PlanningRelationship,
  candidates: PlanningCandidates,
) {
  if (
    ![
      "CREATE_NEW",
      "LINK_EXISTING",
      "EXTEND_EXISTING",
      "UPDATE_EXISTING",
    ].includes(relationship.action) ||
    !["HIGH", "MEDIUM", "LOW"].includes(relationship.confidence)
  )
    throw new AIError(
      "RELATIONSHIP_CONFLICT",
      "Relationship intent không hợp lệ.",
    );
  if (relationship.action === "CREATE_NEW")
    return {
      action: relationship.action,
      confidence: relationship.confidence,
      ambiguous: false,
    } satisfies PlanningRelationship;

  const goal = relationship.goalId
    ? candidates.goals.find((item) => item.id === relationship.goalId)
    : undefined;
  const roadmap = relationship.roadmapId
    ? candidates.roadmaps.find((item) => item.id === relationship.roadmapId)
    : undefined;
  const stage = relationship.stageId
    ? candidates.stages.find((item) => item.id === relationship.stageId)
    : undefined;
  const task = relationship.taskId
    ? candidates.tasks.find((item) => item.id === relationship.taskId)
    : undefined;
  if (
    (relationship.goalId && !goal) ||
    (relationship.roadmapId && !roadmap) ||
    (relationship.stageId && !stage) ||
    (relationship.taskId && !task) ||
    (roadmap &&
      relationship.goalId &&
      roadmap.goalId !== relationship.goalId) ||
    (stage &&
      relationship.roadmapId &&
      stage.roadmapId !== relationship.roadmapId) ||
    (stage && relationship.goalId && stage.goalId !== relationship.goalId)
  )
    throw new AIError(
      "RELATIONSHIP_CONFLICT",
      "Quan hệ Goal, Roadmap, Stage hoặc Task không hợp lệ.",
    );
  return Object.fromEntries(
    Object.entries(relationship).filter(([, value]) => value !== undefined),
  ) as PlanningRelationship;
}
