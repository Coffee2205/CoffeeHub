import "server-only";

import { randomUUID } from "node:crypto";
import type { Prisma } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/prisma";
import { AI_ACTIONS, type AIAction } from "../actions/ai-actions";
import { AIError } from "../errors/ai-error";
import {
  mapAndValidateChecklistProposal,
  mapAndValidateEventProposal,
  mapAndValidateGoalProposal,
  mapAndValidateRoadmapProposal,
  mapAndValidateTaskProposal,
  mapAndValidateNoteProposal,
} from "../mappers/proposal-mappers";
import {
  checklistProposalSchema,
  eventProposalSchema,
  goalProposalSchema,
  roadmapProposalSchema,
  taskProposalSchema,
  noteProposalSchema,
} from "../schemas/proposal.schemas";
import type {
  ChecklistProposal,
  EventProposal,
  GoalProposal,
  RoadmapProposal,
  TaskProposal,
  NoteProposal,
} from "../types/ai.types";
import { hashProposal } from "./proposal-security";
import { validatePlanningRelationship } from "../context/planning-entity-resolver";
import type {
  PlanningRelationship,
  PlanningSourceContext,
} from "../types/ai.types";

type StoredPlanningProposal = {
  data: unknown;
  relationship: PlanningRelationship;
  sourceContext?: PlanningSourceContext;
};

function storedProposal(value: unknown): StoredPlanningProposal {
  if (
    value &&
    typeof value === "object" &&
    "data" in value &&
    "relationship" in value
  )
    return value as StoredPlanningProposal;
  return {
    data: value,
    relationship: { action: "CREATE_NEW", confidence: "LOW", ambiguous: false },
  };
}

type WritableAction =
  | typeof AI_ACTIONS.CREATE_GOAL_PROPOSAL
  | typeof AI_ACTIONS.CREATE_ROADMAP_PROPOSAL
  | typeof AI_ACTIONS.CREATE_TASK_PROPOSAL
  | typeof AI_ACTIONS.CREATE_CHECKLIST_PROPOSAL
  | typeof AI_ACTIONS.CREATE_EVENT_PROPOSAL
  | typeof AI_ACTIONS.CREATE_NOTE_PROPOSAL
  | typeof AI_ACTIONS.UPDATE_NOTE_PROPOSAL;

export function parseWritableProposal(action: AIAction, payload: unknown) {
  if (action === AI_ACTIONS.CREATE_GOAL_PROPOSAL) {
    const proposal = goalProposalSchema.parse(payload);
    mapAndValidateGoalProposal(proposal);
    return proposal;
  }
  if (action === AI_ACTIONS.CREATE_ROADMAP_PROPOSAL) {
    const proposal = roadmapProposalSchema.parse(payload);
    mapAndValidateRoadmapProposal(proposal);
    return proposal;
  }
  if (action === AI_ACTIONS.CREATE_TASK_PROPOSAL) {
    const proposal = taskProposalSchema.parse(payload);
    mapAndValidateTaskProposal(proposal);
    return proposal;
  }
  if (action === AI_ACTIONS.CREATE_CHECKLIST_PROPOSAL) {
    const proposal = checklistProposalSchema.parse(payload);
    mapAndValidateChecklistProposal(proposal);
    return proposal;
  }
  if (action === AI_ACTIONS.CREATE_EVENT_PROPOSAL) {
    const proposal = eventProposalSchema.parse(payload);
    mapAndValidateEventProposal(proposal);
    return proposal;
  }
  if (
    action === AI_ACTIONS.CREATE_NOTE_PROPOSAL ||
    action === AI_ACTIONS.UPDATE_NOTE_PROPOSAL
  ) {
    const proposal = noteProposalSchema.parse(payload);
    mapAndValidateNoteProposal(proposal);
    return proposal;
  }
  throw new AIError("ACTION_NOT_ALLOWED", "Action này không ghi dữ liệu.");
}

