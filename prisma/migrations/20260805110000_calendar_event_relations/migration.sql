CREATE TYPE "EventRecurrence" AS ENUM ('NONE', 'DAILY', 'WEEKLY', 'MONTHLY');

ALTER TABLE "events"
  ADD COLUMN "goal_id" uuid,
  ADD COLUMN "task_id" uuid,
  ADD COLUMN "recurrence" "EventRecurrence" NOT NULL DEFAULT 'NONE';

CREATE UNIQUE INDEX "tasks_id_user_id_key" ON "tasks"("id", "user_id");

ALTER TABLE "events"
  ADD CONSTRAINT "events_goal_id_user_id_fkey"
    FOREIGN KEY ("goal_id", "user_id") REFERENCES "goals"("id", "user_id") ON DELETE RESTRICT,
  ADD CONSTRAINT "events_task_id_user_id_fkey"
    FOREIGN KEY ("task_id", "user_id") REFERENCES "tasks"("id", "user_id") ON DELETE RESTRICT;

CREATE INDEX "events_goal_id_user_id_idx" ON "events"("goal_id", "user_id");
CREATE INDEX "events_task_id_user_id_idx" ON "events"("task_id", "user_id");

-- The existing owner_or_admin_all RLS policy continues to scope rows by user_id.
-- Rollback: drop the indexes, constraints and columns above, the Task composite
-- unique index, then drop EventRecurrence.
