DROP POLICY media_assets_admin_all ON public.media_assets;
DROP POLICY project_media_admin_all ON public.project_media;
CREATE POLICY media_assets_admin_insert ON public.media_assets FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()) AND (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
CREATE POLICY media_assets_admin_update ON public.media_assets FOR UPDATE TO authenticated USING ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin') WITH CHECK (user_id = (SELECT auth.uid()) AND (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
CREATE POLICY media_assets_admin_delete ON public.media_assets FOR DELETE TO authenticated USING ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
CREATE POLICY project_media_admin_insert ON public.project_media FOR INSERT TO authenticated WITH CHECK ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
CREATE POLICY project_media_admin_update ON public.project_media FOR UPDATE TO authenticated USING ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin') WITH CHECK ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
CREATE POLICY project_media_admin_delete ON public.project_media FOR DELETE TO authenticated USING ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
