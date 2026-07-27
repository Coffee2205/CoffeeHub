import assert from "node:assert/strict";
import test from "node:test";
import { parseSiteContentForm } from "../src/features/site-content/site-content.schema";
function base() { const form = new FormData(); form.set("status", "DRAFT"); form.set("displayOrder", "0"); form.set("body", "Useful content."); return form; }
test("parses post content", () => { const form = base(); form.set("title", "First post"); form.set("slug", "first-post"); form.set("excerpt", "Short summary."); assert.equal(parseSiteContentForm("post", form).errors.length, 0); });
test("rejects invalid post slug", () => { const form = base(); form.set("title", "First post"); form.set("slug", "Invalid Slug"); form.set("excerpt", "Short summary."); assert.equal(parseSiteContentForm("post", form).errors.length, 1); });
test("parses page section with internal CTA", () => { const form = base(); form.set("pageKey", "home"); form.set("sectionKey", "hero"); form.set("heading", "Build your goals"); form.set("ctaLabel", "Start now"); form.set("ctaUrl", "/login"); assert.equal(parseSiteContentForm("section", form).errors.length, 0); });
test("requires complete CTA pair", () => { const form = base(); form.set("pageKey", "home"); form.set("sectionKey", "hero"); form.set("heading", "Build your goals"); form.set("ctaLabel", "Start now"); assert.equal(parseSiteContentForm("section", form).errors.length, 1); });
