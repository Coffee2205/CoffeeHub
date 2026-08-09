import assert from "node:assert/strict";
import test from "node:test";
import { noteOwnerWhere } from "../src/features/notes/note-ownership";
import { mobileNavigation } from "../src/components/navigation/navigation-items";

test("Note soft delete is constrained to the authenticated owner and active row", () => {
  assert.deepEqual(noteOwnerWhere("owner-a", "note-a"), {
    id: "note-a",
    userId: "owner-a",
    deletedAt: null,
  });
});

test("mobile navigation exposes AI Assistant", () => {
  assert.equal(
    mobileNavigation.some((item) => item.href === "/app/ai"),
    true,
  );
});
