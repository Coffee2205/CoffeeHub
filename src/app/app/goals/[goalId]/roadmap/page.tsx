import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Button, EmptyState, Input, Textarea } from "@/components/ui";
import { RoadmapBoard } from "@/features/roadmaps/components/roadmap-board";
import { createRoadmapAction } from "@/features/roadmaps/roadmap.actions";
import { getGoalRoadmaps } from "@/features/roadmaps/roadmap.repository";
import { requireUser } from "@/lib/supabase/auth";

type Query = { error?: string; saved?: string };
export default async function GoalRoadmapPage({ params, searchParams }: { params: Promise<{ goalId: string }>; searchParams: Promise<Query> }) {
  const user = await requireUser(); const [{ goalId }, query] = await Promise.all([params, searchParams]); const goal = await getGoalRoadmaps(user.id, goalId); if (!goal) notFound();
  return <div className="space-y-6"><Link href={`/app/goals/${goal.id}`} className="text-sm font-semibold text-primary-hover">← {goal.title}</Link><header><Badge variant="primary">Roadmap</Badge><h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Lộ trình của {goal.title}</h1><p className="mt-2 max-w-2xl text-foreground-secondary">Chia Goal thành milestone có thứ tự và theo dõi tiến độ từ Task thật.</p></header>
    {query.error ? <p role="alert" className="rounded-sm border border-error/30 bg-error/10 px-4 py-3 text-sm text-red-200">{query.error}</p> : null}{query.saved ? <p role="status" className="rounded-sm border border-success/30 bg-success/10 px-4 py-3 text-sm text-green-200">Thay đổi roadmap đã được lưu.</p> : null}
    {goal.roadmaps.length ? <div className="grid gap-6">{goal.roadmaps.map((roadmap) => <RoadmapBoard key={roadmap.id} goalId={goal.id} roadmap={roadmap} />)}</div> : <EmptyState title="Goal chưa có Roadmap" description="Tạo roadmap để chia Goal thành các milestone có thể thực hiện." />}
    <form action={createRoadmapAction.bind(null, goal.id)} className="grid gap-4 rounded-lg border border-border bg-surface p-5 sm:p-6"><h2 className="text-lg font-semibold">Tạo Roadmap</h2><label className="grid gap-2"><span className="text-sm font-medium">Tên roadmap</span><Input name="title" required maxLength={180} placeholder="Kế hoạch thực hiện" /></label><label className="grid gap-2"><span className="text-sm font-medium">Mô tả</span><Textarea name="description" maxLength={3000} /></label><Button type="submit" className="justify-self-start">Tạo Roadmap</Button></form>
  </div>;
}
