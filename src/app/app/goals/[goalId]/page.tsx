import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Card, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { TaskStatus } from "@/generated/prisma/client";
import { archiveGoalAction, updateGoalAction } from "@/features/goals/goal.actions";
import { ArchiveGoalButton } from "@/features/goals/components/archive-goal-button";
import { GoalForm } from "@/features/goals/components/goal-form";
import { getGoal } from "@/features/goals/goal.repository";
import { readSuccessCriteria } from "@/features/goals/goal.schema";
import { requireUser } from "@/lib/supabase/auth";

type Query = { created?: string; saved?: string; error?: string };

export default async function GoalDetailPage({ params, searchParams }: { params: Promise<{ goalId: string }>; searchParams: Promise<Query> }) {
  const user = await requireUser();
  const [{ goalId }, query] = await Promise.all([params, searchParams]);
  const goal = await getGoal(user.id, goalId);
  if (!goal) notFound();
  const completed = goal.tasks.filter((task) => task.status === TaskStatus.COMPLETED).length;
  const progress = goal.tasks.length ? Math.round(completed / goal.tasks.length * 100) : 0;
  const criteria = readSuccessCriteria(goal.successCriteria);
  return <div className="space-y-6"><Link href="/app/goals" className="text-sm font-semibold text-primary-hover">← Mục tiêu</Link><header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><Badge variant={goal.status === "ACTIVE" ? "success" : "neutral"}>{goal.status}</Badge><h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">{goal.title}</h1><p className="mt-2 text-foreground-secondary">Chi tiết, tiến độ và thiết lập Goal.</p></div><ArchiveGoalButton action={archiveGoalAction.bind(null, goal.id)} /></header>
    {query.created ? <p role="status" className="rounded-sm border border-success/30 bg-success/10 px-4 py-3 text-sm text-green-200">Goal đã được tạo.</p> : null}{query.saved ? <p role="status" className="rounded-sm border border-success/30 bg-success/10 px-4 py-3 text-sm text-green-200">Thay đổi đã được lưu.</p> : null}
    <div className="grid gap-6 xl:grid-cols-[1fr_1.25fr]"><div className="grid content-start gap-6"><Card><CardHeader><CardTitle>Tiến độ</CardTitle><CardDescription>Tính từ Task chưa xóa và không bị hủy gắn với Goal.</CardDescription></CardHeader><div className="flex items-end justify-between"><strong className="font-mono text-4xl">{progress}%</strong><span className="text-sm text-muted">{completed}/{goal.tasks.length} Task</span></div><div className="mt-4 h-3 overflow-hidden rounded-full bg-background-tertiary" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} /></div><p className="mt-4 text-sm text-muted">{goal.roadmaps.length} roadmap liên quan</p></Card><Card><CardHeader><CardTitle>Tiêu chí thành công</CardTitle></CardHeader>{criteria.length ? <ul className="space-y-3">{criteria.map((item) => <li key={item} className="flex gap-3 text-sm leading-6"><span aria-hidden="true" className="text-primary-hover">✓</span><span>{item}</span></li>)}</ul> : <p className="text-sm text-muted">Chưa có tiêu chí. Thêm tiêu chí trong form để Goal có định nghĩa hoàn thành rõ ràng.</p>}</Card></div><GoalForm goal={goal} action={updateGoalAction.bind(null, goal.id)} error={query.error} /></div>
  </div>;
}
