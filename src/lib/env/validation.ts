const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

export function requireWebUrl(name: string, value: string | undefined) {
  if (!value) throw new Error(`Missing ${name}.`);
  let url: URL;
  try { url = new URL(value); } catch { throw new Error(`${name} must be a valid URL.`); }
  if (url.protocol !== "https:" && !(url.protocol === "http:" && LOCAL_HOSTS.has(url.hostname))) {
    throw new Error(`${name} must use HTTPS, except on localhost.`);
  }
  return url.toString().replace(/\/$/, "");
}

export function requirePublishableKey(value: string | undefined) {
  if (!value) throw new Error("Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
  if (value.startsWith("sb_secret_") || value.startsWith("eyJ")) {
    throw new Error("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must not contain a secret or legacy service-role key.");
  }
  return value;
}

export function requirePostgresUrl(name: string, value: string | undefined) {
  if (!value) throw new Error(`Missing server-only ${name}.`);
  let url: URL;
  try { url = new URL(value); } catch { throw new Error(`${name} must be a valid PostgreSQL URL.`); }
  if (!["postgres:", "postgresql:"].includes(url.protocol)) throw new Error(`${name} must use the postgres or postgresql protocol.`);
  return value;
}
