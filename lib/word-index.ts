/**
 * 客户端搜索索引（仅浏览器端）
 *
 * 首次调用时 fetch /word-index.json，缓存到 module 级变量，
 * 之后所有搜索完全本地化（0 network）。
 */

export type IndexEntry = {
  w: string; // word
  f: number; // frequency level
  d: string; // first definition (snippet)
};

let cache: IndexEntry[] | null = null;
let inflight: Promise<IndexEntry[]> | null = null;

export async function loadIndex(): Promise<IndexEntry[]> {
  if (cache) return cache;
  if (inflight) return inflight;
  inflight = fetch("/word-index.json", {
    cache: "force-cache",
  })
    .then((r) => r.json() as Promise<IndexEntry[]>)
    .then((data) => {
      cache = data;
      inflight = null;
      return data;
    })
    .catch((err) => {
      inflight = null;
      throw err;
    });
  return inflight;
}

/**
 * 本地搜索：前缀匹配 > 包含匹配 > 释义命中
 * 返回 top N 候选词
 */
export function searchLocal(
  query: string,
  index: IndexEntry[],
  limit = 8,
): IndexEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const prefixMatches: IndexEntry[] = [];
  const substringMatches: IndexEntry[] = [];
  const defMatches: IndexEntry[] = [];

  for (const e of index) {
    const w = e.w.toLowerCase();
    if (w.startsWith(q)) {
      prefixMatches.push(e);
    } else if (w.includes(q)) {
      substringMatches.push(e);
    } else if (e.d && e.d.includes(q)) {
      defMatches.push(e);
    }
    // 提前停止避免遍历全量
    if (prefixMatches.length >= limit * 3) break;
  }

  // 前缀匹配按词长升序（更短的更精确）
  prefixMatches.sort(
    (a, b) => a.w.length - b.w.length || a.f - b.f,
  );

  return [...prefixMatches, ...substringMatches, ...defMatches].slice(
    0,
    limit,
  );
}
