import assert from "node:assert/strict";
import test from "node:test";
import {
  parseGoalForm,
  readSuccessCriteria,
} from "../src/features/goals/goal.schema";

function validForm() {
  const form = new FormData();
  form.set("title", "Launch CoffeeHub");
  form.set("status", "ACTIVE");
  form.set("priority", "HIGH");
  form.set("deadline", "2026-12-31");
  form.set("successCriteria", "Ship v1\nPass QA");
  return form;
}

test("parses a complete Goal form", () => {
  const parsed = parseGoalForm(validForm());
  assert.equal(parsed.errors.length, 0);
  assert.equal(parsed.data?.title, "Launch CoffeeHub");
  assert.deepEqual(parsed.data?.successCriteria, ["Ship v1", "Pass QA"]);
  assert.equal(
    parsed.data?.deadline?.toISOString(),
    "2026-12-31T23:59:59.999Z",
  );
});
test("rejects invalid controlled Goal fields", () => {
  const form = validForm();
  form.set("title", "");
  form.set("status", "UNKNOWN");
  form.set("priority", "NOW");
  assert.equal(parseGoalForm(form).errors.length, 3);
});
test("reads only string success criteria", () => {
  assert.deepEqual(readSuccessCriteria(["One", 2, null, "Two"]), [
    "One",
    "Two",
  ]);
  assert.deepEqual(readSuccessCriteria({}), []);
});
