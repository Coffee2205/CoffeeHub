import assert from "node:assert/strict";
import test from "node:test";
import { parseProfileForm } from "../src/features/profile/profile.schema";
test("parses valid profile content", () => {
  const form = new FormData();
  form.set("displayName", "CoffeeHub Owner");
  form.set("headline", "Builder");
  form.set("bio", "Building useful software.");
  form.set("status", "DRAFT");
  assert.equal(parseProfileForm(form).errors.length, 0);
});
test("rejects missing profile content and invalid status", () => {
  const form = new FormData();
  form.set("status", "ACTIVE");
  assert.equal(parseProfileForm(form).errors.length, 4);
});
