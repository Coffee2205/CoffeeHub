CREATE TYPE "GoalStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED');
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'BLOCKED', 'COMPLETED', 'CANCELLED');

CREATE TABLE "users" (
  "id" uuid PRIMARY KEY REFERENCES auth.users("id") ON DELETE CASCADE,
  "created_at" timestamptz(6) NOT NULL DEFAULT current_timestamp,
  "updated_at" timestamptz(6) NOT NULL DEFAULT current_timestamp,
  "deleted_at" timestamptz(6),
  "version" integer NOT NULL DEFAULT 1 CHECK ("version" > 0)
);

CREATE TABLE "profiles" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
  "display_name" varchar(120), "headline" varchar(180), "bio" text, "avatar_path" text,
  "created_at" timestamptz(6) NOT NULL DEFAULT current_timestamp,
  "updated_at" timestamptz(6) NOT NULL DEFAULT current_timestamp,
  "deleted_at" timestamptz(6), "version" integer NOT NULL DEFAULT 1 CHECK ("version" > 0)
);

CREATE TABLE "goals" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "title" varchar(180) NOT NULL, "description" text, "status" "GoalStatus" NOT NULL DEFAULT 'DRAFT',
  "priority" "Priority" NOT NULL DEFAULT 'MEDIUM', "deadline" timestamptz(6), "success_criteria" jsonb,
  "created_at" timestamptz(6) NOT NULL DEFAULT current_timestamp, "updated_at" timestamptz(6) NOT NULL DEFAULT current_timestamp,
  "deleted_at" timestamptz(6), "version" integer NOT NULL DEFAULT 1 CHECK ("version" > 0),
  UNIQUE ("id", "user_id")
);

CREATE TABLE "roadmaps" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "goal_id" uuid NOT NULL, "title" varchar(180) NOT NULL, "description" text,
  "created_at" timestamptz(6) NOT NULL DEFAULT current_timestamp, "updated_at" timestamptz(6) NOT NULL DEFAULT current_timestamp,
  "deleted_at" timestamptz(6), "version" integer NOT NULL DEFAULT 1 CHECK ("version" > 0),
  UNIQUE ("id", "user_id"),
  FOREIGN KEY ("goal_id", "user_id") REFERENCES "goals"("id", "user_id") ON DELETE CASCADE
);

CREATE TABLE "roadmap_stages" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "roadmap_id" uuid NOT NULL, "title" varchar(180) NOT NULL, "description" text, "position" integer NOT NULL CHECK ("position" >= 0),
  "created_at" timestamptz(6) NOT NULL DEFAULT current_timestamp, "updated_at" timestamptz(6) NOT NULL DEFAULT current_timestamp,
  "deleted_at" timestamptz(6), "version" integer NOT NULL DEFAULT 1 CHECK ("version" > 0),
  UNIQUE ("id", "user_id"), UNIQUE ("roadmap_id", "position"),
  FOREIGN KEY ("roadmap_id", "user_id") REFERENCES "roadmaps"("id", "user_id") ON DELETE CASCADE
);

CREATE TABLE "tasks" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "goal_id" uuid, "roadmap_id" uuid, "roadmap_stage_id" uuid,
  "title" varchar(220) NOT NULL, "description" text, "status" "TaskStatus" NOT NULL DEFAULT 'TODO',
  "priority" "Priority" NOT NULL DEFAULT 'MEDIUM', "due_at" timestamptz(6), "position" integer NOT NULL DEFAULT 0 CHECK ("position" >= 0),
  "created_at" timestamptz(6) NOT NULL DEFAULT current_timestamp, "updated_at" timestamptz(6) NOT NULL DEFAULT current_timestamp,
  "deleted_at" timestamptz(6), "version" integer NOT NULL DEFAULT 1 CHECK ("version" > 0),
  FOREIGN KEY ("goal_id", "user_id") REFERENCES "goals"("id", "user_id") ON DELETE RESTRICT,
  FOREIGN KEY ("roadmap_id", "user_id") REFERENCES "roadmaps"("id", "user_id") ON DELETE RESTRICT,
  FOREIGN KEY ("roadmap_stage_id", "user_id") REFERENCES "roadmap_stages"("id", "user_id") ON DELETE RESTRICT
);