export async function createProposalDraft(
  userId: string,
  action: WritableAction,
  payload: unknown,
  relationship: PlanningRelationship,
  sourceContext?: PlanningSourceContext,
) {
  const parsed = parseWritableProposal(action, payload);
  await validatePlanningRelationship(userId, relationship);
  const stored = {
    data: parsed,
    relationship,
    ...(sourceContext && Object.keys(sourceContext).length
      ? { sourceContext }
      : {}),
  };
  const payloadHash = hashProposal(stored);
  const confirmationId = randomUUID();
  return getPrisma().$transaction(async (tx) => {
    const proposal = await tx.aIProposal.create({
      data: {
        userId,
        action,
        payload: stored as Prisma.InputJsonValue,
        payloadHash,
        confirmationId,
      },
    });
    await tx.aIActionLog.create({
      data: {
        userId,
        proposalId: proposal.id,
        action,
        status: "PROPOSED",
        payloadHash,
        confirmationId,
      },
    });
    return proposal;
  });
}

export async function updateProposalDraft(input: {
  userId: string;
  proposalId: string;
  version: number;
  confirmationId: string;
  payload: unknown;
  relationship: PlanningRelationship;
}) {
  const prisma = getPrisma();
  return prisma.$transaction(async (tx) => {
    const current = await tx.aIProposal.findFirst({
      where: {
        id: input.proposalId,
        userId: input.userId,
        status: "DRAFT",
        version: input.version,
        confirmationId: input.confirmationId,
      },
    });
    if (!current)
      throw new AIError(
        "CONFIRMATION_REQUIRED",
        "Proposal đã thay đổi hoặc không thuộc quyền sở hữu.",
      );
    const action = current.action as AIAction;
    const payload = parseWritableProposal(action, input.payload);
    const relationship = await validatePlanningRelationship(
      input.userId,
      input.relationship,
    );
    const previous = storedProposal(current.payload);
    const stored = {
      data: payload,
      relationship,
      ...(previous.sourceContext
        ? { sourceContext: previous.sourceContext }
        : {}),
    };
    const payloadHash = hashProposal(stored);
    const confirmationId = randomUUID();
    const proposal = await tx.aIProposal.update({
      where: { id: current.id },
      data: {
        payload: stored as Prisma.InputJsonValue,
        payloadHash,
        confirmationId,
        version: { increment: 1 },
      },
    });
    await tx.aIActionLog.create({
      data: {
        userId: input.userId,
        proposalId: current.id,
        action,
        status: "EDITED",
        payloadHash,
        confirmationId,
        details: { previousHash: current.payloadHash },
      },
    });
    return proposal;
  });
}

export async function discardProposalDraft(input: {
  userId: string;
  proposalId: string;
  version: number;
  confirmationId: string;
}) {
  return getPrisma().$transaction(async (tx) => {
    const current = await tx.aIProposal.findFirst({
      where: {
        id: input.proposalId,
        userId: input.userId,
        status: "DRAFT",
        version: input.version,
        confirmationId: input.confirmationId,
      },
    });
    if (!current)
      throw new AIError(
        "CONFIRMATION_REQUIRED",
        "Proposal không còn hiệu lực.",
      );
    await tx.aIProposal.update({
      where: { id: current.id },
      data: { status: "DISCARDED", version: { increment: 1 } },
    });
    await tx.aIActionLog.create({
      data: {
        userId: input.userId,
        proposalId: current.id,
        action: current.action,
        status: "DISCARDED",
        payloadHash: current.payloadHash,
        confirmationId: current.confirmationId,
      },
    });
  });
}

type CommitResult = {
  links: Array<{ label: string; href: string }>;
  activeContext?: PlanningSourceContext;
};

export async function commitProposal(input: {
  userId: string;
  proposalId: string;
  version: number;
  confirmationId: string;
  payloadHash: string;
}): Promise<CommitResult> {
  try {
    return await commitProposalOnce(input);
  } catch (error) {
    const proposal = await getPrisma().aIProposal.findFirst({
      where: { id: input.proposalId, userId: input.userId },
    });
    if (proposal)
      await getPrisma().aIActionLog.create({
        data: {
          userId: input.userId,
          proposalId: proposal.id,
          action: proposal.action,
          status: "FAILED",
          payloadHash: proposal.payloadHash,
          confirmationId: input.confirmationId,
          details: { reason: "Commit validation or transaction failed" },
        },
      });
    throw error;
  }
}

