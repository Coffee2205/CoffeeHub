import assert from "node:assert/strict";
import test from "node:test";

import { toCurrentUser } from "../src/lib/auth/claims";

test("rejects missing or unverified claim shapes", () => {
  assert.equal(toCurrentUser(null), null);
  assert.equal(toCurrentUser({ email: "member@example.com" }), null);
});

test("maps a regular authenticated user without trusting user metadata", () => {
  assert.deepEqual(
    toCurrentUser({
      sub: "user-1",
      email: "member@example.com",
      app_metadata: { role: "member" },
      user_metadata: { role: "admin" },
    }),
    { id: "user-1", email: "member@example.com", isAdmin: false },
  );
});

test("accepts admin role only from app metadata", () => {
  assert.deepEqual(
    toCurrentUser({ sub: "admin-1", app_metadata: { role: "admin" } }),
    { id: "admin-1", email: null, isAdmin: true },
  );
});
