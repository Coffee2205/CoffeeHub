CREATE TABLE public.experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role varchar(180) NOT NULL, organization varchar(180) NOT NULL, location varchar(180), description text NOT NULL,
  started_at date NOT NULL, ended_at date, status "ContentStatus" NOT NULL DEFAULT 'DRAFT', display_order integer NOT NULL DEFAULT 0,
  published_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz, version integer NOT NULL DEFAULT 1,
  CONSTRAINT experiences_date_order CHECK (ended_at IS NULL OR ended_at >= started_at),
  CONSTRAINT experiences_proper_order CHECK (display_order >= 0),
  CONSTRAINT experiences_publish_timestamp CHECK (status <> 'PUBLISHED' OR published_at IS NOT NULL)
);
CREATE TABLE public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name varchar(120) NOT NULL, category varchar(120) NOT NULL, proficiency integer,
  status "ContentStatus" NOT NULL DEFAULT 'DRAFT', display_order integer NOT NULL DEFAULT 0,
  published_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz, version integer NOT NULL DEFAULT 1,
  CONSTRAINT skills_proficiency_range CHECK (proficiency IS NULL OR proficiency BETWEEN 1 AND 5),
  CONSTRAINT skills_proper_order CHECK (display_order >= 0),
  CONSTRAINT skills_publish_timestamp CHECK (status <> 'PUBLISHED' OR published_at IS NOT NULL)
);
CREATE TABLE public.education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  institution varchar(180) NOT NULL, degree varchar(180) NOT NULL, field_of_study varchar(180), description text,
  started_at date, ended_at date, status "ContentStatus" NOT NULL DEFAULT 'DRAFT', display_order integer NOT NULL DEFAULT 0,
  published_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz, version integer NOT NULL DEFAULT 1,
  CONSTRAINT education_date_order CHECK (ended_at IS NULL OR started_at IS NULL OR ended_at >= started_at),
  CONSTRAINT education_proper_order CHECK (display_order >= 0),
  CONSTRAINT education_publish_timestamp CHECK (status <> 'PUBLISHED' OR published_at IS NOT NULL)
);

CREATE INDEX experiences_user_status_deleted_idx ON public.experiences(user_id, status, deleted_at);
CREATE INDEX experiences_public_order_idx ON public.experiences(status, display_order, deleted_at);
CREATE INDEX skills_user_status_deleted_idx ON public.skills(user_id, status, deleted_at);
CREATE INDEX skills_public_order_idx ON public.skills(status, display_order, deleted_at);
CREATE INDEX education_user_status_deleted_idx ON public.education(user_id, status, deleted_at);
CREATE INDEX education_public_order_idx ON public.education(status, display_order, deleted_at);

CREATE TRIGGER set_experiences_updated_at BEFORE UPDATE ON public.experiences FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();
CREATE TRIGGER set_skills_updated_at BEFORE UPDATE ON public.skills FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();
CREATE TRIGGER set_education_updated_at BEFORE UPDATE ON public.education FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();

ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY; ALTER TABLE public.experiences FORCE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY; ALTER TABLE public.skills FORCE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY; ALTER TABLE public.education FORCE ROW LEVEL SECURITY;
GRANT SELECT ON public.experiences, public.skills, public.education TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.experiences, public.skills, public.education TO authenticated;

CREATE POLICY experiences_public_select ON public.experiences FOR SELECT TO anon USING (status = 'PUBLISHED' AND deleted_at IS NULL);
CREATE POLICY experiences_authenticated_select ON public.experiences FOR SELECT TO authenticated USING (status = 'PUBLISHED' AND deleted_at IS NULL OR user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
CREATE POLICY experiences_owner_admin_insert ON public.experiences FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
CREATE POLICY experiences_owner_admin_update ON public.experiences FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin') WITH CHECK (user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
CREATE POLICY experiences_owner_admin_delete ON public.experiences FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
CREATE POLICY skills_public_select ON public.skills FOR SELECT TO anon USING (status = 'PUBLISHED' AND deleted_at IS NULL);
CREATE POLICY skills_authenticated_select ON public.skills FOR SELECT TO authenticated USING (status = 'PUBLISHED' AND deleted_at IS NULL OR user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
CREATE POLICY skills_owner_admin_insert ON public.skills FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
CREATE POLICY skills_owner_admin_update ON public.skills FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin') WITH CHECK (user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
CREATE POLICY skills_owner_admin_delete ON public.skills FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
CREATE POLICY education_public_select ON public.education FOR SELECT TO anon USING (status = 'PUBLISHED' AND deleted_at IS NULL);
CREATE POLICY education_authenticated_select ON public.education FOR SELECT TO authenticated USING (status = 'PUBLISHED' AND deleted_at IS NULL OR user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
CREATE POLICY education_owner_admin_insert ON public.education FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
CREATE POLICY education_owner_admin_update ON public.education FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin') WITH CHECK (user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
CREATE POLICY education_owner_admin_delete ON public.education FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
