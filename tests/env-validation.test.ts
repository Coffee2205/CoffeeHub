import assert from "node:assert/strict";
import test from "node:test";
import { requirePostgresUrl, requirePublishableKey, requireWebUrl } from "../src/lib/env/validation";

test("accepts HTTPS and local HTTP URLs", () => { assert.equal(requireWebUrl("APP_URL", "https://coffeehub.example/"), "https://coffeehub.example"); assert.equal(requireWebUrl("APP_URL", "http://localhost:3000"), "http://localhost:3000"); });
test("rejects insecure remote URLs", () => { assert.throws(() => requireWebUrl("APP_URL", "http://coffeehub.example"), /HTTPS/); });
test("rejects privileged keys in a public variable", () => { assert.throws(() => requirePublishableKey("sb_secret_example"), /must not contain/); assert.throws(() => requirePublishableKey("eyJlegacy-service-role"), /must not contain/); });
test("requires PostgreSQL connection URLs", () => { const url = "postgresql://user:pass@localhost:5432/db"; assert.equal(requirePostgresUrl("DATABASE_URL", url), url); assert.throws(() => requirePostgresUrl("DATABASE_URL", "https://example.com"), /postgres/); });
