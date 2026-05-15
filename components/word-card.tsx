import Link from "next/link";
import { Flame, Lightbulb } from "lucide-react";
import type { WordRow } from "@/lib/supabase";
import { freqLabel, safeGet } from "@/lib/utils";

export function WordCard({ row }: { row: WordRow }) {
  const { text: freqText, color: freqColor } = freqLabel(row.frequency_level);
  const firstMeaning = safeGet<{ pos: string; definition: string } | undefined>(
    row,
    "data.core_meanings.0",
    undefined,
  );

  return (
    <Link
      href={`/word/${encodeURIComponent(row.word)}`}
      className="group block p-5 rounded-2xl bg-white border border-[color:var(--color-border)] hover:border-brand-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-2xl font-bold tracking-tight truncate group-hover:text-brand-600 transition-colors">
            {row.word}
          </h3>
          {row.pronunciation_us && (
            <p className="mt-1 text-xs text-[color:var(--color-text-muted)] font-mono truncate">
              {row.pronunciation_us}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide text-white"
            style={{ background: freqColor }}
          >
            {freqText}
          </span>
          <div className="flex gap-1">
            {row.has_slang && (
              <span
                title="含熟词生义"
                className="w-5 h-5 rounded-md bg-accent-100 text-accent-600 flex items-center justify-center"
              >
                <Flame className="w-3 h-3" />
              </span>
            )}
            {row.has_mnemonic && (
              <span
                title="含助记法"
                className="w-5 h-5 rounded-md bg-brand-100 text-brand-700 flex items-center justify-center"
              >
                <Lightbulb className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>
      </div>

      {firstMeaning && (
        <p className="mt-3 text-sm text-[color:var(--color-text-muted)] leading-relaxed line-clamp-2">
          <span className="font-semibold text-[color:var(--color-text)] mr-1.5">
            {firstMeaning.pos}
          </span>
          {firstMeaning.definition}
        </p>
      )}

      {row.pos_list.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {row.pos_list.slice(0, 4).map((p) => (
            <span
              key={p}
              className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-[color:var(--color-surface-2)] text-[color:var(--color-text-muted)]"
            >
              {p}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
