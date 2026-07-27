-- Cover the composite ownership foreign keys with matching indexes.
CREATE INDEX "roadmaps_goal_id_user_id_idx"
  ON "public"."roadmaps"("goal_id", "user_id");

CREATE INDEX "roadmap_stages_roadmap_id_user_id_idx"
  ON "public"."roadmap_stages"("roadmap_id", "user_id");

CREATE INDEX "tasks_goal_id_user_id_idx"
  ON "public"."tasks"("goal_id", "user_id");

CREATE INDEX "tasks_roadmap_id_user_id_idx"
  ON "public"."tasks"("roadmap_id", "user_id");

CREATE INDEX "tasks_roadmap_stage_id_user_id_idx"
  ON "public"."tasks"("roadmap_stage_id", "user_id");
