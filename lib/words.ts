/**
 * 词库数据访问层
 *
 * 双路降级：
 *   - 配置了 Supabase → 走数据库
 *   - 否则 → 走本地 data/words.json
 *
 * 这样在用户提供 key 之前，整个网站也能跑通。
 */
import { supabase, isSupabaseConfigured, type WordRow, type WordData } from "./supabase";
import wordsJson from "@/data/words.json";

type RawEntry = WordData;

function entryToRow(e: RawEntry, id: number): WordRow {
  const posList = Array.from(
    new Set(
      (e.core_meanings ?? [])
        .map((m) => m.pos?.trim())
        .filter((x): x is string => !!x),
    ),
  );
  return {
    id,
    word: e.word,
    pronunciation_us: e.pronunciation_us ?? null,
    pronunciation_uk: e.pronunciation_uk ?? null,
    frequency_level: e.frequency_level ?? 2,
    has_slang: (e.slang_meanings?.length ?? 0) > 0,
    has_mnemonic: !!e.mnemonic,
    pos_list: posList,
    data: e,
  };
}

const mockRows: WordRow[] = (wordsJson as RawEntry[]).map((e, i) =>
  entryToRow(e, i + 1),
);

export type ListParams = {
  q?: string;
  freq?: number;
  pos?: string[];
  hasSlang?: boolean;
  hasMnemonic?: boolean;
  page?: number;
  pageSize?: number;
};

export type ListResult = { items: WordRow[]; total: number };

export async function listWords(params: ListParams = {}): Promise<ListResult> {
  const {
    q,
    freq,
    pos,
    hasSlang,
    hasMnemonic,
    page = 1,
    pageSize = 30,
  } = params;

  if (isSupabaseConfigured && supabase) {
    let query = supabase.from("words").select("*", { count: "exact" });
    if (q) {
      // 仅按词形模糊匹配（PostgREST 对 JSONB::text cast 支持不稳，已退回 word ilike）
      const esc = q.replace(/[,()]/g, " ").trim();
      query = query.or(`word.ilike.%${esc}%`);
    }
    if (freq) query = query.eq("frequency_level", freq);
    if (pos && pos.length > 0) query = query.contains("pos_list", pos);
    if (hasSlang) query = query.eq("has_slang", true);
    if (hasMnemonic) query = query.eq("has_mnemonic", true);
    query = query
      .order("frequency_level", { ascending: true })
      .order("word", { ascending: true })
      .range((page - 1) * pageSize, page * pageSize - 1);

    const { data, count, error } = await query;
    if (error) throw error;
    return { items: (data as WordRow[]) ?? [], total: count ?? 0 };
  }

  // mock filter
  let filtered = mockRows;
  if (q) {
    const qq = q.toLowerCase().trim();
    if (qq) {
      // 扩展：词形 + 释义 + 例句一并搜索
      filtered = filtered.filter((r) => {
        if (r.word.toLowerCase().includes(qq)) return true;
        const meanings = r.data.core_meanings ?? [];
        if (meanings.some((m) => m.definition.toLowerCase().includes(qq)))
          return true;
        const example = r.data.example;
        if (example?.text && example.text.toLowerCase().includes(qq))
          return true;
        if (example?.translation && example.translation.includes(qq))
          return true;
        return false;
      });
    }
  }
  if (freq) filtered = filtered.filter((r) => r.frequency_level === freq);
  if (pos && pos.length > 0) {
    filtered = filtered.filter((r) =>
      pos.some((p) => r.pos_list.includes(p)),
    );
  }
  if (hasSlang) filtered = filtered.filter((r) => r.has_slang);
  if (hasMnemonic) filtered = filtered.filter((r) => r.has_mnemonic);

  filtered = [...filtered].sort(
    (a, b) =>
      a.frequency_level - b.frequency_level ||
      a.word.localeCompare(b.word),
  );

  return {
    items: filtered.slice((page - 1) * pageSize, page * pageSize),
    total: filtered.length,
  };
}

export async function getWord(word: string): Promise<WordRow | null> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase
      .from("words")
      .select("*")
      .eq("word", word)
      .maybeSingle();
    return (data as WordRow | null) ?? null;
  }
  const target = word.toLowerCase();
  return mockRows.find((r) => r.word.toLowerCase() === target) ?? null;
}

/** Levenshtein 编辑距离 */
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const dp = Array.from({ length: a.length + 1 }, (_, i) => i);
  for (let j = 1; j <= b.length; j++) {
    let prev = dp[0];
    dp[0] = j;
    for (let i = 1; i <= a.length; i++) {
      const tmp = dp[i];
      dp[i] =
        a[i - 1] === b[j - 1]
          ? prev
          : 1 + Math.min(prev, dp[i], dp[i - 1]);
      prev = tmp;
    }
  }
  return dp[a.length];
}

/**
 * 给定可能拼错的查询词，返回最相近的若干个真实词形。
 * 排除完全相同的（认为是 0 距离 = 用户已经找到正确词）。
 */
export async function suggestWords(q: string, limit = 5): Promise<string[]> {
  const qq = q.toLowerCase().trim();
  if (!qq) return [];
  const maxDist = Math.max(2, Math.floor(qq.length * 0.4));

  let pool: string[];
  if (isSupabaseConfigured && supabase) {
    // 拉一个候选池（覆盖词形相近的词）；为了高效，
    // 先用 ILIKE 拉前缀/包含命中作为大池，再 Levenshtein 精排
    const prefix = qq.slice(0, 2);
    const { data } = await supabase
      .from("words")
      .select("word")
      .or(`word.ilike.${prefix}%,word.ilike.%${qq[0]}%`)
      .limit(500);
    pool = (data ?? []).map((r: { word: string }) => r.word);
  } else {
    pool = mockRows.map((r) => r.word);
  }

  return pool
    .map((w) => ({ w, d: levenshtein(qq, w.toLowerCase()) }))
    .filter((x) => x.d > 0 && x.d <= maxDist)
    .sort((a, b) => a.d - b.d || a.w.length - b.w.length)
    .slice(0, limit)
    .map((x) => x.w);
}

/** 按词形列表批量查询（用于主题词包、收藏夹等场景） */
export async function listByWords(words: string[]): Promise<WordRow[]> {
  if (words.length === 0) return [];
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase
      .from("words")
      .select("*")
      .in("word", words);
    return (data as WordRow[]) ?? [];
  }
  const set = new Set(words.map((w) => w.toLowerCase()));
  return mockRows.filter((r) => set.has(r.word.toLowerCase()));
}

export async function getRandomWords(limit = 10): Promise<WordRow[]> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase
      .from("words")
      .select("*")
      .limit(limit * 3);
    if (!data) return [];
    return ([...(data as WordRow[])]
      .sort(() => Math.random() - 0.5)
      .slice(0, limit));
  }
  return [...mockRows].sort(() => Math.random() - 0.5).slice(0, limit);
}

export async function getTotalCount(): Promise<number> {
  if (isSupabaseConfigured && supabase) {
    const { count } = await supabase
      .from("words")
      .select("*", { count: "exact", head: true });
    return count ?? 0;
  }
  return mockRows.length;
}
