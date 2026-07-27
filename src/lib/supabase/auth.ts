import "server-only";

import { redirect } from "next/navigation";

import { toCurrentUser } from "@/lib/auth/claims";
import { createClient } from "@/lib/supabase/server";

export async function getVerifiedClaims() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error) {
    return null;
  }

  return data?.claims ?? null;
}

export async function requireUser() {
  const user = toCurrentUser(await getVerifiedClaims());

  if (!user) {
    redirect("/login?reason=session-expired&next=/app/dashboard");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireUser();

  if (!user.isAdmin) {
    redirect("/unauthorized");
  }

  return user;
}