CREATE TABLE "events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "title" varchar(220) NOT NULL, "description" text, "starts_at" timestamptz(6) NOT NULL, "ends_at" timestamptz(6),
  "timezone" varchar(64) NOT NULL DEFAULT 'UTC', "created_at" timestamptz(6) NOT NULL DEFAULT current_timestamp,
  "updated_at" timestamptz(6) NOT NULL DEFAULT current_timestamp, "deleted_at" timestamptz(6),
  "version" integer NOT NULL DEFAULT 1 CHECK ("version" > 0), CHECK ("ends_at" IS NULL OR "ends_at" >= "starts_at")
);

CREATE TABLE "notes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "title" varchar(220) NOT NULL, "content" text NOT NULL DEFAULT '',
  "created_at" timestamptz(6) NOT NULL DEFAULT current_timestamp, "updated_at" timestamptz(6) NOT NULL DEFAULT current_timestamp,
  "deleted_at" timestamptz(6), "version" integer NOT NULL DEFAULT 1 CHECK ("version" > 0)
);

CREATE INDEX "users_deleted_at_idx" ON "users"("deleted_at");
CREATE INDEX "profiles_user_id_deleted_at_idx" ON "profiles"("user_id", "deleted_at");
CREATE INDEX "goals_user_id_status_deleted_at_idx" ON "goals"("user_id", "status", "deleted_at");
CREATE INDEX "goals_user_id_deadline_idx" ON "goals"("user_id", "deadline");
CREATE INDEX "roadmaps_user_id_deleted_at_idx" ON "roadmaps"("user_id", "deleted_at");
CREATE INDEX "roadmaps_goal_id_idx" ON "roadmaps"("goal_id");
CREATE INDEX "roadmap_stages_user_id_deleted_at_idx" ON "roadmap_stages"("user_id", "deleted_at");
CREATE INDEX "roadmap_stages_roadmap_id_deleted_at_idx" ON "roadmap_stages"("roadmap_id", "deleted_at");
CREATE INDEX "tasks_user_id_status_deleted_at_idx" ON "tasks"("user_id", "status", "deleted_at");
CREATE INDEX "tasks_user_id_due_at_idx" ON "tasks"("user_id", "due_at");
CREATE INDEX "tasks_goal_id_idx" ON "tasks"("goal_id");
CREATE INDEX "tasks_roadmap_id_idx" ON "tasks"("roadmap_id");
CREATE INDEX "tasks_roadmap_stage_id_idx" ON "tasks"("roadmap_stage_id");
CREATE INDEX "events_user_id_starts_at_idx" ON "events"("user_id", "starts_at");
CREATE INDEX "events_user_id_deleted_at_idx" ON "events"("user_id", "deleted_at");
CREATE INDEX "notes_user_id_updated_at_idx" ON "notes"("user_id", "updated_at");
CREATE INDEX "notes_user_id_deleted_at_idx" ON "notes"("user_id", "deleted_at");

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;

CREATE FUNCTION private.set_updated_at() RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
REVOKE ALL ON FUNCTION private.set_updated_at() FROM PUBLIC, anon, authenticated;

DO $$ DECLARE table_name text; BEGIN
  FOREACH table_name IN ARRAY ARRAY['users','profiles','goals','roadmaps','roadmap_stages','tasks','events','notes'] LOOP
    EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION private.set_updated_at()', table_name);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
    EXECUTE format('ALTER TABLE public.%I FORCE ROW LEVEL SECURITY', table_name);
    EXECUTE format('REVOKE ALL ON public.%I FROM anon', table_name);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', table_name);
  END LOOP;
END $$;

CREATE POLICY owner_or_admin_all ON public.users FOR ALL TO authenticated
USING ((SELECT auth.uid()) = id OR coalesce((SELECT auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin')
WITH CHECK ((SELECT auth.uid()) = id OR coalesce((SELECT auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

DO $$ DECLARE table_name text; BEGIN
  FOREACH table_name IN ARRAY ARRAY['profiles','goals','roadmaps','roadmap_stages','tasks','events','notes'] LOOP
    EXECUTE format(
      'CREATE POLICY owner_or_admin_all ON public.%I FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id OR coalesce((SELECT auth.jwt() -> ''app_metadata'' ->> ''role''), '''') = ''admin'') WITH CHECK ((SELECT auth.uid()) = user_id OR coalesce((SELECT auth.jwt() -> ''app_metadata'' ->> ''role''), '''') = ''admin'')',
      table_name
    );
  END LOOP;
END $$;

COMMENT ON SCHEMA private IS 'Internal helpers; not exposed through the Data API.';
