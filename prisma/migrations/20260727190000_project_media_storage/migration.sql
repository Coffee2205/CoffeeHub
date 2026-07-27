CREATE TYPE "ProjectMediaKind" AS ENUM ('COVER', 'GALLERY');
CREATE TABLE public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  bucket varchar(63) NOT NULL, object_path varchar(500) NOT NULL UNIQUE, original_name varchar(255) NOT NULL,
  mime_type varchar(100) NOT NULL, size_bytes integer NOT NULL CHECK (size_bytes > 0 AND size_bytes <= 5242880),
  alt_text varchar(240) NOT NULL CHECK (length(trim(alt_text)) > 0), width integer, height integer,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz
);
CREATE TABLE public.project_media (
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  media_asset_id uuid NOT NULL REFERENCES public.media_assets(id) ON DELETE CASCADE,
  kind "ProjectMediaKind" NOT NULL DEFAULT 'GALLERY', display_order integer NOT NULL DEFAULT 0 CHECK (display_order >= 0),
  PRIMARY KEY (project_id, media_asset_id)
);
CREATE INDEX media_assets_user_deleted_idx ON public.media_assets(user_id, deleted_at);
CREATE INDEX project_media_asset_idx ON public.project_media(media_asset_id);
CREATE INDEX project_media_order_idx ON public.project_media(project_id, kind, display_order);
CREATE UNIQUE INDEX project_media_one_cover_idx ON public.project_media(project_id) WHERE kind = 'COVER';
CREATE TRIGGER set_media_assets_updated_at BEFORE UPDATE ON public.media_assets FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY; ALTER TABLE public.media_assets FORCE ROW LEVEL SECURITY;
ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY; ALTER TABLE public.project_media FORCE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_assets, public.project_media TO authenticated;
GRANT SELECT ON public.media_assets, public.project_media TO anon;
CREATE POLICY media_assets_select ON public.media_assets FOR SELECT TO anon, authenticated USING (
  deleted_at IS NULL AND (user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin' OR EXISTS (
    SELECT 1 FROM public.project_media pm JOIN public.projects p ON p.id = pm.project_id
    WHERE pm.media_asset_id = media_assets.id AND p.status = 'PUBLISHED' AND p.deleted_at IS NULL
  ))
);
CREATE POLICY media_assets_admin_all ON public.media_assets FOR ALL TO authenticated
  USING ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin')
  WITH CHECK (user_id = (SELECT auth.uid()) AND (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
CREATE POLICY project_media_select ON public.project_media FOR SELECT TO anon, authenticated USING (
  EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_media.project_id AND (p.status = 'PUBLISHED' AND p.deleted_at IS NULL OR p.user_id = (SELECT auth.uid()) OR (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin'))
);
CREATE POLICY project_media_admin_all ON public.project_media FOR ALL TO authenticated
  USING ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin')
  WITH CHECK ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('project-media', 'project-media', false, 5242880, ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO UPDATE SET public = false, file_size_limit = EXCLUDED.file_size_limit, allowed_mime_types = EXCLUDED.allowed_mime_types;
CREATE POLICY project_media_objects_select ON storage.objects FOR SELECT TO anon, authenticated USING (
  bucket_id = 'project-media' AND ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin' OR EXISTS (
    SELECT 1 FROM public.media_assets ma JOIN public.project_media pm ON pm.media_asset_id = ma.id JOIN public.projects p ON p.id = pm.project_id
    WHERE ma.object_path = name AND ma.deleted_at IS NULL AND p.status = 'PUBLISHED' AND p.deleted_at IS NULL
  ))
);
CREATE POLICY project_media_objects_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'project-media' AND (storage.foldername(name))[1] = (SELECT auth.uid())::text AND (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin'
);
CREATE POLICY project_media_objects_update ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'project-media' AND owner_id = (SELECT auth.uid())::text AND (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin')
  WITH CHECK (bucket_id = 'project-media' AND owner_id = (SELECT auth.uid())::text AND (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
CREATE POLICY project_media_objects_delete ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'project-media' AND owner_id = (SELECT auth.uid())::text AND (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin'
);
