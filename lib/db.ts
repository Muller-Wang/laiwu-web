/**
 * IndexedDB schema for 来悟单词书 客户端学习数据
 *
 * 所有学习相关的状态都存本地（progress / sessions / plans / wrong_words / bookmarks）
 * 与 Supabase 词库表 (words) 完全解耦：词库走 Supabase，进度走 IndexedDB
 */
import { openDB, type DBSchema, type IDBPDatabase } from "idb";

const DB_NAME = "laiwu";
const DB_VERSION = 1;

export type ProgressState = "new" | "learning" | "review" | "relearning";

export type ProgressRow = {
  word: string;
  stability: number;
  difficulty: number;
  due: number; // timestamp ms
  last_review: number; // timestamp ms
  reps: number;
  lapses: number;
  state: ProgressState;
};

export type SessionRow = {
  id?: number;
  date: string; // YYYY-MM-DD
  learned_count: number;
  reviewed_count: number;
  duration_sec: number;
  plan_id: number | null;
};

export type PlanScope =
  | "all"
  | "freq1"
  | "freq2"
  | "freq3"
  | "freq12"
  | "custom";

export type PlanRow = {
  id?: number;
  name: string;
  scope: PlanScope;
  days: number;
  daily_target: number;
  start_date: string; // YYYY-MM-DD
  is_current: 1 | 0; // boolean as number for IDB index
  created_at: number;
};

export type WrongWordRow = {
  word: string;
  type: "mc_zh2en" | "mc_en2zh" | "spelling" | "dictation";
  mistake_count: number;
  last_mistake: number;
};

export type BookmarkRow = {
  word: string;
  added_at: number;
};

interface LaiwuDB extends DBSchema {
  progress: {
    key: string;
    value: ProgressRow;
    indexes: {
      "by-due": number;
      "by-state": ProgressState;
    };
  };
  sessions: {
    key: number;
    value: SessionRow;
    indexes: { "by-date": string };
  };
  plans: {
    key: number;
    value: PlanRow;
    indexes: { "by-current": number };
  };
  wrong_words: {
    key: string;
    value: WrongWordRow;
  };
  bookmarks: {
    key: string;
    value: BookmarkRow;
    indexes: { "by-added": number };
  };
}

let dbPromise: Promise<IDBPDatabase<LaiwuDB>> | null = null;

export function getDB() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("IndexedDB only available in browser"));
  }
  if (!dbPromise) {
    dbPromise = openDB<LaiwuDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("progress")) {
          const s = db.createObjectStore("progress", { keyPath: "word" });
          s.createIndex("by-due", "due");
          s.createIndex("by-state", "state");
        }
        if (!db.objectStoreNames.contains("sessions")) {
          const s = db.createObjectStore("sessions", {
            keyPath: "id",
            autoIncrement: true,
          });
          s.createIndex("by-date", "date");
        }
        if (!db.objectStoreNames.contains("plans")) {
          const s = db.createObjectStore("plans", {
            keyPath: "id",
            autoIncrement: true,
          });
          s.createIndex("by-current", "is_current");
        }
        if (!db.objectStoreNames.contains("wrong_words")) {
          db.createObjectStore("wrong_words", { keyPath: "word" });
        }
        if (!db.objectStoreNames.contains("bookmarks")) {
          const s = db.createObjectStore("bookmarks", { keyPath: "word" });
          s.createIndex("by-added", "added_at");
        }
      },
    });
  }
  return dbPromise;
}

// ============================================================
// progress
// ============================================================
export async function getProgress(word: string): Promise<ProgressRow | null> {
  const db = await getDB();
  return (await db.get("progress", word)) ?? null;
}

export async function putProgress(row: ProgressRow) {
  const db = await getDB();
  await db.put("progress", row);
}

export async function getAllProgress(): Promise<ProgressRow[]> {
  const db = await getDB();
  return db.getAll("progress");
}

export async function getDueProgress(now = Date.now()): Promise<ProgressRow[]> {
  const db = await getDB();
  const tx = db.transaction("progress", "readonly");
  const idx = tx.store.index("by-due");
  const range = IDBKeyRange.upperBound(now);
  const rows: ProgressRow[] = [];
  for await (const cursor of idx.iterate(range)) {
    rows.push(cursor.value);
  }
  return rows.sort((a, b) => a.due - b.due);
}

export async function countByState(): Promise<Record<ProgressState, number>> {
  const all = await getAllProgress();
  const counts: Record<ProgressState, number> = {
    new: 0,
    learning: 0,
    review: 0,
    relearning: 0,
  };
  for (const r of all) counts[r.state]++;
  return counts;
}

// ============================================================
// sessions
// ============================================================
export async function addSession(row: Omit<SessionRow, "id">) {
  const db = await getDB();
  await db.add("sessions", row);
}

export async function getSessionsLast(days: number): Promise<SessionRow[]> {
  const db = await getDB();
  const tx = db.transaction("sessions", "readonly");
  const all = await tx.store.getAll();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  return all.filter((s) => s.date >= cutoffStr);
}

export async function getStreakDays(): Promise<number> {
  const db = await getDB();
  const all = await db.getAll("sessions");
  if (all.length === 0) return 0;
  const dates = new Set(all.map((s) => s.date));
  let streak = 0;
  const cur = new Date();
  while (dates.has(cur.toISOString().slice(0, 10))) {
    streak++;
    cur.setDate(cur.getDate() - 1);
  }
  return streak;
}

