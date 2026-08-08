import test from "node:test";
import assert from "node:assert/strict";
import {
  parseChecklistForm,
  parseChecklistItemForm,
  summarizeChecklistItems,
} from "../src/features/checklists/checklist.schema";

test("parses an independent checklist", () => {
  const form = new FormData();
  form.set("title", "Release verification");
  form.set("description", "Verify the owner flow");

  const result = parseChecklistForm(form);

  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.data, {
    title: "Release verification",
    description: "Verify the owner flow",
    goalId: null,
    roadmapId: null,
    taskId: null,
  });
});

test("rejects more than one checklist context", () => {
  const form = new FormData();
  form.set("title", "Conflicting context");
  form.set("goalId", "goal-id");
  form.set("taskId", "task-id");

  assert.match(
    parseChecklistForm(form).errors.join(" "),
    /Chỉ chọn một ngữ cảnh/,
  );
});

test("validates checklist item titles", () => {
  const form = new FormData();
  form.set("title", " ");

  assert.equal(parseChecklistItemForm(form).data, undefined);
});

test("summarizes checklist progress from its own items", () => {
  assert.deepEqual(
    summarizeChecklistItems([
      { completed: true },
      { completed: false },
      { completed: true },
    ]),
    { total: 3, completed: 2, progress: 67 },
  );
  assert.deepEqual(summarizeChecklistItems([]), {
    total: 0,
    completed: 0,
    progress: 0,
  });
});
