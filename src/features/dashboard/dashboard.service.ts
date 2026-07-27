import "server-only";

import { TaskStatus } from "@/generated/prisma/enums";
import { getDashboardRanges } from "@/features/dashboard/date-ranges";
import { calculateProgress } from "@/features/dashboard/metrics";
import { readDashboardSnapshot } from "@/features/dashboard/dashboard.repository";
import type { DashboardData } from "@/features/dashboard/dashboard.types";

export async function getDashboardData(userId: string, now = new Date()): Promise<DashboardData> {
  const snapshot = await readDashboardSnapshot(userId, getDashboardRanges(now));

  return {
    displayName: snapshot.profile?.displayName ?? null,
    todayTasks: snapshot.todayTasks.filter((task): task is typeof task & { dueAt: Date } => task.dueAt !== null),
    overdueTasks: snapshot.overdueTasks.filter((task): task is typeof task & { dueAt: Date } => task.dueAt !== null),
    activeGoals: snapshot.activeGoals.map((goal) => ({
      id: goal.id,
      title: goal.title,
      deadline: goal.deadline,
      completedTasks: goal.tasks.filter((task) => task.status === TaskStatus.COMPLETED).length,
      totalTasks: goal.tasks.length,
    })),
    upcomingEvents: snapshot.upcomingEvents,
    counts: snapshot.counts,
    weeklyProgress: calculateProgress(snapshot.weeklyTasks.map((task) => task.status)),
  };
}
