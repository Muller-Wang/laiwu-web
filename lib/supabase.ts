import { createClient } from "@supabase/supabase-js";

/**
 * 公开 Supabase 客户端（anon key）
 * 用于浏览器端 + 服务端只读查询
 *
 * 注意：环境变量未配置时返回 null，所有调用方需 graceful 降级到 mock 数据，
 * 保证在 Supabase 接入前页面也能跑起来。
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  url && anonKey ? createClient(url, anonKey) : null;

export const isSupabaseConfigured = !!supabase;

export type WordRow = {
  id: number;
  word: string;
  pronunciation_us: string | null;
  pronunciation_uk: string | null;
  frequency_level: number;
  has_slang: boolean;
  has_mnemonic: boolean;
  pos_list: string[];
  data: WordData;
};

export type WordData = {
  word: string;
  pronunciation_us?: string;
  pronunciation_uk?: string;
  frequency_level?: number;
  core_meanings?: Array<{ pos: string; definition: string }>;
  slang_meanings?: Array<{ context: string; definition: string; note?: string }>;
  example?: { text: string; translation: string; source_style?: string };
  mnemonic?: string | null;
  associations?: {
    synonyms?: string[];
    antonyms?: string[];
    collocations?: string[];
    morphology?: Record<string, string>;
  };
};
