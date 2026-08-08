import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { ReminderStatus } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/prisma";
import type { ReminderInput } from "./notification.schema";

const include = {
  goal: { select: { id: true, title: true } },
  task: { select: { id: true, title: true } },
  event: { select: { id: true, title: true } },
  checklist: { select: { id: true, title: true } },
} satisfies Prisma.ReminderInclude;
export function listNotificationSettings(userId: string) {
  return Promise.all([
    getPrisma().reminder.findMany({
      where: { userId, deletedAt: null },
      orderBy: [{ status: "asc" }, { scheduledFor: "asc" }],
      include,
    }),
    getPrisma().notificationPreference.findUnique({ where: { userId } }),
    getPrisma().profile.findUnique({
      where: { userId },
      select: { timezone: true },
    }),
    getPrisma().goal.findMany({
      where: { userId, deletedAt: null },
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
    getPrisma().task.findMany({
      where: { userId, deletedAt: null },
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
    getPrisma().event.findMany({
      where: { userId, deletedAt: null },
      select: { id: true, title: true },
      orderBy: { startsAt: "asc" },
    }),
    getPrisma().checklist.findMany({
      where: { userId, deletedAt: null },
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
  ]).then(
    ([reminders, preference, profile, goals, tasks, events, checklists]) => ({
      reminders,
      preference,
      timezone: profile?.timezone ?? "UTC",
      goals,
      tasks,
      events,
      checklists,
    }),
  );
}
async function relationValid(
  tx: Prisma.TransactionClient,
  userId: string,
  input: ReminderInput,
) {
  const selected = [
    input.goalId,
    input.taskId,
    input.eventId,
    input.checklistId,
  ].filter(Boolean);
  if (selected.length > 1) return false;
  if (input.goalId)
    return Boolean(
      await tx.goal.findFirst({
        where: { id: input.goalId, userId, deletedAt: null },
        select: { id: true },
      }),
    );
  if (input.taskId)
    return Boolean(
      await tx.task.findFirst({
        where: { id: input.taskId, userId, deletedAt: null },
        select: { id: true },
      }),
    );
  if (input.eventId)
    return Boolean(
      await tx.event.findFirst({
        where: { id: input.eventId, userId, deletedAt: null },
        select: { id: true },
      }),
    );
  if (input.checklistId)
    return Boolean(
      await tx.checklist.findFirst({
        where: { id: input.checklistId, userId, deletedAt: null },
        select: { id: true },
      }),
    );
  return true;
}
export function createReminder(userId: string, input: ReminderInput) {
  return getPrisma().$transaction(async (tx) => {
    if (!(await relationValid(tx, userId, input))) return null;
    return tx.reminder.create({ data: { ...input, userId } });
  });
}
export function cancelReminder(userId: string, id: string) {
  return getPrisma().reminder.updateMany({
    where: { id, userId, deletedAt: null, status: ReminderStatus.ACTIVE },
    data: { status: ReminderStatus.CANCELLED, version: { increment: 1 } },
  });
}
export function upsertPreference(
  userId: string,
  data: {
    inAppEnabled: boolean;
    browserEnabled: boolean;
    defaultLeadMinutes: number;
  },
) {
  return getPrisma().notificationPreference.upsert({
    where: { userId },
    create: { userId, ...data },
    update: { ...data, version: { increment: 1 } },
  });
}
export function reminderDeepLink(reminder: {
  goalId: string | null;
  taskId: string | null;
  eventId: string | null;
  checklistId: string | null;
}) {
  if (reminder.goalId) return `/app/goals/${reminder.goalId}`;
  if (reminder.taskId) return `/app/tasks/${reminder.taskId}`;
  if (reminder.eventId) return `/app/calendar/${reminder.eventId}`;
  if (reminder.checklistId) return `/app/checklists/${reminder.checklistId}`;
  return "/app/settings/notifications";
}
