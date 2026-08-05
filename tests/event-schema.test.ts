import assert from "node:assert/strict";
import test from "node:test";
import {
  formatDateTimeLocal,
  localDateTimeToUtc,
  parseEventForm,
} from "../src/features/calendar/event.schema";

function validForm() {
  const form = new FormData();
  form.set("title", "Lập kế hoạch tuần");
  form.set("startsAt", "2026-08-10T09:00");
  form.set("endsAt", "2026-08-10T10:30");
  form.set("timezone", "Asia/Ho_Chi_Minh");
  form.set("recurrence", "WEEKLY");
  return form;
}

test("parses an Event in its explicit timezone", () => {
  const result = parseEventForm(validForm());
  assert.deepEqual(result.errors, []);
  assert.equal(result.data?.startsAt.toISOString(), "2026-08-10T02:00:00.000Z");
  assert.equal(result.data?.endsAt?.toISOString(), "2026-08-10T03:30:00.000Z");
  assert.equal(result.data?.recurrence, "WEEKLY");
});

test("rejects an invalid range, timezone and recurrence", () => {
  const range = validForm();
  range.set("endsAt", "2026-08-10T08:00");
  assert.match(parseEventForm(range).errors.join(" "), /bắt đầu phải trước/);

  const invalid = validForm();
  invalid.set("timezone", "Not/A_Timezone");
  invalid.set("recurrence", "YEARLY");
  const errors = parseEventForm(invalid).errors.join(" ");
  assert.match(errors, /Múi giờ không hợp lệ/);
  assert.match(errors, /Chu kỳ lặp không hợp lệ/);
});

test("formats stored UTC instants for datetime-local editing", () => {
  const date = localDateTimeToUtc("2026-12-24T18:45", "Asia/Ho_Chi_Minh");
  assert.ok(date);
  assert.equal(
    formatDateTimeLocal(date, "Asia/Ho_Chi_Minh"),
    "2026-12-24T18:45",
  );
});
