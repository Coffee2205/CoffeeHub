export type NoteDraft = {
  noteId: string;
  userId: string;
  title: string;
  content: string;
  version: number;
  updatedAt: number;
  idempotencyKey: string;
  attempts: number;
  nextAttemptAt: number;
};

const DATABASE = "coffeehub-notes";
const STORE = "drafts";

function openDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DATABASE, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE, { keyPath: "noteId" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function transaction<T>(
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
) {
  const database = await openDatabase();
  return new Promise<T>((resolve, reject) => {
    const request = operation(
      database.transaction(STORE, mode).objectStore(STORE),
    );
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  }).finally(() => database.close());
}

export function readNoteDraft(noteId: string) {
  return transaction<NoteDraft | undefined>("readonly", (store) =>
    store.get(noteId),
  );
}

export function writeNoteDraft(draft: NoteDraft) {
  return transaction<IDBValidKey>("readwrite", (store) => store.put(draft));
}

export function removeNoteDraft(noteId: string) {
  return transaction<undefined>("readwrite", (store) => store.delete(noteId));
}

export function clearNoteDrafts() {
  return new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DATABASE);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () =>
      reject(new Error("Note draft cleanup was blocked."));
  });
}

export function createNoteDraft(
  input: Omit<NoteDraft, "idempotencyKey" | "attempts" | "nextAttemptAt">,
): NoteDraft {
  return {
    ...input,
    idempotencyKey: crypto.randomUUID(),
    attempts: 0,
    nextAttemptAt: 0,
  };
}

export function mergeNoteDraft(
  current: NoteDraft | undefined,
  input: Omit<NoteDraft, "idempotencyKey" | "attempts" | "nextAttemptAt">,
): NoteDraft {
  return current ? { ...current, ...input } : createNoteDraft(input);
}

export function postponeNoteDraft(
  draft: NoteDraft,
  now = Date.now(),
): NoteDraft {
  const attempts = draft.attempts + 1;
  const delay = Math.min(30_000, 1_000 * 2 ** Math.min(attempts - 1, 5));
  return { ...draft, attempts, nextAttemptAt: now + delay };
}
