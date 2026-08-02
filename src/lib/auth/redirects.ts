const ownerRoutePrefixes = ["/app", "/admin"] as const;

export function safeOwnerNextPath(candidate: string | null | undefined) {
  if (!candidate || candidate.startsWith("//")) {
    return "/app/dashboard";
  }

  const isOwnerRoute = ownerRoutePrefixes.some(
    (prefix) => candidate === prefix || candidate.startsWith(`${prefix}/`),
  );

  return isOwnerRoute ? candidate : "/app/dashboard";
}
