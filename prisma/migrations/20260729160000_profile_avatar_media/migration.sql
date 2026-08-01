ALTER TABLE public.profiles
  ADD COLUMN avatar_alt varchar(240),
  ADD COLUMN avatar_mime_type varchar(100),
  ADD COLUMN avatar_size_bytes integer,
  ADD CONSTRAINT profiles_avatar_alt_valid CHECK (avatar_alt IS NULL OR length(trim(avatar_alt)) > 0),
  ADD CONSTRAINT profiles_avatar_size_valid CHECK (avatar_size_bytes IS NULL OR (avatar_size_bytes > 0 AND avatar_size_bytes <= 5242880)),
  ADD CONSTRAINT profiles_avatar_metadata_complete CHECK (
    (avatar_path IS NULL AND avatar_alt IS NULL AND avatar_mime_type IS NULL AND avatar_size_bytes IS NULL)
    OR
    (avatar_path IS NOT NULL AND avatar_alt IS NOT NULL AND avatar_mime_type IS NOT NULL AND avatar_size_bytes IS NOT NULL)
  );

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('profile-avatars', 'profile-avatars', false, 5242880, ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO UPDATE SET public = false, file_size_limit = EXCLUDED.file_size_limit, allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY profile_avatar_objects_select ON storage.objects FOR SELECT TO anon, authenticated USING (
  bucket_id = 'profile-avatars' AND (
    owner_id = (SELECT auth.uid())::text
    OR (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin'
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.avatar_path = name AND p.status = 'PUBLISHED' AND p.deleted_at IS NULL
    )
  )
);
CREATE POLICY profile_avatar_objects_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'profile-avatars'
  AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  AND (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin'
);
CREATE POLICY profile_avatar_objects_update ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'profile-avatars' AND owner_id = (SELECT auth.uid())::text AND (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin')
  WITH CHECK (bucket_id = 'profile-avatars' AND owner_id = (SELECT auth.uid())::text AND (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
CREATE POLICY profile_avatar_objects_delete ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'profile-avatars' AND owner_id = (SELECT auth.uid())::text AND (SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin'
);

-- Rollback: drop the four profile_avatar_objects_* policies, delete the empty
-- profile-avatars bucket, then drop the avatar metadata columns and constraints.
