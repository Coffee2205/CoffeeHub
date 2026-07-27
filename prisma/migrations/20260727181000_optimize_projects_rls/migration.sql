DROP POLICY projects_public_published_select ON public.projects;
DROP POLICY projects_owner_admin_select ON public.projects;
DROP POLICY projects_owner_admin_insert ON public.projects;
DROP POLICY projects_owner_admin_update ON public.projects;
DROP POLICY projects_owner_admin_delete ON public.projects;

CREATE POLICY projects_public_published_select ON public.projects FOR SELECT TO anon
  USING (status = 'PUBLISHED' AND deleted_at IS NULL);
CREATE POLICY projects_authenticated_select ON public.projects FOR SELECT TO authenticated
  USING (status = 'PUBLISHED' AND deleted_at IS NULL OR user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
CREATE POLICY projects_owner_admin_insert ON public.projects FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
CREATE POLICY projects_owner_admin_update ON public.projects FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin')
  WITH CHECK (user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
CREATE POLICY projects_owner_admin_delete ON public.projects FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
