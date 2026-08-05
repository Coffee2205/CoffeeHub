import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { EventList } from "@/features/dashboard/components/event-list";
import { GoalList } from "@/features/dashboard/components/goal-list";
import { MetricCard } from "@/features/dashboard/components/metric-card";
import { TaskList } from "@/features/dashboard/components/task-list";
import { WeeklyProgress } from "@/features/dashboard/components/weekly-progress";
import { getDashboardData } from "@/features/dashboard/dashboard.service";
import { requireUser } from "@/lib/supabase/auth";

export default async function DashboardPage() {
  const user = await requireUser();
  const now = new Date();
  const data = await getDashboardData(user.id, now);

  return (
    <div>
      <DashboardHeader
        displayName={data.displayName}
        email={user.email}
        now={now}
      />
      <section
        className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4"
        aria-label="Số liệu tổng quan"
      >
        <MetricCard
          label="Task hôm nay"
          value={data.counts.todayTasks}
          hint="Task chưa hoàn tất có hạn trong ngày UTC."
        />
        <MetricCard
          label="Quá hạn"
          value={data.counts.overdueTasks}
          hint="Task chưa hoàn tất có hạn trước thời điểm hiện tại."
          tone={data.counts.overdueTasks > 0 ? "warning" : "default"}
        />
        <MetricCard
          label="Goal active"
          value={data.counts.activeGoals}
          hint="Goal ACTIVE và chưa bị xóa."
        />
        <MetricCard
          label="Event 7 ngày"
          value={data.counts.upcomingEvents}
          hint="Event bắt đầu trong 7 ngày kế tiếp."
        />
      </section>
      <section
        className="mt-5 grid gap-5 xl:grid-cols-2"
        aria-label="Task cần chú ý"
      >
        <TaskList
          title="Task hôm nay"
          description="Task chưa hoàn tất có hạn trong ngày hiện tại."
          tasks={data.todayTasks}
        />
        <TaskList
          title="Task quá hạn"
          description="Ưu tiên xử lý Task có hạn đã qua."
          tasks={data.overdueTasks}
          overdue
        />
      </section>
      <section className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-5">
          <WeeklyProgress {...data.weeklyProgress} />
          <GoalList goals={data.activeGoals} />
        </div>
        <EventList events={data.upcomingEvents} />
      </section>
    </div>
  );
}
