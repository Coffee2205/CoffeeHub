import "server-only";

import { GoalStatus, TaskStatus } from "@/generated/prisma/enums";
import { getPrisma } from "@/lib/prisma";
import type { DashboardRanges } from "@/features/dashboard/date-ranges";

const unfinishedStatuses = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.BLOCKED];

export async function readDashboardSnapshot(userId: string, ranges: DashboardRanges) {
  const prisma = getPrisma();

  const [profile, todayTasks, overdueTasks, activeGoals, upcomingEvents, weeklyTasks, todayTaskCount, overdueTaskCount, activeGoalCount, upcomingEventCount] = await Promise.all([
    prisma.profile.findUnique({ where: { userId }, select: { displayName: true } }),
    prisma.task.findMany({
      where: { userId, deletedAt: null, status: { in: unfinishedStatuses }, dueAt: { gte: ranges.todayStart, lt: ranges.tomorrowStart } },
      orderBy: [{ dueAt: "asc" }, { priority: "desc" }],
      take: 5,
      select: { id: true, title: true, dueAt: true, priority: true },
    }),
    prisma.task.findMany({
      where: { userId, deletedAt: null, status: { in: unfinishedStatuses }, dueAt: { lt: ranges.now } },
      orderBy: [{ dueAt: "asc" }, { priority: "desc" }],
      take: 5,
      select: { id: true, title: true, dueAt: true, priority: true },
    }),
    prisma.goal.findMany({
      where: { userId, deletedAt: null, status: GoalStatus.ACTIVE },
      orderBy: [{ deadline: "asc" }, { updatedAt: "desc" }],
      take: 4,
      select: {
        id: true,
        title: true,
        deadline: true,
        tasks: { where: { deletedAt: null, status: { not: TaskStatus.CANCELLED } }, select: { status: true } },
      },
    }),
    prisma.event.findMany({
      where: { userId, deletedAt: null, startsAt: { gte: ranges.now, lt: ranges.upcomingEnd } },
      orderBy: { startsAt: "asc" },
      take: 5,
      select: { id: true, title: true, startsAt: true, timezone: true },
    }),
    prisma.task.findMany({
      where: { userId, deletedAt: null, status: { not: TaskStatus.CANCELLED }, dueAt: { gte: ranges.weekStart, lt: ranges.nextWeekStart } },
      select: { status: true },
    }),
    prisma.task.count({ where: { userId, deletedAt: null, status: { in: unfinishedStatuses }, dueAt: { gte: ranges.todayStart, lt: ranges.tomorrowStart } } }),
    prisma.task.count({ where: { userId, deletedAt: null, status: { in: unfinishedStatuses }, dueAt: { lt: ranges.now } } }),
    prisma.goal.count({ where: { userId, deletedAt: null, status: GoalStatus.ACTIVE } }),
    prisma.event.count({ where: { userId, deletedAt: null, startsAt: { gte: ranges.now, lt: ranges.upcomingEnd } } }),
  ]);

  return { profile, todayTasks, overdueTasks, activeGoals, upcomingEvents, weeklyTasks, counts: { todayTasks: todayTaskCount, overdueTasks: overdueTaskCount, activeGoals: activeGoalCount, upcomingEvents: upcomingEventCount } };
}