async function commitProposalOnce(input: {
  userId: string;
  proposalId: string;
  version: number;
  confirmationId: string;
  payloadHash: string;
}): Promise<CommitResult> {
  return getPrisma().$transaction(async (tx) => {
    const current = await tx.aIProposal.findFirst({
      where: { id: input.proposalId, userId: input.userId },
    });
    if (!current)
      throw new AIError("CONFIRMATION_REQUIRED", "Không tìm thấy proposal.");
    if (current.status === "COMMITTED") {
      if (current.confirmationId !== input.confirmationId)
        throw new AIError("CONFIRMATION_REQUIRED", "Xác nhận đã hết hiệu lực.");
      return current.result as CommitResult;
    }
    if (
      current.status !== "DRAFT" ||
      current.version !== input.version ||
      current.confirmationId !== input.confirmationId ||
      current.payloadHash !== input.payloadHash
    )
      throw new AIError(
        "CONFIRMATION_REQUIRED",
        "Proposal đã bị chỉnh sửa; hãy lưu và xác nhận lại.",
      );
    const claimed = await tx.aIProposal.updateMany({
      where: {
        id: current.id,
        userId: input.userId,
        status: "DRAFT",
        version: input.version,
        confirmationId: input.confirmationId,
        payloadHash: input.payloadHash,
      },
      data: { status: "COMMITTED" },
    });
    if (claimed.count !== 1) {
      const committed = await tx.aIProposal.findFirst({
        where: {
          id: current.id,
          userId: input.userId,
          status: "COMMITTED",
          confirmationId: input.confirmationId,
        },
      });
      if (committed?.result) return committed.result as CommitResult;
      throw new AIError("CONFIRMATION_REQUIRED", "Xác nhận đã được sử dụng.");
    }
    const action = current.action as AIAction;
    const stored = storedProposal(current.payload);
    const relationship = await validatePlanningRelationship(
      input.userId,
      stored.relationship,
    );
    if (relationship.ambiguous)
      throw new AIError(
        "RELATIONSHIP_CONFLICT",
        "Có nhiều parent phù hợp; hãy chọn rõ relationship trước khi xác nhận.",
      );
    const payload = parseWritableProposal(action, stored.data);
    const result = await commitDomainProposal(
      tx,
      input.userId,
      action,
      payload,
      relationship,
    );
    if (stored.sourceContext?.conversationId && result.activeContext)
      await tx.aIMessage.create({
        data: {
          userId: input.userId,
          conversationId: stored.sourceContext.conversationId,
          role: "SYSTEM",
          content: "Planning context updated after confirmed proposal.",
          contextSummary: {
            kind: "planning-context",
            ...result.activeContext,
          },
        },
      });
    await tx.aIProposal.update({
      where: { id: current.id },
      data: {
        result: result as Prisma.InputJsonValue,
        committedAt: new Date(),
        version: { increment: 1 },
      },
    });
    await tx.aIActionLog.create({
      data: {
        userId: input.userId,
        proposalId: current.id,
        action,
        status: "COMMITTED",
        payloadHash: current.payloadHash,
        confirmationId: current.confirmationId,
        details: result as Prisma.InputJsonValue,
      },
    });
    return result;
  });
}

