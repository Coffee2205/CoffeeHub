import { requirePublishableKey, requireWebUrl } from "@/lib/env/validation";

export function getPublicSupabaseEnv() {
  return {
    url: requireWebUrl(
      "NEXT_PUBLIC_SUPABASE_URL",
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    ),
    publishableKey: requirePublishableKey(
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    ),
  } as const;
}

export function getPublicAppUrl() {
  return requireWebUrl("NEXT_PUBLIC_APP_URL", process.env.NEXT_PUBLIC_APP_URL);
}
