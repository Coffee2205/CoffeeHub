import assert from "node:assert/strict";
import test from "node:test";

import { safeOwnerNextPath } from "../src/lib/auth/redirects";

test("allows exact and nested owner routes", () => {
  assert.equal(safeOwnerNextPath("/app"), "/app");
  assert.equal(
    safeOwnerNextPath("/app/goals?status=active"),
    "/app/goals?status=active",
  );
  assert.equal(safeOwnerNextPath("/admin"), "/admin");
  assert.equal(
    safeOwnerNextPath("/admin/projects/123/edit"),
    "/admin/projects/123/edit",
  );
});

test("rejects public, lookalike and protocol-relative redirects", () => {
  for (const candidate of [
    undefined,
    null,
    "",
    "/",
    "/application",
    "/administrator",
    "//example.com/app",
    "https://example.com/app",
  ]) {
    assert.equal(safeOwnerNextPath(candidate), "/app/dashboard");
  }
});
