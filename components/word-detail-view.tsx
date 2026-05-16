"use client";

import Link from "next/link";
import { ChevronLeft, Flame, Lightbulb, Quote, Tag } from "lucide-react";
import { freqStyle, safeGet } from "@/lib/utils";
import { WordSpeaker } from "./word-speaker";
import { WordActions } from "./word-actions";
import { useT } from "./i18n-provider";
import type { Mnemonic, WordRow } from "@/lib/supabase";
import type { DictKey } from "@/lib/i18n/dict";

const MNEMONIC_TYPE_KEY: Record<string, DictKey> = {
  root_affix: "mnemonic.root_affix",
  homophone: "mnemonic.homophone",
  image: "mnemonic.image",
  story: "mnemonic.story",
  association: "mnemonic.association",
};

export function WordDetailView({ row }: { row: WordRow }) {
  const t = useT();
  const { textKey: freqKey, color: freqColor } = freqStyle(row.frequency_level);
  const d = row.data;
  const example = d.example;
  const slangs = d.slang_meanings ?? [];
  const coreMeanings = d.core_meanings ?? [];

  const mnemonicRaw = d.mnemonic;
  const mnemonic: Mnemonic | null =
    mnemonicRaw == null
      ? null
      : typeof mnemonicRaw === "string"
        ? { type: "association", content: mnemonicRaw }
        : mnemonicRaw;

  const synonyms = safeGet<string[]>(d, "associations.synonyms", []);
  const antonyms = safeGet<string[]>(d, "associations.antonyms", []);
  const collocations = safeGet<string[]>(d, "associations.collocations", []);
  const morphology = safeGet<Record<string, string>>(
    d,
    "associations.morphology",
    {},
  );
  const morphList = Object.entries(morphology).filter(([, v]) => v);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12 relative">
      {/* 返回 */}
      <Link
        href="/wordbook"
        className="inline-flex items-center gap-1.5 text-sm text-[color:var(--color-text-muted)] hover:text-brand-600 transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        {t("word.back")}
      </Link>

      {/* 词头区 */}
      <header className="pb-8 border-b border-[color:var(--color-border)]">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white"
            style={{ background: freqColor }}
          >
            {t(freqKey)}
          </span>
          {row.pos_list.map((p) => (
            <span
              key={p}
              className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[color:var(--color-surface-2)] text-[color:var(--color-text)]"
            >
              {p}
            </span>
          ))}
          {row.has_slang && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent-100 text-accent-600">
              <Flame className="w-3 h-3" /> {t("word.section.slang")}
            </span>
          )}
          {row.has_mnemonic && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-700">
              <Lightbulb className="w-3 h-3" /> {t("word.section.mnemonic")}
            </span>
          )}
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none">
          {row.word}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {row.pronunciation_us && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[color:var(--color-text-muted)] font-semibold">
                {t("word.us")}
              </span>
              <span className="font-mono text-base text-[color:var(--color-text)]">
                {row.pronunciation_us}
              </span>
              <WordSpeaker text={row.word} lang="en-US" label={t("word.speak")} />
            </div>
          )}
          {row.pronunciation_uk && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[color:var(--color-text-muted)] font-semibold">
                {t("word.uk")}
              </span>
              <span className="font-mono text-base text-[color:var(--color-text)]">
                {row.pronunciation_uk}
              </span>
              <WordSpeaker text={row.word} lang="en-GB" label={t("word.speak")} />
            </div>
          )}
        </div>
      </header>

      {/* 核心释义 */}
      {coreMeanings.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xs font-bold text-[color:var(--color-text-muted)] uppercase tracking-wider mb-4">
            {t("word.section.core")}
          </h2>
          <div className="space-y-3">
            {coreMeanings.map((m, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-[color:var(--color-border)]"
              >
                <span className="shrink-0 px-2.5 py-1 rounded-lg bg-[color:var(--color-surface-2)] text-xs font-bold text-[color:var(--color-text)]">
                  {m.pos}
                </span>
                <p className="text-base md:text-lg leading-relaxed">
                  {m.definition}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 熟词生义 */}
      {slangs.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xs font-bold text-accent-600 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" />
            {t("word.section.slang")}
          </h2>
          <div className="space-y-4">
            {slangs.map((s, i) => (
              <div
                key={i}
                className="relative p-6 rounded-2xl bg-gradient-to-br from-accent-50 to-amber-50 border-l-4 border-accent-400 shadow-sm"
              >
                <div className="text-xs font-semibold text-accent-600 mb-2">
                  {s.context}
                </div>
                <p className="text-lg font-semibold leading-relaxed text-[color:var(--color-text)]">
                  {s.definition}
                </p>
                {s.note && (
                  <p className="mt-3 text-sm text-[color:var(--color-text-muted)] italic leading-relaxed">
                    {s.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 例句 */}
      {example?.text && (
        <section className="mt-10">
          <h2 className="text-xs font-bold text-[color:var(--color-text-muted)] uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Quote className="w-3.5 h-3.5" />
            {t("word.section.example")}
          </h2>
          <div className="p-6 md:p-7 rounded-2xl bg-white border border-[color:var(--color-border)]">
            <p
              className="text-lg md:text-xl leading-relaxed text-[color:var(--color-text)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              &ldquo;{example.text}&rdquo;
            </p>
            {example.translation && (
              <p className="mt-4 text-[color:var(--color-text-muted)] leading-relaxed">
                {example.translation}
              </p>
            )}
            {example.source_style && (
              <p className="mt-5 pt-4 border-t border-[color:var(--color-border)] text-xs text-[color:var(--color-text-muted)] font-medium">
                —— {example.source_style}
              </p>
            )}
          </div>
        </section>
      )}

      {/* 助记法 */}
      {mnemonic && (
        <section className="mt-10">
          <h2 className="text-xs font-bold text-brand-700 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5" />
            {t("word.section.mnemonic")}
          </h2>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-50 to-emerald-50 border-l-4 border-brand-400">
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-brand-200 text-brand-800 text-xs font-bold mb-3">
              {t(MNEMONIC_TYPE_KEY[mnemonic.type] ?? "mnemonic.default")}
            </div>
            <p className="text-base md:text-lg leading-relaxed text-[color:var(--color-text)]">
              {mnemonic.content}
            </p>
          </div>
        </section>
      )}

      {/* 联想区 */}
      {(synonyms.length > 0 ||
        antonyms.length > 0 ||
        collocations.length > 0 ||
        morphList.length > 0) && (
        <section className="mt-10">
          <h2 className="text-xs font-bold text-[color:var(--color-text-muted)] uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            {t("word.section.assoc")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {synonyms.length > 0 && (
              <AssocCard title={t("word.assoc.synonyms")}>
                <TagCloud
                  items={synonyms}
                  colorClass="bg-emerald-50 text-emerald-700 border-emerald-200"
                />
              </AssocCard>
            )}
            {antonyms.length > 0 && (
              <AssocCard title={t("word.assoc.antonyms")}>
                <TagCloud
                  items={antonyms}
                  colorClass="bg-rose-50 text-rose-700 border-rose-200"
                />
              </AssocCard>
            )}
            {collocations.length > 0 && (
              <AssocCard title={t("word.assoc.collocations")}>
                <TagCloud
                  items={collocations}
                  colorClass="bg-blue-50 text-blue-700 border-blue-200"
                />
              </AssocCard>
            )}
            {morphList.length > 0 && (
              <AssocCard title={t("word.assoc.morphology")}>
                <div className="space-y-2">
                  {morphList.map(([pos, form]) => (
                    <div key={pos} className="flex items-center gap-3 text-sm">
                      <span className="shrink-0 px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 text-xs font-bold">
                        {pos}
                      </span>
                      <span className="text-[color:var(--color-text)]">
                        {form}
                      </span>
                    </div>
                  ))}
                </div>
              </AssocCard>
            )}
          </div>
        </section>
      )}

      <div className="h-32" />

      <WordActions word={row.word} />
    </div>
  );
}

function AssocCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-5 rounded-2xl bg-white border border-[color:var(--color-border)]">
      <div className="text-xs font-bold text-[color:var(--color-text-muted)] uppercase tracking-wide mb-3">
        {title}
      </div>
      {children}
    </div>
  );
}

function TagCloud({
  items,
  colorClass,
}: {
  items: string[];
  colorClass: string;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((it, i) => (
        <span
          key={`${it}-${i}`}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${colorClass}`}
        >
          {it}
        </span>
      ))}
    </div>
  );
}
