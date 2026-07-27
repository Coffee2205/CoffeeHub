import assert from "node:assert/strict";
import test from "node:test";
import { parseProjectForm } from "../src/features/projects/project.schema";
function valid() { const form = new FormData(); Object.entries({ title: "CoffeeHub", slug: "coffeehub", summary: "Workspace", description: "Description", status: "DRAFT", displayOrder: "0" }).forEach(([key, value]) => form.set(key, value)); return form; }
test("parses valid input", () => { const result = parseProjectForm(valid()); assert.equal(result.errors.length, 0); assert.equal(result.data?.slug, "coffeehub"); });
test("rejects invalid slug and dates", () => { const form = valid(); form.set("slug", "Bad Slug"); form.set("startedAt", "2026-08-02"); form.set("endedAt", "2026-08-01"); assert.equal(parseProjectForm(form).errors.length, 2); });
