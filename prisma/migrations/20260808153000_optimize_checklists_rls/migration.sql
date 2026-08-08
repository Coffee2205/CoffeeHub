DROP POLICY owner_or_admin_all ON public.checklists;
CREATE POLICY owner_or_admin_all ON public.checklists FOR ALL TO authenticated
USING (
  (SELECT auth.uid()) = user_id
  OR coalesce((SELECT auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin'
)
WITH CHECK (
  (SELECT auth.uid()) = user_id
  OR coalesce((SELECT auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin'
);

DROP POLICY owner_or_admin_all ON public.checklist_items;
CREATE POLICY owner_or_admin_all ON public.checklist_items FOR ALL TO authenticated
USING (
  (SELECT auth.uid()) = user_id
  OR coalesce((SELECT auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin'
)
WITH CHECK (
  (SELECT auth.uid()) = user_id
  OR coalesce((SELECT auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin'
);

-- Rollback: restore the previous owner_or_admin_all policies on both tables.
