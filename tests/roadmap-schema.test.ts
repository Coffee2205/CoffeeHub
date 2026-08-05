import assert from "node:assert/strict";
import test from "node:test";
import {
  milestoneProgress,
  parseRoadmapForm,
  parseStageForm,
} from "../src/features/roadmaps/roadmap.schema";

test("validates roadmap and milestone inputs", () => {
  const form = new FormData();
  form.set("title", "Launch plan");
  form.set("description", "Three milestones");
  assert.equal(parseRoadmapForm(form).errors.length, 0);
  assert.equal(parseStageForm(form).data?.title, "Launch plan");
  form.set("title", "");
  assert.equal(parseStageForm(form).errors.length, 1);
});
test("rejects oversized roadmap fields", () => {
  const form = new FormData();
  form.set("title", "x".repeat(181));
  form.set("description", "x".repeat(3001));
  assert.equal(parseRoadmapForm(form).errors.length, 2);
});
test("derives milestone status and progress from Tasks", () => {
  assert.deepEqual(milestoneProgress([]), {
    completed: 0,
    percentage: 0,
    status: "PLANNED",
  });
  assert.deepEqual(milestoneProgress(["TODO", "COMPLETED"]), {
    completed: 1,
    percentage: 50,
    status: "IN_PROGRESS",
  });
  assert.deepEqual(milestoneProgress(["COMPLETED", "COMPLETED"]), {
    completed: 2,
    percentage: 100,
    status: "COMPLETED",
  });
});
test("does not count cancelled Tasks as milestone progress", () => {
  assert.deepEqual(milestoneProgress(["TODO", "CANCELLED"]), {
    completed: 0,
    percentage: 0,
    status: "PLANNED",
  });
});
