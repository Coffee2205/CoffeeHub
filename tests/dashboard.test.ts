import assert from "node:assert/strict";
import test from "node:test";

import {
  getDashboardRanges,
  getGreeting,
} from "../src/features/dashboard/date-ranges";
import { calculateProgress } from "../src/features/dashboard/metrics";

test("builds Monday-based UTC dashboard ranges", () => {
  const ranges = getDashboardRanges(new Date("2026-07-29T15:30:00.000Z"));
  assert.equal(ranges.todayStart.toISOString(), "2026-07-29T00:00:00.000Z");
  assert.equal(ranges.tomorrowStart.toISOString(), "2026-07-30T00:00:00.000Z");
  assert.equal(ranges.weekStart.toISOString(), "2026-07-27T00:00:00.000Z");
  assert.equal(ranges.nextWeekStart.toISOString(), "2026-08-03T00:00:00.000Z");
});

test("calculates weekly progress without inventing data", () => {
  assert.deepEqual(calculateProgress([]), {
    completed: 0,
    total: 0,
    percentage: 0,
  });
  assert.deepEqual(calculateProgress(["COMPLETED", "TODO", "COMPLETED"]), {
    completed: 2,
    total: 3,
    percentage: 67,
  });
});

test("selects UTC greeting by hour", () => {
  assert.equal(getGreeting(new Date("2026-07-27T08:00:00Z")), "Chào buổi sáng");
  assert.equal(
    getGreeting(new Date("2026-07-27T13:00:00Z")),
    "Chào buổi chiều",
  );
  assert.equal(getGreeting(new Date("2026-07-27T20:00:00Z")), "Chào buổi tối");
});
