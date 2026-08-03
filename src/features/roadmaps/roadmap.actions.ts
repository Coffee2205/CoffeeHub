"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/supabase/auth";
import { archiveStage, createRoadmap, createStage, moveStage, updateStage } from "./roadmap.repository";
import { parseRoadmapForm, parseStageForm } from "./roadmap.schema";

const route = (goalId: string, query?: string) => `/app/goals/${goalId}/roadmap${query ? `?${query}` : ""}`;
function invalid(goalId: string, errors: string[]): never { redirect(route(goalId, `error=${encodeURIComponent(errors.join(" "))}`)); }
function refresh(goalId: string) { revalidatePath(route(goalId)); revalidatePath(`/app/goals/${goalId}`); revalidatePath("/app/goals"); }

export async function createRoadmapAction(goalId: string, form: FormData) {
  const user = await requireUser(); const parsed = parseRoadmapForm(form); if (!parsed.data) invalid(goalId, parsed.errors);
  const result = await createRoadmap(user.id, goalId, parsed.data); if (!result) redirect("/app/goals?error=Goal%20không%20tồn%20tại.");
  refresh(goalId); redirect(route(goalId, "saved=roadmap"));
}

export async function createStageAction(goalId: string, roadmapId: string, form: FormData) {
  const user = await requireUser(); const parsed = parseStageForm(form); if (!parsed.data) invalid(goalId, parsed.errors);
  const result = await createStage(user.id, goalId, roadmapId, parsed.data); if (!result) invalid(goalId, ["Roadmap không tồn tại."]);
  refresh(goalId); redirect(route(goalId, "saved=stage"));
}

export async function updateStageAction(goalId: string, roadmapId: string, stageId: string, form: FormData) {
  const user = await requireUser(); const parsed = parseStageForm(form); if (!parsed.data) invalid(goalId, parsed.errors);
  const result = await updateStage(user.id, goalId, roadmapId, stageId, parsed.data); if (!result.count) invalid(goalId, ["Milestone không tồn tại."]);
  refresh(goalId); redirect(route(goalId, "saved=stage"));
}

export async function moveStageAction(goalId: string, roadmapId: string, stageId: string, direction: "up" | "down") {
  const user = await requireUser(); const moved = await moveStage(user.id, goalId, roadmapId, stageId, direction);
  if (!moved) invalid(goalId, ["Không thể đổi vị trí milestone."]);
  refresh(goalId); redirect(route(goalId, "saved=order"));
}

export async function archiveStageAction(goalId: string, roadmapId: string, stageId: string) {
  const user = await requireUser(); const result = await archiveStage(user.id, goalId, roadmapId, stageId);
  if (result === "has-tasks") invalid(goalId, ["Không thể lưu trữ milestone đang có Task. Hãy chuyển Task sang milestone khác trước."]);
  if (result === "not-found") invalid(goalId, ["Milestone không tồn tại."]);
  refresh(goalId); redirect(route(goalId, "saved=archived"));
}
