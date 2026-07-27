import "server-only";

import { requirePostgresUrl } from "@/lib/env/validation";

export function getDatabaseUrl() {
  return requirePostgresUrl("DATABASE_URL", process.env.DATABASE_URL);
}
