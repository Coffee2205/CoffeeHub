import test from "node:test";
import assert from "node:assert/strict";
import {
  isTaskOverdue,
  parseTaskForm,
} from "../src/features/tasks/task.schema";
function valid() {
  const form = new FormData();
  form.set("title", "Ship Tasks");
  form.set("status", "TODO");
  form.set("priority", "HIGH");
  return form;
}
test("parses a valid task", () => {
  const result = parseTaskForm(valid());
  assert.equal(result.errors.length, 0);
  assert.equal(result.data?.title, "Ship Tasks");
});
test("rejects invalid task values", () => {
  const form = valid();
  form.set("title", "");
  form.set("status", "UNKNOWN");
  assert.ok(parseTaskForm(form).errors.length >= 2);
});
test("detects overdue only for active tasks", () => {
  const due = new Date("2025-01-01T00:00:00Z");
  const now = new Date("2025-01-02T00:00:00Z");
  assert.equal(isTaskOverdue(due, "TODO", now), true);
  assert.equal(isTaskOverdue(due, "COMPLETED", now), false);
  assert.equal(isTaskOverdue(null, "TODO", now), false);
});
