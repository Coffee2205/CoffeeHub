import assert from "node:assert/strict";
import test from "node:test";

import { parseWorkspaceProfileForm } from "../src/features/profile/workspace-profile.schema";

test("parses owned workspace profile preferences", () => {
  const form = new FormData();
  form.set("workspaceName", "  My Focus Space  ");
  form.set("timezone", "Asia/Ho_Chi_Minh");
  assert.deepEqual(parseWorkspaceProfileForm(form), {
    data: { workspaceName: "My Focus Space", timezone: "Asia/Ho_Chi_Minh" },
    errors: [],
  });
});

test("allows a blank workspace name and rejects invalid timezones", () => {
  const valid = new FormData();
  valid.set("workspaceName", "  ");
  valid.set("timezone", "UTC");
  assert.equal(parseWorkspaceProfileForm(valid).data?.workspaceName, null);

  const invalid = new FormData();
  invalid.set("workspaceName", "x".repeat(121));
  invalid.set("timezone", "Not/A_Timezone");
  assert.equal(parseWorkspaceProfileForm(invalid).errors.length, 2);
});
