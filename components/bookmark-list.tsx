"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import { listBookmarks } from "@/lib/db";
import { WordCard } from "./word-card";
import { useT } from "./i18n-provider";
import type { WordRow } from "@/lib/supabase";

/**
 * 收藏夹页：mount 时读 IndexedDB 的 bookmarks，
 * 然后与服务端传来的候选词池 (200 条最常见的) 求交集 → 渲染 WordCard。
 *
 * 若收藏词不在 200 候选中，前端会调 supabase 客户端再查一次（保证完整）。
 */
export function BookmarkList({ candidates }: { candidates: WordRow[] }) {
  const t = useT();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<WordRow[]>([]);

  useEffect(() => {
    (async () => {
      const marks = await listBookmarks();
      if (marks.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }
      const candMap = new Map(candidates.map((c) => [c.word, c]));
      const hits: WordRow[] = [];
      const missing: string[] = [];
      for (const m of marks) {
        const w = candMap.get(m.word);
        if (w) hits.push(w);
        else missing.push(m.word);
      }
      // 候选池没覆盖的，逐个查 Supabase（一般不会很多）
      if (missing.length > 0) {
        try {
          const { supabase } = await import("@/lib/supabase");
          if (supabase) {
            const { data } = await supabase
              .from("words")
              .select("*")
              .in("word", missing);
            if (data) hits.push(...(data as WordRow[]));
          }
        } catch {
          /* ignore */
        }
      }
      setItems(hits);
      setLoading(false);
    })();
  }, [candidates]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-brand-600 font-medium mb-2">
          <Bookmark className="w-4 h-4" />
          {t("bookmark.page.title")}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {t("bookmark.page.title")}
        </h1>
        {!loading && (
          <p className="mt-2 text-[color:var(--color-text-muted)]">
            {items.length} {t("study.kpi.unitWord")}
          </p>
        )}
      </header>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-[color:var(--color-surface-2)] animate-pulse"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center">
          <Bookmark className="w-12 h-12 mx-auto text-[color:var(--color-text-muted)] mb-4" />
          <p className="text-[color:var(--color-text-muted)]">
            {t("bookmark.page.empty")}
          </p>
          <Link
            href="/wordbook"
            className="mt-4 inline-block px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold"
          >
            {t("nav.enterWordbook")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((row) => (
            <WordCard key={row.id} row={row} />
          ))}
        </div>
      )}
    </div>
  );
}
