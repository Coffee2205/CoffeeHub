CREATE TABLE public.checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  goal_id uuid,
  roadmap_id uuid,
  task_id uuid,
  title varchar(220) NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  version integer NOT NULL DEFAULT 1
);

CREATE TABLE public.checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  checklist_id uuid NOT NULL,
  title varchar(220) NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  version integer NOT NULL DEFAULT 1
);

CREATE UNIQUE INDEX checklists_id_user_id_key ON public.checklists(id, user_id);
CREATE UNIQUE INDEX checklist_items_id_user_id_key ON public.checklist_items(id, user_id);
CREATE UNIQUE INDEX checklist_items_checklist_id_position_key ON public.checklist_items(checklist_id, position);

ALTER TABLE public.checklists
  ADD CONSTRAINT checklists_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  ADD CONSTRAINT checklists_goal_id_user_id_fkey FOREIGN KEY (goal_id, user_id) REFERENCES public.goals(id, user_id) ON DELETE RESTRICT,
  ADD CONSTRAINT checklists_roadmap_id_user_id_fkey FOREIGN KEY (roadmap_id, user_id) REFERENCES public.roadmaps(id, user_id) ON DELETE RESTRICT,
  ADD CONSTRAINT checklists_task_id_user_id_fkey FOREIGN KEY (task_id, user_id) REFERENCES public.tasks(id, user_id) ON DELETE RESTRICT;

ALTER TABLE public.checklist_items
  ADD CONSTRAINT checklist_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  ADD CONSTRAINT checklist_items_checklist_id_user_id_fkey FOREIGN KEY (checklist_id, user_id) REFERENCES public.checklists(id, user_id) ON DELETE CASCADE;

CREATE INDEX checklists_user_id_deleted_at_idx ON public.checklists(user_id, deleted_at);
CREATE INDEX checklists_user_id_updated_at_idx ON public.checklists(user_id, updated_at);
CREATE INDEX checklists_goal_id_user_id_idx ON public.checklists(goal_id, user_id);
CREATE INDEX checklists_roadmap_id_user_id_idx ON public.checklists(roadmap_id, user_id);
CREATE INDEX checklists_task_id_user_id_idx ON public.checklists(task_id, user_id);
CREATE INDEX checklist_items_user_id_deleted_at_idx ON public.checklist_items(user_id, deleted_at);
CREATE INDEX checklist_items_checklist_id_deleted_at_idx ON public.checklist_items(checklist_id, deleted_at);
CREATE INDEX checklist_items_checklist_id_user_id_idx ON public.checklist_items(checklist_id, user_id);

DO $$ DECLARE table_name text; BEGIN
  FOREACH table_name IN ARRAY ARRAY['checklists','checklist_items'] LOOP
    EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION private.set_updated_at()', table_name);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
    EXECUTE format('ALTER TABLE public.%I FORCE ROW LEVEL SECURITY', table_name);
    EXECUTE format('REVOKE ALL ON public.%I FROM anon', table_name);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', table_name);
  END LOOP;
END $$;

CREATE POLICY owner_or_admin_all ON public.checklists FOR ALL TO authenticated
USING ((SELECT auth.uid()) = user_id OR coalesce((SELECT auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin')
WITH CHECK ((SELECT auth.uid()) = user_id OR coalesce((SELECT auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

CREATE POLICY owner_or_admin_all ON public.checklist_items FOR ALL TO authenticated
USING ((SELECT auth.uid()) = user_id OR coalesce((SELECT auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin')
WITH CHECK ((SELECT auth.uid()) = user_id OR coalesce((SELECT auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

-- Rollback: drop the checklist_items and checklists tables, unique indexes,
-- constraints, triggers, policies and indexes above.