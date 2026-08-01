import Link from "next/link";
import { createGoalAction } from "@/features/goals/goal.actions";
import { GoalForm } from "@/features/goals/components/goal-form";

export default async function NewGoalPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <div className="mx-auto max-w-3xl"><Link href="/app/goals" className="text-sm font-semibold text-primary-hover">← Mục tiêu</Link><h1 className="mb-2 mt-5 text-3xl font-semibold">Tạo Goal mới</h1><p className="mb-6 text-foreground-secondary">Xác định kết quả cần đạt và cách bạn biết mình đã thành công.</p><GoalForm action={createGoalAction} error={error} /></div>;
}
