import test from "node:test";
import assert from "node:assert/strict";
import {
  parsePreferenceForm,
  parseReminderForm,
} from "../src/features/notifications/notification.schema";
test("parses a one-time reminder", () => {
  const form = new FormData();
  form.set("title", "Review plan");
  form.set("scheduledFor", "2026-08-09T09:00");
  form.set("timezone", "Asia/Ho_Chi_Minh");
  form.set("recurrence", "NONE");
  const result = parseReminderForm(form);
  assert.deepEqual(result.errors, []);
  assert.equal(
    result.data?.scheduledFor.toISOString(),
    "2026-08-09T02:00:00.000Z",
  );
});
test("rejects multiple reminder entities", () => {
  const form = new FormData();
  form.set("title", "Invalid");
  form.set("scheduledFor", "2026-08-09T09:00");
  form.set("timezone", "UTC");
  form.set("recurrence", "DAILY");
  form.set("goalId", "goal");
  form.set("taskId", "task");
  assert.match(parseReminderForm(form).errors.join(" "), /Chỉ chọn một entity/);
});
test("validates notification lead time", () => {
  const form = new FormData();
  form.set("defaultLeadMinutes", "15");
  form.set("inAppEnabled", "on");
  assert.deepEqual(parsePreferenceForm(form).data, {
    inAppEnabled: true,
    browserEnabled: false,
    defaultLeadMinutes: 15,
  });
  form.set("defaultLeadMinutes", "10081");
  assert.equal(parsePreferenceForm(form).data, undefined);
});
