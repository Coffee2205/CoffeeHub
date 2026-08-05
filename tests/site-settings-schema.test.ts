import assert from "node:assert/strict";
import test from "node:test";
import {
  parseManagedForm,
  parseSettingForm,
} from "../src/features/site-settings/site-settings.schema";
function common() {
  const form = new FormData();
  form.set("status", "DRAFT");
  form.set("displayOrder", "0");
  return form;
}
test("parses internal navigation link", () => {
  const form = common();
  form.set("kind", "NAVIGATION");
  form.set("label", "About");
  form.set("url", "/about");
  assert.equal(parseManagedForm("link", form).errors.length, 0);
});
test("parses external social link", () => {
  const form = common();
  form.set("kind", "SOCIAL");
  form.set("label", "GitHub");
  form.set("url", "https://github.com/coffeehub");
  assert.equal(parseManagedForm("link", form).errors.length, 0);
});
test("rejects unsafe link protocol", () => {
  const form = common();
  form.set("kind", "FOOTER");
  form.set("label", "Unsafe");
  form.set("url", "javascript:alert(1)");
  assert.ok(parseManagedForm("link", form).errors.length > 0);
});
test("parses FAQ", () => {
  const form = common();
  form.set("question", "CoffeeHub là gì?");
  form.set("answer", "Một workspace quản lý mục tiêu cá nhân.");
  assert.equal(parseManagedForm("faq", form).errors.length, 0);
});
test("rejects incomplete FAQ", () => {
  const form = common();
  form.set("question", "CoffeeHub là gì?");
  assert.ok(parseManagedForm("faq", form).errors.length > 0);
});
function settings() {
  const form = new FormData();
  form.set("siteName", "CoffeeHub");
  form.set("tagline", "Plan and grow");
  form.set("footerText", "CoffeeHub");
  form.set("privacyNote", "We protect your data.");
  form.set("seoTitle", "CoffeeHub personal workspace");
  form.set(
    "seoDescription",
    "Manage goals and projects in one personal workspace.",
  );
  form.set("status", "PUBLISHED");
  return form;
}
test("parses site settings with canonical URL and image path", () => {
  const form = settings();
  form.set("canonicalUrl", "https://coffeehub.example");
  form.set("seoImagePath", "/images/og.jpg");
  assert.equal(parseSettingForm(form).errors.length, 0);
});
test("rejects invalid canonical URL and image path", () => {
  const form = settings();
  form.set("canonicalUrl", "/relative");
  form.set("seoImagePath", "images/og.jpg");
  assert.equal(parseSettingForm(form).errors.length, 2);
});
