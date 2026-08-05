export type NoteDraft = {
  noteId: string;
  userId: string;
  title: string;
  content: string;
  version: number;
  updatedAt: number;
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
