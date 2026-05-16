"use client";

import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Search as SearchIcon,
} from "lucide-react";
import { useT } from "./i18n-provider";
import { WordCard } from "./word-card";
import { SearchBar, FilterPanel } from "./wordbook-controls";
import type { WordRow } from "@/lib/supabase";

export type WordbookSearchParams = {
  q?: string;
  freq?: string;
  pos?: string;
  slang?: string;
  mn?: string;
  page?: string;
};

export function WordbookView({
  items,
  total,
  totalPages,
  page,
  sp,
  hasActiveFilters,
  pos,
  hasSlang,
  hasMnemonic,
  suggestions = [],
}: {
  items: WordRow[];
  total: number;
  totalPages: number;
  page: number;
  sp: WordbookSearchParams;
  hasActiveFilters: boolean;
  pos: string[];
  hasSlang: boolean;
  hasMnemonic: boolean;
  suggestions?: string[];
}) {
  const t = useT();

  const buildHref = (overrides: Partial<WordbookSearchParams>) => {
    const params = new URLSearchParams();
    const merged = { ...sp, ...overrides };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) params.set(k, String(v));
    });
    const qs = params.toString();
    return qs ? `/wordbook?${qs}` : "/wordbook";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
      {/* 页面标题 */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-brand-600 font-medium mb-2">
            <BookOpen className="w-4 h-4" />
            {t("wordbook.crumb")}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {t("wordbook.title")}
          </h1>
          <p className="mt-2 text-[color:var(--color-text-muted)]">
            {hasActiveFilters
              ? t("wordbook.summaryFiltered", { total: total.toLocaleString() })
              : t("wordbook.summaryAll", { total: total.toLocaleString() })}
          </p>
        </div>
      </header>

      {/* 搜索条 */}
      <div className="mb-6">
        <SearchBar initialQ={sp.q ?? ""} />
      </div>

      {/* 主布局：左筛选 + 右网格 */}
      <div className="flex flex-col md:flex-row gap-6">
        <FilterPanel
          initial={{
            freq: sp.freq ?? "",
            pos,
            slang: hasSlang,
            mn: hasMnemonic,
          }}
        />

        <div className="flex-1 min-w-0">
          {items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((row) => (
                  <WordCard key={row.id} row={row} />
                ))}
              </div>

              {/* 分页 */}
              {totalPages > 1 && (
                <nav className="mt-10 flex items-center justify-center gap-2">
                  {page > 1 ? (
                    <Link
                      href={buildHref({ page: String(page - 1) })}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-[color:var(--color-border)] hover:border-brand-300 transition-colors text-sm font-medium"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      {t("wordbook.prev")}
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-transparent text-sm font-medium text-[color:var(--color-text-muted)] cursor-not-allowed">
                      <ChevronLeft className="w-4 h-4" />
                      {t("wordbook.prev")}
                    </span>
                  )}
                  <div className="px-4 py-2 text-sm font-medium text-[color:var(--color-text-muted)]">
                    {t("wordbook.page", { page, total: totalPages })}
                  </div>
                  {page < totalPages ? (
                    <Link
                      href={buildHref({ page: String(page + 1) })}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-[color:var(--color-border)] hover:border-brand-300 transition-colors text-sm font-medium"
                    >
                      {t("wordbook.next")}
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-transparent text-sm font-medium text-[color:var(--color-text-muted)] cursor-not-allowed">
                      {t("wordbook.next")}
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  )}
                </nav>
              )}
            </>
          ) : (
            <div className="py-20 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-50 text-brand-500 mb-4">
                <SearchIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {t("wordbook.empty.title")}
              </h3>
              <p className="text-[color:var(--color-text-muted)]">
                {t("wordbook.empty.desc")}
              </p>

              {/* 拼写纠错建议 */}
              {suggestions.length > 0 && (
                <div className="mt-6 max-w-md mx-auto">
                  <div className="text-sm text-[color:var(--color-text-muted)] mb-3">
                    {t("search.suggestion")}
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {suggestions.map((s) => (
                      <Link
                        key={s}
                        href={`/wordbook?q=${encodeURIComponent(s)}`}
                        className="px-4 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-sm font-semibold border border-brand-200 transition-colors"
                      >
                        {s}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {hasActiveFilters && (
                <Link
                  href="/wordbook"
                  className="mt-6 inline-block px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-colors"
                >
                  {t("wordbook.empty.clear")}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
