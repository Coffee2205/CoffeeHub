ALTER TABLE public.checklists
  ADD CONSTRAINT checklists_single_context_check CHECK (
    num_nonnulls(goal_id, roadmap_id, task_id) <= 1
  ),
  ADD CONSTRAINT checklists_version_check CHECK (version > 0);

ALTER TABLE public.checklist_items
  ADD CONSTRAINT checklist_items_position_check CHECK (position >= 0),
  ADD CONSTRAINT checklist_items_version_check CHECK (version > 0);

-- Rollback: drop the four CHECK constraints added above.
