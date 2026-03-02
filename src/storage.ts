import { encrypt, decrypt } from "./crypto";

const DB_NAME = "couples-communicator";
const DB_VERSION = 1;
const STORE_NAME = "conversations";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function dbGet(db: IDBDatabase, key: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function dbPut(db: IDBDatabase, key: string, value: unknown): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(value, key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

function dbDelete(db: IDBDatabase, key: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

function storageKey(userId: string): string {
  return `history:${userId}`;
}

export async function saveConversation(userId: string, messages: Message[]): Promise<void> {
  const plaintext = JSON.stringify(messages);
  const { ciphertext, iv } = await encrypt(plaintext);
  const db = await openDb();
  await dbPut(db, storageKey(userId), { ciphertext, iv });
  db.close();
}

export async function loadConversation(userId: string): Promise<Message[]> {
  const db = await openDb();
  const record = await dbGet(db, storageKey(userId)) as { ciphertext: string; iv: string } | undefined;
  db.close();

  if (!record) return [];

  const plaintext = await decrypt(record.ciphertext, record.iv);
  return JSON.parse(plaintext) as Message[];
}

export async function clearConversation(userId: string): Promise<void> {
  const db = await openDb();
  await dbDelete(db, storageKey(userId));
  db.close();
}
