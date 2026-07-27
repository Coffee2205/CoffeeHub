CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'HIDDEN');
CREATE TABLE public.projects (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
 title varchar(180) NOT NULL, slug varchar(180) NOT NULL UNIQUE, summary varchar(320) NOT NULL, description text NOT NULL,
 role varchar(180), tech_stack text[] NOT NULL DEFAULT ARRAY[]::text[], github_url varchar(500), live_url varchar(500),
 status "ContentStatus" NOT NULL DEFAULT 'DRAFT', started_at date, ended_at date, display_order integer NOT NULL DEFAULT 0,
 published_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 deleted_at timestamptz, version integer NOT NULL DEFAULT 1,
 CONSTRAINT projects_date_order CHECK (ended_at IS NULL OR started_at IS NULL OR ended_at >= started_at),
 CONSTRAINT projects_publish_timestamp CHECK (status <> 'PUBLISHED' OR published_at IS NOT NULL)
);
CREATE INDEX projects_user_status_deleted_idx ON public.projects (user_id, status, deleted_at);
CREATE INDEX projects_public_order_idx ON public.projects (status, display_order, deleted_at);
CREATE TRIGGER set_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects FORCE ROW LEVEL SECURITY;
GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
CREATE POLICY projects_public_published_select ON public.projects FOR SELECT TO anon, authenticated USING (status = 'PUBLISHED' AND deleted_at IS NULL);
CREATE POLICY projects_owner_admin_select ON public.projects FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()) OR (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY projects_owner_admin_insert ON public.projects FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()) OR (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY projects_owner_admin_update ON public.projects FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid()) OR (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') WITH CHECK (user_id = (SELECT auth.uid()) OR (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY projects_owner_admin_delete ON public.projects FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()) OR (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
