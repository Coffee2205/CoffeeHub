import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseTaskForm } from "../src/features/tasks/task.schema";
import { parseStageForm } from "../src/features/roadmaps/roadmap.schema";
import { parseNoteInput } from "../src/features/notes/note.schema";

test("planning migration preserves ownership and idempotency invariants", () => {
  const sql = readFileSync("prisma/migrations/20260817120000_normalize_planning_model/migration.sql", "utf8");
  for (const relation of ["goal", "roadmap", "roadmap_stage", "task", "event"]) {
    assert.match(sql, new RegExp(`notes_${relation}_id_user_id_fkey`));
  }
  assert.match(sql, /tasks_user_id_external_key_key[\s\S]+WHERE external_key IS NOT NULL/i);
  assert.match(sql, /events_user_id_external_key_key[\s\S]+WHERE external_key IS NOT NULL/i);
  assert.match(sql, /estimated_minutes > 0/);
});

test("Task stores planning metadata without becoming an Event or Note", () => {
  const form = new FormData();
  Object.entries({ title: "N4 - Reading", status: "TODO", priority: "HIGH", estimatedMinutes: "120", expectedResult: "Score at least 70%", resources: "Dũng Mori N4 | course\nAnki | app", source: "japanese-study-plan-2026-2027", externalKey: "japanese-study-plan:reading-1" }).forEach(([key, value]) => form.set(key, value));
  const parsed = parseTaskForm(form);
  assert.equal(parsed.errors.length, 0);
  assert.equal(parsed.data?.estimatedMinutes, 120);
  assert.deepEqual(parsed.data?.resources, [{ name: "Dũng Mori N4", type: "course" }, { name: "Anki", type: "app" }]);
});

test("Stage supports milestone dates, status and success criteria", () => {
  const form = new FormData();
  Object.entries({ title: "N4", startsAt: "2026-08-17", endsAt: "2027-02-28", status: "ACTIVE", successCriteria: "Finish required tasks\nPass mock test" }).forEach(([key, value]) => form.set(key, value));
  const parsed = parseStageForm(form);
  assert.equal(parsed.errors.length, 0);
  assert.equal(parsed.data?.status, "ACTIVE");
  assert.equal(parsed.data?.successCriteria.length, 2);
});

test("Note remains independently valid while accepting optional context", () => {
  const independent = parseNoteInput({ title: "Japanese Grammar Notes", content: "Lesson" });
  const contextual = parseNoteInput({ title: "N4 Error Log", content: "Lesson", goalId: "goal", taskId: "task" });
  assert.ok(independent.data);
  assert.equal(contextual.data?.goalId, "goal");
  assert.equal(contextual.data?.taskId, "task");
});
