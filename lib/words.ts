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
    if (q) query = query.ilike("word", `%${q}%`);
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
      filtered = filtered.filter((r) => r.word.toLowerCase().includes(qq));
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
