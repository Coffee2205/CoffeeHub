import type {
  ChecklistProposal,
  EventProposal,
  GoalProposal,
  RoadmapProposal,
  TaskProposal,
  NoteProposal,
} from "../types/ai.types";
import { AIError } from "../errors/ai-error";
import { parseGoalForm } from "@/features/goals/goal.schema";
import {
  parseRoadmapForm,
  parseStageForm,
} from "@/features/roadmaps/roadmap.schema";
import { parseTaskForm } from "@/features/tasks/task.schema";
import { parseEventForm } from "@/features/calendar/event.schema";
import { parseNoteInput } from "@/features/notes/note.schema";
import {
  parseChecklistForm,
  parseChecklistItemForm,
} from "@/features/checklists/checklist.schema";
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
export type TaskFormValues = {
  title: string;
  description: string;
  status: "TODO";
  priority: TaskProposal["priority"];
  dueAt: string;
  goalId: "";
  roadmapId: "";
  roadmapStageId: "";
  estimatedMinutes?: number;
  roadmapStageReference?: string;
};
export function mapTaskProposalToFormValues(
  proposal: TaskProposal,
): TaskFormValues {
  return {
    title: proposal.title,
    description: proposal.description ?? "",
    status: "TODO",
    priority: proposal.priority,
    dueAt: proposal.dueDate ?? "",
    goalId: "",
    roadmapId: "",
    roadmapStageId: "",
    estimatedMinutes: proposal.estimatedMinutes,
    roadmapStageReference: proposal.roadmapStageReference,
  };
}

export function mapAndValidateTaskProposal(proposal: TaskProposal) {
  const values = mapTaskProposalToFormValues(proposal);
  const form = new FormData();
  form.set("title", values.title);
  form.set("description", values.description);
  form.set("status", values.status);
  form.set("priority", values.priority);
  form.set("dueAt", values.dueAt);
  form.set("goalId", values.goalId);
  form.set("roadmapId", values.roadmapId);
  form.set("roadmapStageId", values.roadmapStageId);
  const parsed = parseTaskForm(form);
  if (!parsed.data)
    throw new AIError(
      "SCHEMA_VALIDATION_ERROR",
      `Task proposal không khớp form nghiệp vụ: ${parsed.errors.join(" ")}`,
    );
  return values;
}

export type ChecklistFormValues = {
  title: string;
  description: "";
  goalId: "";
  roadmapId: "";
  taskId: "";
  items: Array<{ title: string; position: number }>;
};

export function mapAndValidateChecklistProposal(
  proposal: ChecklistProposal,
): ChecklistFormValues {
  const form = new FormData();
  form.set("title", proposal.title);
  const checklist = parseChecklistForm(form);
  const errors = proposal.items.flatMap((item) => {
    const itemForm = new FormData();
    itemForm.set("title", item.title);
    return parseChecklistItemForm(itemForm).errors;
  });
  if (!checklist.data || errors.length)
    throw new AIError(
      "SCHEMA_VALIDATION_ERROR",
      `Checklist proposal does not match feature form: ${[
        ...checklist.errors,
        ...errors,
      ].join(" ")}`,
    );
  return {
    title: proposal.title,
    description: "",
    goalId: "",
    roadmapId: "",
    taskId: "",
    items: proposal.items.map((item) => ({
      title: item.title,
      position: item.order - 1,
    })),
  };
}

export function mapAndValidateEventProposal(proposal: EventProposal) {
  const form = new FormData();
  Object.entries({
    ...proposal,
    description: proposal.description ?? "",
    endsAt: proposal.endsAt ?? "",
    goalId: "",
    taskId: "",
  }).forEach(([key, value]) => form.set(key, String(value)));
  const parsed = parseEventForm(form);
  if (!parsed.data)
    throw new AIError(
      "SCHEMA_VALIDATION_ERROR",
      `Event proposal không khớp form nghiệp vụ: ${parsed.errors.join(" ")}`,
    );
  return parsed.data;
}

export function mapAndValidateNoteProposal(proposal: NoteProposal) {
  const parsed = parseNoteInput({
    title: proposal.title,
    content: proposal.content,
  });
  if (!parsed.data)
    throw new AIError(
      "SCHEMA_VALIDATION_ERROR",
      `Note proposal không khớp schema nghiệp vụ: ${parsed.errors.join(" ")}`,
    );
  return {
    ...parsed.data,
    noteId: proposal.noteId,
    expectedVersion: proposal.expectedVersion,
  };
}
