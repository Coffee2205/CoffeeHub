import type {
  GoalProposal,
  RoadmapProposal,
  TaskProposal,
} from "../types/ai.types";
import { AIError } from "../errors/ai-error";
import { parseGoalForm } from "@/features/goals/goal.schema";
import {
  parseRoadmapForm,
  parseStageForm,
} from "@/features/roadmaps/roadmap.schema";
export type GoalFormValues = {
  title: string;
  description: string;
  status: "DRAFT";
  priority: GoalProposal["priority"];
  deadline: string;
  successCriteria: string;
};
export function mapGoalProposalToGoalFormValues(
  proposal: GoalProposal,
): GoalFormValues {
  return {
    title: proposal.title,
    description: proposal.description ?? "",
    status: "DRAFT",
    priority: proposal.priority,
    deadline: proposal.targetDate ?? "",
    successCriteria: proposal.successCriteria.join("\n"),
  };
}

export function mapAndValidateGoalProposal(proposal: GoalProposal) {
  const values = mapGoalProposalToGoalFormValues(proposal);
  const form = new FormData();
  Object.entries(values).forEach(([key, value]) => form.set(key, value));
  const parsed = parseGoalForm(form);
  if (!parsed.data)
    throw new AIError(
      "SCHEMA_VALIDATION_ERROR",
      `Goal proposal không khớp form nghiệp vụ: ${parsed.errors.join(" ")}`,
    );
  return values;
}
export type RoadmapFormValues = {
  title: string;
  description: string;
  estimatedDurationDays?: number;
  stages: Array<{
    title: string;
    description: string;
    position: number;
    estimatedDays?: number;
    taskCount: number;
  }>;
};
export function mapRoadmapProposalToFormValues(
  proposal: RoadmapProposal,
): RoadmapFormValues {
  return {
    title: proposal.title,
    description: proposal.description ?? "",
    estimatedDurationDays: proposal.estimatedDurationDays,
    stages: proposal.stages.map((stage) => ({
      title: stage.title,
      description: stage.description ?? "",
      position: stage.order - 1,
      estimatedDays: stage.estimatedDays,
      taskCount: stage.tasks.length,
    })),
  };
}

export function mapAndValidateRoadmapProposal(proposal: RoadmapProposal) {
  const values = mapRoadmapProposalToFormValues(proposal);
  const roadmapForm = new FormData();
  roadmapForm.set("title", values.title);
  roadmapForm.set("description", values.description);
  const roadmap = parseRoadmapForm(roadmapForm);
  const stageErrors = values.stages.flatMap((stage) => {
    const stageForm = new FormData();
    stageForm.set("title", stage.title);
    stageForm.set("description", stage.description);
    return parseStageForm(stageForm).errors;
  });
  const errors = [...roadmap.errors, ...stageErrors];
  if (!roadmap.data || errors.length)
    throw new AIError(
      "SCHEMA_VALIDATION_ERROR",
      `Roadmap proposal không khớp form nghiệp vụ: ${errors.join(" ")}`,
    );
  return values;
}
export function mapTaskProposalToFormValues(proposal: TaskProposal) {
  return {
    title: proposal.title,
    description: proposal.description ?? "",
    priority: proposal.priority,
    dueAt: proposal.dueDate ?? "",
    estimatedMinutes: proposal.estimatedMinutes ?? null,
  };
}
