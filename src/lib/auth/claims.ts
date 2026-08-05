export type CurrentUser = {
  id: string;
  email: string | null;
  isAdmin: boolean;
};

export function toCurrentUser(claims: unknown): CurrentUser | null {
  if (
    !claims ||
    typeof claims !== "object" ||
    !("sub" in claims) ||
    typeof claims.sub !== "string"
  ) {
    return null;
  }

  const email =
    "email" in claims && typeof claims.email === "string" ? claims.email : null;
  const appMetadata =
    "app_metadata" in claims &&
    typeof claims.app_metadata === "object" &&
    claims.app_metadata !== null
      ? claims.app_metadata
      : null;
  const isAdmin =
    appMetadata !== null &&
    "role" in appMetadata &&
    appMetadata.role === "admin";

  return { id: claims.sub, email, isAdmin };
}
