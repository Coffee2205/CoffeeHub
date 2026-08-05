import assert from "node:assert/strict";
import test from "node:test";
import { parseResumeForm } from "../src/features/resume/resume.schema";
function base() {
  const form = new FormData();
  form.set("status", "DRAFT");
  form.set("displayOrder", "0");
  return form;
}
test("parses experience content", () => {
  const form = base();
  form.set("role", "Engineer");
  form.set("organization", "CoffeeHub");
  form.set("description", "Built products.");
  form.set("startedAt", "2025-01-01");
  assert.equal(parseResumeForm("experience", form).errors.length, 0);
});
test("validates experience date order", () => {
  const form = base();
  form.set("role", "Engineer");
  form.set("organization", "CoffeeHub");
  form.set("description", "Built products.");
  form.set("startedAt", "2025-02-01");
  form.set("endedAt", "2025-01-01");
  assert.equal(parseResumeForm("experience", form).errors.length, 1);
});
test("parses skill content and validates proficiency", () => {
  const form = base();
  form.set("name", "TypeScript");
  form.set("category", "Engineering");
  form.set("proficiency", "5");
  assert.equal(parseResumeForm("skill", form).errors.length, 0);
  form.set("proficiency", "6");
  assert.equal(parseResumeForm("skill", form).errors.length, 1);
});
test("parses education content", () => {
  const form = base();
  form.set("institution", "University");
  form.set("degree", "Bachelor");
  assert.equal(parseResumeForm("education", form).errors.length, 0);
});