async function commitDomainProposal(
  tx: Prisma.TransactionClient,
  userId: string,
  action: AIAction,
  payload:
    | GoalProposal
    | RoadmapProposal
    | TaskProposal
    | ChecklistProposal
    | EventProposal
    | NoteProposal,
  relationship: PlanningRelationship,
): Promise<CommitResult> {
  if (action === AI_ACTIONS.CREATE_GOAL_PROPOSAL) {
    if (relationship.action === "LINK_EXISTING" && relationship.goalId)
      return {
        links: [
          {
            label: "Mở Goal hiện có",
            href: `/app/goals/${relationship.goalId}`,
          },
        ],
        activeContext: { goalId: relationship.goalId },
      };
    const values = mapAndValidateGoalProposal(payload as GoalProposal);
    const goal = await tx.goal.create({
      data: {
        userId,
        title: values.title,
        description: values.description || null,
        status: values.status,
        priority: values.priority,
        deadline: values.deadline
          ? new Date(`${values.deadline}T23:59:59.999Z`)
          : null,
        successCriteria: (payload as GoalProposal)
          .successCriteria as Prisma.InputJsonValue,
      },
    });
    return {
      links: [{ label: "Mở Goal", href: `/app/goals/${goal.id}` }],
      activeContext: { goalId: goal.id },
    };
  }
  if (action === AI_ACTIONS.CREATE_ROADMAP_PROPOSAL) {
    const proposal = payload as RoadmapProposal;
    mapAndValidateRoadmapProposal(proposal);
    if (relationship.action === "EXTEND_EXISTING" && relationship.roadmapId) {
      const roadmap = await tx.roadmap.findFirst({
        where: {
          id: relationship.roadmapId,
          userId,
          deletedAt: null,
          ...(relationship.goalId ? { goalId: relationship.goalId } : {}),
        },
        select: {
          id: true,
          goalId: true,
          stages: {
            where: { deletedAt: null },
            select: { title: true, position: true },
          },
        },
      });
      if (!roadmap)
        throw new AIError(
          "RELATIONSHIP_CONFLICT",
          "Roadmap cần mở rộng không còn hợp lệ.",
        );
      const existingTitles = new Set(
        roadmap.stages.map((stage) => stage.title.trim().toLowerCase()),
      );
      if (
        proposal.stages.some((stage) =>
          existingTitles.has(stage.title.trim().toLowerCase()),
        )
      )
        throw new AIError(
          "RELATIONSHIP_CONFLICT",
          "Proposal chứa Stage trùng với Roadmap hiện có.",
        );
      let nextPosition =
        Math.max(-1, ...roadmap.stages.map((stage) => stage.position)) + 1;
      for (const stageProposal of proposal.stages) {
        const stage = await tx.roadmapStage.create({
          data: {
            userId,
            roadmapId: roadmap.id,
            title: stageProposal.title,
            description: stageProposal.description ?? null,
            position: nextPosition++,
          },
        });
        for (
          let position = 0;
          position < stageProposal.tasks.length;
          position++
        ) {
          const task = stageProposal.tasks[position];
          mapAndValidateTaskProposal(task);
          await tx.task.create({
            data: {
              userId,
              goalId: roadmap.goalId,
              roadmapId: roadmap.id,
              roadmapStageId: stage.id,
              title: task.title,
              description: task.description ?? null,
              status: "TODO",
              priority: task.priority,
              dueAt: task.dueDate
                ? new Date(`${task.dueDate}T23:59:59.999Z`)
                : null,
              position,
            },
          });
        }
      }
      return {
        links: [
          {
            label: "Mở Roadmap đã mở rộng",
            href: `/app/goals/${roadmap.goalId}/roadmap`,
          },
        ],
        activeContext: {
          goalId: roadmap.goalId,
          roadmapId: roadmap.id,
        },
      };
    }
    if (relationship.action === "LINK_EXISTING" && relationship.goalId) {
      const goal = await tx.goal.findFirst({
        where: { id: relationship.goalId, userId, deletedAt: null },
        select: { id: true },
      });
      if (!goal)
        throw new AIError(
          "RELATIONSHIP_CONFLICT",
          "Goal liên kết không hợp lệ.",
        );
      const roadmap = await tx.roadmap.create({
        data: {
          userId,
          goalId: goal.id,
          title: proposal.title,
          description: proposal.description ?? null,
        },
      });
      await createRoadmapStages(tx, userId, goal.id, roadmap.id, proposal);
      return {
        links: [
          { label: "Mở Goal", href: `/app/goals/${goal.id}` },
          { label: "Mở Roadmap", href: `/app/goals/${goal.id}/roadmap` },
        ],
        activeContext: { goalId: goal.id, roadmapId: roadmap.id },
      };
    }
    const goal = await tx.goal.create({
      data: {
        userId,
        title: proposal.title,
        description: proposal.description ?? null,
        status: "DRAFT",
        priority: "MEDIUM",
        successCriteria: [],
      },
    });
    const roadmap = await tx.roadmap.create({
      data: {
        userId,
        goalId: goal.id,
        title: proposal.title,
        description: proposal.description ?? null,
      },
    });
    await createRoadmapStages(tx, userId, goal.id, roadmap.id, proposal);
    return {
      links: [
        { label: "Mở Goal", href: `/app/goals/${goal.id}` },
        {
          label: "Mở Roadmap",
          href: `/app/goals/${goal.id}/roadmap`,
        },
      ],
      activeContext: { goalId: goal.id, roadmapId: roadmap.id },
    };
  }
  if (action === AI_ACTIONS.CREATE_TASK_PROPOSAL) {
    const values = mapAndValidateTaskProposal(payload as TaskProposal);
    const last = await tx.task.findFirst({
      where: { userId, goalId: null, roadmapId: null, roadmapStageId: null },
      orderBy: { position: "desc" },
      select: { position: true },
    });
    const task = await tx.task.create({
      data: {
        userId,
        goalId: relationship.goalId ?? null,
        roadmapId: relationship.roadmapId ?? null,
        roadmapStageId: relationship.stageId ?? null,
        title: values.title,
        description: values.description || null,
        status: values.status,
        priority: values.priority,
        dueAt: values.dueAt ? new Date(`${values.dueAt}T23:59:59.999Z`) : null,
        position: (last?.position ?? -1) + 1,
      },
    });
    return {
      links: [{ label: "Mở Task", href: `/app/tasks/${task.id}` }],
      activeContext: cleanPlanningContext({
        goalId: task.goalId ?? undefined,
        roadmapId: task.roadmapId ?? undefined,
        stageId: task.roadmapStageId ?? undefined,
        taskId: task.id,
      }),
    };
  }
  if (action === AI_ACTIONS.CREATE_CHECKLIST_PROPOSAL) {
    const proposal = payload as ChecklistProposal;
    mapAndValidateChecklistProposal(proposal);
    const checklist = await tx.checklist.create({
      data: {
        userId,
        goalId: relationship.goalId ?? null,
        roadmapId: relationship.roadmapId ?? null,
        taskId: relationship.taskId ?? null,
        title: proposal.title,
        items: {
          create: proposal.items.map((item) => ({
            userId,
            title: item.title,
            position: item.order - 1,
          })),
        },
      },
    });
    return {
      links: [
        { label: "Mở Checklist", href: `/app/checklists/${checklist.id}` },
      ],
      activeContext: cleanPlanningContext({
        goalId: relationship.goalId,
        roadmapId: relationship.roadmapId,
        taskId: relationship.taskId,
      }),
    };
  }
  if (action === AI_ACTIONS.CREATE_EVENT_PROPOSAL) {
    const values = mapAndValidateEventProposal(payload as EventProposal);
    const event = await tx.event.create({ data: { ...values, userId } });
    return {
      links: [{ label: "Mở Event", href: `/app/calendar/${event.id}` }],
    };
  }
  const values = mapAndValidateNoteProposal(payload as NoteProposal);
  if (action === AI_ACTIONS.UPDATE_NOTE_PROPOSAL) {
    if (!values.noteId || !values.expectedVersion)
      throw new AIError(
        "SCHEMA_VALIDATION_ERROR",
        "Update Note cần noteId và expectedVersion.",
      );
    const updated = await tx.note.updateMany({
      where: {
        id: values.noteId,
        userId,
        deletedAt: null,
        version: values.expectedVersion,
      },
      data: {
        title: values.title,
        content: values.content,
        version: { increment: 1 },
      },
    });
    if (updated.count !== 1)
      throw new AIError(
        "CONFIRMATION_REQUIRED",
        "Note đã thay đổi hoặc không thuộc owner.",
      );
    return {
      links: [{ label: "Mở Note", href: `/app/notes/${values.noteId}` }],
    };
  }
  const note = await tx.note.create({
    data: { userId, title: values.title, content: values.content },
  });
  return { links: [{ label: "Mở Note", href: `/app/notes/${note.id}` }] };
}

async function createRoadmapStages(
  tx: Prisma.TransactionClient,
  userId: string,
  goalId: string,
  roadmapId: string,
  proposal: RoadmapProposal,
) {
  for (const stageProposal of proposal.stages) {
    const stage = await tx.roadmapStage.create({
      data: {
        userId,
        roadmapId,
        title: stageProposal.title,
        description: stageProposal.description ?? null,
        position: stageProposal.order - 1,
      },
    });
    for (let position = 0; position < stageProposal.tasks.length; position++) {
      const task = stageProposal.tasks[position];
      mapAndValidateTaskProposal(task);
      await tx.task.create({
        data: {
          userId,
          goalId,
          roadmapId,
          roadmapStageId: stage.id,
          title: task.title,
          description: task.description ?? null,
          status: "TODO",
          priority: task.priority,
          dueAt: task.dueDate
            ? new Date(`${task.dueDate}T23:59:59.999Z`)
            : null,
          position,
        },
      });
    }
  }
}

function cleanPlanningContext(context: PlanningSourceContext) {
  return Object.fromEntries(
    Object.entries(context).filter(([, value]) => value !== undefined),
  ) as PlanningSourceContext;
}
