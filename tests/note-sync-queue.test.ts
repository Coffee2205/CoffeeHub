import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createNoteDraft,
  mergeNoteDraft,
  postponeNoteDraft,
} from "../src/features/sync/note-draft-store";

const input = {
  noteId: "note-1",
  userId: "user-1",
  title: "Draft",
  content: "First",
  version: 3,
  updatedAt: 100,
};

describe("note sync queue", () => {
  it("coalesces edits while preserving the idempotency key", () => {
    const queued = createNoteDraft(input);
    const merged = mergeNoteDraft(queued, {
      ...input,
      content: "Latest",
      updatedAt: 200,
    });

    assert.equal(merged.idempotencyKey, queued.idempotencyKey);
    assert.equal(merged.content, "Latest");
    assert.equal(merged.updatedAt, 200);
  });

  it("applies bounded exponential backoff", () => {
    const queued = createNoteDraft(input);
    const first = postponeNoteDraft(queued, 10_000);
    const second = postponeNoteDraft(first, 11_000);

    assert.equal(first.attempts, 1);
    assert.equal(first.nextAttemptAt, 11_000);
    assert.equal(second.attempts, 2);
    assert.equal(second.nextAttemptAt, 13_000);

    let capped = second;
    for (let index = 0; index < 10; index += 1) {
      capped = postponeNoteDraft(capped, 20_000);
    }
    assert.equal(capped.nextAttemptAt, 50_000);
  });
});
