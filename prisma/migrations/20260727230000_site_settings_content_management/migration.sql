CREATE TYPE "SiteLinkKind" AS ENUM ('NAVIGATION', 'FOOTER', 'SOCIAL');
CREATE TABLE public.site_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  kind "SiteLinkKind" NOT NULL, label varchar(120) NOT NULL, url varchar(500) NOT NULL, open_new_tab boolean NOT NULL DEFAULT false,
  status "ContentStatus" NOT NULL DEFAULT 'DRAFT', display_order integer NOT NULL DEFAULT 0, published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz, version integer NOT NULL DEFAULT 1,
  CONSTRAINT site_links_display_order_check CHECK (display_order >= 0), CONSTRAINT site_links_publish_timestamp CHECK (status <> 'PUBLISHED' OR published_at IS NOT NULL)
);
CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  question varchar(240) NOT NULL, answer text NOT NULL, status "ContentStatus" NOT NULL DEFAULT 'DRAFT', display_order integer NOT NULL DEFAULT 0, published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz, version integer NOT NULL DEFAULT 1,
  CONSTRAINT faqs_display_order_check CHECK (display_order >= 0), CONSTRAINT faqs_publish_timestamp CHECK (status <> 'PUBLISHED' OR published_at IS NOT NULL)
);
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  site_name varchar(120) NOT NULL, tagline varchar(240) NOT NULL, footer_text varchar(500) NOT NULL, privacy_note text NOT NULL,
  seo_title varchar(70) NOT NULL, seo_description varchar(180) NOT NULL, canonical_url varchar(500), seo_image_path varchar(500),
  status "ContentStatus" NOT NULL DEFAULT 'DRAFT', published_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz, version integer NOT NULL DEFAULT 1,
  CONSTRAINT site_settings_publish_timestamp CHECK (status <> 'PUBLISHED' OR published_at IS NOT NULL)
);
CREATE INDEX site_links_user_status_deleted_idx ON public.site_links(user_id,status,deleted_at);
CREATE INDEX site_links_public_order_idx ON public.site_links(kind,status,display_order,deleted_at);
CREATE INDEX faqs_user_status_deleted_idx ON public.faqs(user_id,status,deleted_at);
CREATE INDEX faqs_public_order_idx ON public.faqs(status,display_order,deleted_at);
CREATE INDEX site_settings_public_status_idx ON public.site_settings(status,deleted_at);
CREATE TRIGGER set_site_links_updated_at BEFORE UPDATE ON public.site_links FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();
CREATE TRIGGER set_faqs_updated_at BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();
CREATE TRIGGER set_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();
ALTER TABLE public.site_links ENABLE ROW LEVEL SECURITY; ALTER TABLE public.site_links FORCE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY; ALTER TABLE public.faqs FORCE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY; ALTER TABLE public.site_settings FORCE ROW LEVEL SECURITY;
GRANT SELECT ON public.site_links, public.faqs, public.site_settings TO anon;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.site_links, public.faqs, public.site_settings TO authenticated;
CREATE POLICY site_links_public_select ON public.site_links FOR SELECT TO anon USING(status='PUBLISHED' AND deleted_at IS NULL);
CREATE POLICY site_links_authenticated_select ON public.site_links FOR SELECT TO authenticated USING(status='PUBLISHED' AND deleted_at IS NULL OR user_id=(SELECT auth.uid()) OR (SELECT auth.jwt())->'app_metadata'->>'role'='admin');
CREATE POLICY site_links_owner_admin_insert ON public.site_links FOR INSERT TO authenticated WITH CHECK(user_id=(SELECT auth.uid()) OR (SELECT auth.jwt())->'app_metadata'->>'role'='admin');
CREATE POLICY site_links_owner_admin_update ON public.site_links FOR UPDATE TO authenticated USING(user_id=(SELECT auth.uid()) OR (SELECT auth.jwt())->'app_metadata'->>'role'='admin') WITH CHECK(user_id=(SELECT auth.uid()) OR (SELECT auth.jwt())->'app_metadata'->>'role'='admin');
CREATE POLICY site_links_owner_admin_delete ON public.site_links FOR DELETE TO authenticated USING(user_id=(SELECT auth.uid()) OR (SELECT auth.jwt())->'app_metadata'->>'role'='admin');
CREATE POLICY faqs_public_select ON public.faqs FOR SELECT TO anon USING(status='PUBLISHED' AND deleted_at IS NULL);
CREATE POLICY faqs_authenticated_select ON public.faqs FOR SELECT TO authenticated USING(status='PUBLISHED' AND deleted_at IS NULL OR user_id=(SELECT auth.uid()) OR (SELECT auth.jwt())->'app_metadata'->>'role'='admin');
CREATE POLICY faqs_owner_admin_insert ON public.faqs FOR INSERT TO authenticated WITH CHECK(user_id=(SELECT auth.uid()) OR (SELECT auth.jwt())->'app_metadata'->>'role'='admin');
CREATE POLICY faqs_owner_admin_update ON public.faqs FOR UPDATE TO authenticated USING(user_id=(SELECT auth.uid()) OR (SELECT auth.jwt())->'app_metadata'->>'role'='admin') WITH CHECK(user_id=(SELECT auth.uid()) OR (SELECT auth.jwt())->'app_metadata'->>'role'='admin');
CREATE POLICY faqs_owner_admin_delete ON public.faqs FOR DELETE TO authenticated USING(user_id=(SELECT auth.uid()) OR (SELECT auth.jwt())->'app_metadata'->>'role'='admin');
CREATE POLICY site_settings_public_select ON public.site_settings FOR SELECT TO anon USING(status='PUBLISHED' AND deleted_at IS NULL);
CREATE POLICY site_settings_authenticated_select ON public.site_settings FOR SELECT TO authenticated USING(status='PUBLISHED' AND deleted_at IS NULL OR user_id=(SELECT auth.uid()) OR (SELECT auth.jwt())->'app_metadata'->>'role'='admin');
CREATE POLICY site_settings_owner_admin_insert ON public.site_settings FOR INSERT TO authenticated WITH CHECK(user_id=(SELECT auth.uid()) OR (SELECT auth.jwt())->'app_metadata'->>'role'='admin');
CREATE POLICY site_settings_owner_admin_update ON public.site_settings FOR UPDATE TO authenticated USING(user_id=(SELECT auth.uid()) OR (SELECT auth.jwt())->'app_metadata'->>'role'='admin') WITH CHECK(user_id=(SELECT auth.uid()) OR (SELECT auth.jwt())->'app_metadata'->>'role'='admin');
CREATE POLICY site_settings_owner_admin_delete ON public.site_settings FOR DELETE TO authenticated USING(user_id=(SELECT auth.uid()) OR (SELECT auth.jwt())->'app_metadata'->>'role'='admin');
