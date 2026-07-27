import "server-only";

export function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("Missing server-only DATABASE_URL.");
  }

  return databaseUrl;
}

export function getSupabaseServiceRoleKey() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error("Missing server-only SUPABASE_SERVICE_ROLE_KEY.");
  }

  return serviceRoleKey;
}
