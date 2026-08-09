import type {
  GoalProposal,
  RoadmapProposal,
  TaskProposal,
} from "../types/ai.types";
import { AIError } from "../errors/ai-error";
import { parseGoalForm } from "@/features/goals/goal.schema";
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
export function mapRoadmapProposalToFormValues(proposal: RoadmapProposal) {
  return {
    title: proposal.title,
    description: proposal.description ?? "",
    stages: proposal.stages.map((stage) => ({
      title: stage.title,
      description: stage.description ?? "",
      position: stage.order - 1,
    })),
  };
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
