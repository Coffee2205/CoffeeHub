import assert from "node:assert/strict";
import test from "node:test";
import {
  profileAvatarPath,
  projectImagePath,
  validateImageUpload,
} from "../src/lib/supabase/storage";
const id = "11111111-1111-4111-8111-111111111111";
test("validates project images", () => {
  assert.equal(
    validateImageUpload({ size: 1024, type: "image/webp" }).valid,
    true,
  );
  assert.equal(
    validateImageUpload({ size: 0, type: "image/webp" }).valid,
    false,
  );
  assert.equal(
    validateImageUpload({ size: 1024, type: "image/svg+xml" }).valid,
    false,
  );
});
test("builds controlled object paths", () => {
  assert.equal(
    projectImagePath(id, id, "image/png", id),
    `${id}/${id}/${id}.png`,
  );
  assert.throws(() => projectImagePath(id, id, "image/svg+xml", id));
});
test("builds controlled profile avatar paths", () => {
  assert.equal(
    profileAvatarPath(id, "image/webp", id),
    `${id}/profile/${id}.webp`,
  );
  assert.throws(() => profileAvatarPath(id, "image/svg+xml", id));
});