// ============================================================
// plans
// ============================================================
export async function getCurrentPlan(): Promise<PlanRow | null> {
  const db = await getDB();
  const tx = db.transaction("plans", "readonly");
  const idx = tx.store.index("by-current");
  const rows = await idx.getAll(1);
  return rows[0] ?? null;
}

export async function setCurrentPlan(plan: Omit<PlanRow, "id" | "is_current" | "created_at">) {
  const db = await getDB();
  const tx = db.transaction("plans", "readwrite");
  // unset all current
  const all = await tx.store.getAll();
  for (const p of all) {
    if (p.is_current === 1) {
      p.is_current = 0;
      await tx.store.put(p);
    }
  }
  const id = await tx.store.add({
    ...plan,
    is_current: 1,
    created_at: Date.now(),
  });
  await tx.done;
  return id;
}

export async function listPlans(): Promise<PlanRow[]> {
  const db = await getDB();
  return db.getAll("plans");
}

// ============================================================
// wrong words
// ============================================================
export async function markWrong(word: string, type: WrongWordRow["type"]) {
  const db = await getDB();
  const existing = await db.get("wrong_words", word);
  await db.put("wrong_words", {
    word,
    type,
    mistake_count: (existing?.mistake_count ?? 0) + 1,
    last_mistake: Date.now(),
  });
}

export async function clearWrong(word: string) {
  const db = await getDB();
  await db.delete("wrong_words", word);
}

export async function listWrongWords(): Promise<WrongWordRow[]> {
  const db = await getDB();
  return db.getAll("wrong_words");
}

// ============================================================
// bookmarks
// ============================================================
export async function addBookmark(word: string) {
  const db = await getDB();
  await db.put("bookmarks", { word, added_at: Date.now() });
}

export async function removeBookmark(word: string) {
  const db = await getDB();
  await db.delete("bookmarks", word);
}

export async function isBookmarked(word: string): Promise<boolean> {
  const db = await getDB();
  return !!(await db.get("bookmarks", word));
}

export async function listBookmarks(): Promise<BookmarkRow[]> {
  const db = await getDB();
  const all = await db.getAll("bookmarks");
  return all.sort((a, b) => b.added_at - a.added_at);
}

// ============================================================
// 数据导出 / 导入
// ============================================================

export type BackupBundle = {
  version: 1;
  exported_at: number;
  progress: ProgressRow[];
  sessions: SessionRow[];
  plans: PlanRow[];
  wrong_words: WrongWordRow[];
  bookmarks: BookmarkRow[];
};

export async function exportAllData(): Promise<BackupBundle> {
  const db = await getDB();
  const [progress, sessions, plans, wrong_words, bookmarks] = await Promise.all([
    db.getAll("progress"),
    db.getAll("sessions"),
    db.getAll("plans"),
    db.getAll("wrong_words"),
    db.getAll("bookmarks"),
  ]);
  return {
    version: 1,
    exported_at: Date.now(),
    progress,
    sessions,
    plans,
    wrong_words,
    bookmarks,
  };
}

/** 导入 bundle。merge 模式（默认）保留旧数据 + 覆盖同 key；replace 模式清空旧数据再写入 */
export async function importBundle(
  bundle: BackupBundle,
  mode: "merge" | "replace" = "merge",
): Promise<{ counts: Record<string, number> }> {
  if (bundle.version !== 1) {
    throw new Error(`unsupported backup version: ${bundle.version}`);
  }
  const db = await getDB();

  if (mode === "replace") {
    const tx = db.transaction(
      ["progress", "sessions", "plans", "wrong_words", "bookmarks"],
      "readwrite",
    );
    await Promise.all([
      tx.objectStore("progress").clear(),
      tx.objectStore("sessions").clear(),
      tx.objectStore("plans").clear(),
      tx.objectStore("wrong_words").clear(),
      tx.objectStore("bookmarks").clear(),
    ]);
    await tx.done;
  }

  // 写入分批
  const tx2 = db.transaction(
    ["progress", "sessions", "plans", "wrong_words", "bookmarks"],
    "readwrite",
  );
  for (const r of bundle.progress) tx2.objectStore("progress").put(r);
  for (const r of bundle.sessions) {
    // 让 IDB 重新生成 id
    const { id: _omit, ...rest } = r;
    tx2.objectStore("sessions").add(rest as SessionRow);
  }
  for (const r of bundle.plans) {
    const { id: _omit, ...rest } = r;
    tx2.objectStore("plans").add(rest as PlanRow);
  }
  for (const r of bundle.wrong_words) tx2.objectStore("wrong_words").put(r);
  for (const r of bundle.bookmarks) tx2.objectStore("bookmarks").put(r);
  await tx2.done;

  return {
    counts: {
      progress: bundle.progress.length,
      sessions: bundle.sessions.length,
      plans: bundle.plans.length,
      wrong_words: bundle.wrong_words.length,
      bookmarks: bundle.bookmarks.length,
    },
  };
}

export async function clearAllData() {
  const db = await getDB();
  const tx = db.transaction(
    ["progress", "sessions", "plans", "wrong_words", "bookmarks"],
    "readwrite",
  );
  await Promise.all([
    tx.objectStore("progress").clear(),
    tx.objectStore("sessions").clear(),
    tx.objectStore("plans").clear(),
    tx.objectStore("wrong_words").clear(),
    tx.objectStore("bookmarks").clear(),
  ]);
  await tx.done;
}
