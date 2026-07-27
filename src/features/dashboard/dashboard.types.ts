export type DashboardTask = {
  id: string;
  title: string;
  dueAt: Date;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
};

export type DashboardGoal = {
  id: string;
  title: string;
  deadline: Date | null;
  completedTasks: number;
  totalTasks: number;
};

export type DashboardEvent = {
  id: string;
  title: string;
  startsAt: Date;
  timezone: string;
};

export type DashboardData = {
  displayName: string | null;
  todayTasks: DashboardTask[];
  overdueTasks: DashboardTask[];
  activeGoals: DashboardGoal[];
  upcomingEvents: DashboardEvent[];
  counts: { todayTasks: number; overdueTasks: number; activeGoals: number; upcomingEvents: number };
  weeklyProgress: { completed: number; total: number; percentage: number };
};
