CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title varchar(180) NOT NULL, slug varchar(180) NOT NULL UNIQUE, excerpt varchar(320) NOT NULL, body text NOT NULL,
  status "ContentStatus" NOT NULL DEFAULT 'DRAFT', display_order integer NOT NULL DEFAULT 0, published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz, version integer NOT NULL DEFAULT 1,
  CONSTRAINT posts_display_order_check CHECK (display_order >= 0),
  CONSTRAINT posts_publish_timestamp CHECK (status <> 'PUBLISHED' OR published_at IS NOT NULL)
);
CREATE TABLE public.content_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  page_key varchar(80) NOT NULL, section_key varchar(80) NOT NULL, heading varchar(180) NOT NULL, body text NOT NULL,
  cta_label varchar(120), cta_url varchar(500), status "ContentStatus" NOT NULL DEFAULT 'DRAFT', display_order integer NOT NULL DEFAULT 0, published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz, version integer NOT NULL DEFAULT 1,
  CONSTRAINT content_sections_identity_unique UNIQUE(user_id, page_key, section_key),
  CONSTRAINT content_sections_display_order_check CHECK (display_order >= 0),
  CONSTRAINT content_sections_cta_pair CHECK ((cta_label IS NULL) = (cta_url IS NULL)),
  CONSTRAINT content_sections_publish_timestamp CHECK (status <> 'PUBLISHED' OR published_at IS NOT NULL)
);
CREATE INDEX posts_user_status_deleted_idx ON public.posts(user_id, status, deleted_at);
CREATE INDEX posts_public_published_idx ON public.posts(status, published_at, deleted_at);
CREATE INDEX content_sections_user_status_deleted_idx ON public.content_sections(user_id, status, deleted_at);
CREATE INDEX content_sections_public_order_idx ON public.content_sections(page_key, status, display_order, deleted_at);
CREATE TRIGGER set_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();
CREATE TRIGGER set_content_sections_updated_at BEFORE UPDATE ON public.content_sections FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY; ALTER TABLE public.posts FORCE ROW LEVEL SECURITY;
ALTER TABLE public.content_sections ENABLE ROW LEVEL SECURITY; ALTER TABLE public.content_sections FORCE ROW LEVEL SECURITY;
GRANT SELECT ON public.posts, public.content_sections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts, public.content_sections TO authenticated;
CREATE POLICY posts_public_select ON public.posts FOR SELECT TO anon USING (status = 'PUBLISHED' AND deleted_at IS NULL);
CREATE POLICY posts_authenticated_select ON public.posts FOR SELECT TO authenticated USING (status = 'PUBLISHED' AND deleted_at IS NULL OR user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
CREATE POLICY posts_owner_admin_insert ON public.posts FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
CREATE POLICY posts_owner_admin_update ON public.posts FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin') WITH CHECK (user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
CREATE POLICY posts_owner_admin_delete ON public.posts FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
CREATE POLICY content_sections_public_select ON public.content_sections FOR SELECT TO anon USING (status = 'PUBLISHED' AND deleted_at IS NULL);
CREATE POLICY content_sections_authenticated_select ON public.content_sections FOR SELECT TO authenticated USING (status = 'PUBLISHED' AND deleted_at IS NULL OR user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
CREATE POLICY content_sections_owner_admin_insert ON public.content_sections FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
CREATE POLICY content_sections_owner_admin_update ON public.content_sections FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin') WITH CHECK (user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
CREATE POLICY content_sections_owner_admin_delete ON public.content_sections FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
