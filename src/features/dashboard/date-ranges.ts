const DAY_IN_MS = 24 * 60 * 60 * 1000;

export type DashboardRanges = {
  now: Date;
  todayStart: Date;
  tomorrowStart: Date;
  weekStart: Date;
  nextWeekStart: Date;
  upcomingEnd: Date;
};

export function getDashboardRanges(input: Date): DashboardRanges {
  const now = new Date(input);
  const todayStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  const tomorrowStart = new Date(todayStart.getTime() + DAY_IN_MS);
  const mondayOffset = (todayStart.getUTCDay() + 6) % 7;
  const weekStart = new Date(todayStart.getTime() - mondayOffset * DAY_IN_MS);
  const nextWeekStart = new Date(weekStart.getTime() + 7 * DAY_IN_MS);
  const upcomingEnd = new Date(now.getTime() + 7 * DAY_IN_MS);

  return {
    now,
    todayStart,
    tomorrowStart,
    weekStart,
    nextWeekStart,
    upcomingEnd,
  };
}

export function getGreeting(date: Date) {
  const hour = date.getUTCHours();
  if (hour < 12) return "Chào buổi sáng";
  if (hour < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
}
