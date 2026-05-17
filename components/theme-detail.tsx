"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { WordCard } from "./word-card";
import { useI18n } from "./i18n-provider";
import type { Theme } from "@/lib/themes";
import type { WordRow } from "@/lib/supabase";

export function ThemeDetail({
  theme,
  words,
}: {
  theme: Theme;
  words: WordRow[];
}) {
  const { lang } = useI18n();
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
      <Link
        href="/themes"
        className="inline-flex items-center gap-1.5 text-sm text-[color:var(--color-text-muted)] hover:text-brand-600 transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        {lang === "zh" ? "所有主题" : "All themes"}
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-4 mb-3">
          <div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${theme.color} flex items-center justify-center text-3xl shadow-md`}
          >
            {theme.emoji}
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {lang === "zh" ? theme.nameZh : theme.nameEn}
            </h1>
            <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
              {words.length}{" "}
              {lang === "zh" ? "个核心词" : "core words"}
            </p>
          </div>
        </div>
        <p className="text-[color:var(--color-text-muted)] max-w-3xl">
          {lang === "zh" ? theme.descZh : theme.descEn}
        </p>
      </header>

      {words.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {words.map((row) => (
            <WordCard key={row.id} row={row} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-[color:var(--color-text-muted)]">
          {lang === "zh"
            ? "该主题暂无可用词条"
            : "No words available for this theme yet"}
        </div>
      )}
    </div>
  );
}
