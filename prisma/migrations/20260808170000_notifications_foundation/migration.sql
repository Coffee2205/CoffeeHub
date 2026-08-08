CREATE TYPE public."ReminderRecurrence" AS ENUM ('NONE', 'DAILY', 'WEEKLY', 'MONTHLY');
CREATE TYPE public."ReminderStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

CREATE TABLE public.reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL,
  goal_id uuid, task_id uuid, event_id uuid, checklist_id uuid,
  title varchar(220) NOT NULL, scheduled_for timestamptz NOT NULL,
  timezone varchar(64) NOT NULL DEFAULT 'UTC',
  recurrence public."ReminderRecurrence" NOT NULL DEFAULT 'NONE',
  status public."ReminderStatus" NOT NULL DEFAULT 'ACTIVE',
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz, version integer NOT NULL DEFAULT 1,
  CONSTRAINT reminders_single_entity_check CHECK (num_nonnulls(goal_id, task_id, event_id, checklist_id) <= 1),
  CONSTRAINT reminders_version_check CHECK (version > 0)
);
CREATE TABLE public.notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL UNIQUE,
  in_app_enabled boolean NOT NULL DEFAULT true, browser_enabled boolean NOT NULL DEFAULT false,
  default_lead_minutes integer NOT NULL DEFAULT 15,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), version integer NOT NULL DEFAULT 1,
  CONSTRAINT notification_preferences_lead_check CHECK (default_lead_minutes BETWEEN 0 AND 10080),
  CONSTRAINT notification_preferences_version_check CHECK (version > 0)
);
CREATE UNIQUE INDEX events_id_user_id_key ON public.events(id, user_id);
ALTER TABLE public.reminders
  ADD CONSTRAINT reminders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  ADD CONSTRAINT reminders_goal_id_user_id_fkey FOREIGN KEY (goal_id, user_id) REFERENCES public.goals(id, user_id) ON DELETE RESTRICT,
  ADD CONSTRAINT reminders_task_id_user_id_fkey FOREIGN KEY (task_id, user_id) REFERENCES public.tasks(id, user_id) ON DELETE RESTRICT,
  ADD CONSTRAINT reminders_event_id_user_id_fkey FOREIGN KEY (event_id, user_id) REFERENCES public.events(id, user_id) ON DELETE RESTRICT,
  ADD CONSTRAINT reminders_checklist_id_user_id_fkey FOREIGN KEY (checklist_id, user_id) REFERENCES public.checklists(id, user_id) ON DELETE RESTRICT;
ALTER TABLE public.notification_preferences ADD CONSTRAINT notification_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
CREATE INDEX reminders_user_id_status_scheduled_for_idx ON public.reminders(user_id, status, scheduled_for);
CREATE INDEX reminders_goal_id_user_id_idx ON public.reminders(goal_id, user_id);
CREATE INDEX reminders_task_id_user_id_idx ON public.reminders(task_id, user_id);
CREATE INDEX reminders_event_id_user_id_idx ON public.reminders(event_id, user_id);
CREATE INDEX reminders_checklist_id_user_id_idx ON public.reminders(checklist_id, user_id);
DO $$ DECLARE table_name text; BEGIN FOREACH table_name IN ARRAY ARRAY['reminders','notification_preferences'] LOOP
  EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION private.set_updated_at()', table_name);
  EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
  EXECUTE format('ALTER TABLE public.%I FORCE ROW LEVEL SECURITY', table_name);
  EXECUTE format('REVOKE ALL ON public.%I FROM anon', table_name);
  EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', table_name);
END LOOP; END $$;
CREATE POLICY owner_or_admin_all ON public.reminders FOR ALL TO authenticated
USING ((SELECT auth.uid()) = user_id OR coalesce((SELECT auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin')
WITH CHECK ((SELECT auth.uid()) = user_id OR coalesce((SELECT auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin');
CREATE POLICY owner_or_admin_all ON public.notification_preferences FOR ALL TO authenticated
USING ((SELECT auth.uid()) = user_id OR coalesce((SELECT auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin')
WITH CHECK ((SELECT auth.uid()) = user_id OR coalesce((SELECT auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin');

-- Rollback: drop both tables and the ReminderStatus/ReminderRecurrence enum types.
