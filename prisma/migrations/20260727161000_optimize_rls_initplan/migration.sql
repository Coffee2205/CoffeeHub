DROP POLICY owner_or_admin_all ON public.users;
CREATE POLICY owner_or_admin_all ON public.users FOR ALL TO authenticated
USING ((SELECT auth.uid()) = id OR coalesce((SELECT auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin')
WITH CHECK ((SELECT auth.uid()) = id OR coalesce((SELECT auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin');

DO $$ DECLARE table_name text; BEGIN
  FOREACH table_name IN ARRAY ARRAY['profiles','goals','roadmaps','roadmap_stages','tasks','events','notes'] LOOP
    EXECUTE format('DROP POLICY owner_or_admin_all ON public.%I', table_name);
    EXECUTE format(
      'CREATE POLICY owner_or_admin_all ON public.%I FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id OR coalesce((SELECT auth.jwt()) -> ''app_metadata'' ->> ''role'', '''') = ''admin'') WITH CHECK ((SELECT auth.uid()) = user_id OR coalesce((SELECT auth.jwt()) -> ''app_metadata'' ->> ''role'', '''') = ''admin'')',
      table_name
    );
  END LOOP;
END $$;
