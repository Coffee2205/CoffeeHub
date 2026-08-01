import "server-only";

import { createClient } from "@/lib/supabase/server";

export const PROFILE_AVATAR_BUCKET = "profile-avatars";

export async function getProfileAvatarUrl(avatarPath: string | null | undefined) {
  if (!avatarPath) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from(PROFILE_AVATAR_BUCKET).createSignedUrl(avatarPath, 60 * 60);
  if (error) return null;
  return data.signedUrl;
}
