CREATE TYPE "RoadmapStageStatus" AS ENUM ('PLANNED', 'ACTIVE', 'COMPLETED', 'PAUSED', 'SKIPPED');

ALTER TABLE public.goals
  ADD COLUMN starts_at timestamptz(6);

ALTER TABLE public.roadmap_stages
  ADD COLUMN starts_at timestamptz(6),
  ADD COLUMN ends_at timestamptz(6),
  ADD COLUMN status "RoadmapStageStatus" NOT NULL DEFAULT 'PLANNED',
  ADD COLUMN success_criteria jsonb;

ALTER TABLE public.tasks
  ADD COLUMN estimated_minutes integer,
  ADD COLUMN expected_result text,
  ADD COLUMN resources jsonb,
  ADD COLUMN source varchar(160),
  ADD COLUMN external_key varchar(255),
  ADD COLUMN is_optional boolean NOT NULL DEFAULT false;

ALTER TABLE public.events
  ADD COLUMN source varchar(160),
  ADD COLUMN external_key varchar(255);

ALTER TABLE public.notes
  ADD COLUMN goal_id uuid,
  ADD COLUMN roadmap_id uuid,
  ADD COLUMN roadmap_stage_id uuid,
  ADD COLUMN task_id uuid,
  ADD COLUMN event_id uuid;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.goals WHERE starts_at IS NOT NULL AND deadline IS NOT NULL AND starts_at > deadline) THEN
    RAISE EXCEPTION 'Cannot enforce goal date order: goals contains starts_at after deadline';
  END IF;
  IF EXISTS (SELECT 1 FROM public.roadmap_stages WHERE starts_at IS NOT NULL AND ends_at IS NOT NULL AND starts_at > ends_at) THEN
    RAISE EXCEPTION 'Cannot enforce stage date order: roadmap_stages contains starts_at after ends_at';
  END IF;
  IF EXISTS (SELECT 1 FROM public.tasks WHERE estimated_minutes IS NOT NULL AND estimated_minutes <= 0) THEN
    RAISE EXCEPTION 'Cannot enforce task duration: tasks contains non-positive estimated_minutes';
  END IF;
END $$;

ALTER TABLE public.goals
  ADD CONSTRAINT goals_date_order_check CHECK (starts_at IS NULL OR deadline IS NULL OR starts_at <= deadline);
ALTER TABLE public.roadmap_stages
  ADD CONSTRAINT roadmap_stages_date_order_check CHECK (starts_at IS NULL OR ends_at IS NULL OR starts_at <= ends_at);
ALTER TABLE public.tasks
  ADD CONSTRAINT tasks_estimated_minutes_check CHECK (estimated_minutes IS NULL OR estimated_minutes > 0),
  ADD CONSTRAINT tasks_resources_array_check CHECK (resources IS NULL OR jsonb_typeof(resources) = 'array');

ALTER TABLE public.notes
  ADD CONSTRAINT notes_goal_id_user_id_fkey FOREIGN KEY (goal_id, user_id) REFERENCES public.goals(id, user_id) ON DELETE RESTRICT,
  ADD CONSTRAINT notes_roadmap_id_user_id_fkey FOREIGN KEY (roadmap_id, user_id) REFERENCES public.roadmaps(id, user_id) ON DELETE RESTRICT,
  ADD CONSTRAINT notes_roadmap_stage_id_user_id_fkey FOREIGN KEY (roadmap_stage_id, user_id) REFERENCES public.roadmap_stages(id, user_id) ON DELETE RESTRICT,
  ADD CONSTRAINT notes_task_id_user_id_fkey FOREIGN KEY (task_id, user_id) REFERENCES public.tasks(id, user_id) ON DELETE RESTRICT,
  ADD CONSTRAINT notes_event_id_user_id_fkey FOREIGN KEY (event_id, user_id) REFERENCES public.events(id, user_id) ON DELETE RESTRICT;

CREATE UNIQUE INDEX tasks_user_id_external_key_key ON public.tasks(user_id, external_key) WHERE external_key IS NOT NULL;
CREATE UNIQUE INDEX events_user_id_external_key_key ON public.events(user_id, external_key) WHERE external_key IS NOT NULL;
CREATE INDEX notes_goal_id_user_id_idx ON public.notes(goal_id, user_id);
CREATE INDEX notes_roadmap_id_user_id_idx ON public.notes(roadmap_id, user_id);
CREATE INDEX notes_roadmap_stage_id_user_id_idx ON public.notes(roadmap_stage_id, user_id);
CREATE INDEX notes_task_id_user_id_idx ON public.notes(task_id, user_id);
CREATE INDEX notes_event_id_user_id_idx ON public.notes(event_id, user_id);

COMMENT ON COLUMN public.goals.starts_at IS 'Intentional start of the goal; never derived from created_at.';
COMMENT ON COLUMN public.tasks.is_optional IS 'Optional tasks are excluded from goal and stage progress.';
COMMENT ON COLUMN public.events.task_id IS 'Nullable: standalone calendar events are valid.';
COMMENT ON COLUMN public.notes.task_id IS 'A note is contextual knowledge, never a task or completion record.';

-- Existing FORCE RLS and owner_or_admin_all policy on every altered table remain active.
-- Composite foreign keys guarantee that a note cannot reference another owner''s entity.
