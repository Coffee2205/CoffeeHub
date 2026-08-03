import assert from "node:assert/strict";
import test from "node:test";
import { isProjectOngoing, parseProjectForm } from "../src/features/projects/project.schema";
function valid() { const form = new FormData(); Object.entries({ title: "CoffeeHub", slug: "coffeehub", summary: "Workspace", description: "Description", status: "DRAFT", displayOrder: "0" }).forEach(([key, value]) => form.set(key, value)); return form; }
test("parses valid input", () => { const result = parseProjectForm(valid()); assert.equal(result.errors.length, 0); assert.equal(result.data?.slug, "coffeehub"); });
test("rejects invalid slug and dates", () => { const form = valid(); form.set("slug", "Bad Slug"); form.set("startedAt", "2026-08-02"); form.set("endedAt", "2026-08-01"); assert.equal(parseProjectForm(form).errors.length, 2); });
test("stores an ongoing project without an end date", () => { const form = valid(); form.set("startedAt", "2026-08-02"); form.set("endedAt", "2026-08-03"); form.set("ongoing", "on"); const result = parseProjectForm(form); assert.equal(result.errors.length, 0); assert.equal(result.data?.endedAt, null); });
test("requires a start date for an ongoing project", () => { const form = valid(); form.set("ongoing", "on"); assert.match(parseProjectForm(form).errors.join(" "), /ngày bắt đầu/i); });
test("identifies ongoing projects from their persisted dates", () => { assert.equal(isProjectOngoing(new Date("2026-08-02"), null), true); assert.equal(isProjectOngoing(new Date("2026-08-02"), new Date("2026-08-03")), false); assert.equal(isProjectOngoing(null, null), false); });
