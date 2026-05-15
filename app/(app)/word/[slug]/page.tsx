import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Flame, Lightbulb, Quote, Tag } from "lucide-react";
import { getWord } from "@/lib/words";
import { freqLabel, safeGet } from "@/lib/utils";
import { WordSpeaker } from "@/components/word-speaker";
import { WordActions } from "@/components/word-actions";
import type { Mnemonic } from "@/lib/supabase";

const MNEMONIC_TYPE_LABEL: Record<string, string> = {
  root_affix: "词根词缀",
  homophone: "谐音联想",
  image: "象形记忆",
  story: "故事联想",
  association: "联想记忆",
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const word = decodeURIComponent(slug);
  return {
    title: `${word} · 来悟单词书`,
    description: `${word} 的发音、释义、熟词生义、例句、助记法`,
  };
}

export default async function WordDetailPage({ params }: Props) {
  const { slug } = await params;
  const word = decodeURIComponent(slug);
  const row = await getWord(word);

  if (!row) notFound();

  const { text: freqText, color: freqColor } = freqLabel(row.frequency_level);
  const d = row.data;
  const example = d.example;
  const slangs = d.slang_meanings ?? [];
  const coreMeanings = d.core_meanings ?? [];

  // 归一化 mnemonic
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
        返回词库
      </Link>

      {/* ============ 词头区 ============ */}
      <header className="pb-8 border-b border-[color:var(--color-border)]">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white"
            style={{ background: freqColor }}
          >
            {freqText}
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
              <Flame className="w-3 h-3" /> 熟词生义
            </span>
          )}
          {row.has_mnemonic && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-700">
              <Lightbulb className="w-3 h-3" /> 含助记
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
                美
              </span>
              <span className="font-mono text-base text-[color:var(--color-text)]">
                {row.pronunciation_us}
              </span>
              <WordSpeaker text={row.word} lang="en-US" label="发音" />
            </div>
          )}
          {row.pronunciation_uk && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[color:var(--color-text-muted)] font-semibold">
                英
              </span>
              <span className="font-mono text-base text-[color:var(--color-text)]">
                {row.pronunciation_uk}
              </span>
              <WordSpeaker text={row.word} lang="en-GB" label="发音" />
            </div>
          )}
        </div>
      </header>

      {/* ============ 核心释义 ============ */}
      {coreMeanings.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xs font-bold text-[color:var(--color-text-muted)] uppercase tracking-wider mb-4">
            核心释义
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

      {/* ============ 🔥 熟词生义 ============ */}
      {slangs.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xs font-bold text-accent-600 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" />
            熟词生义
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

      {/* ============ 例句 ============ */}
      {example?.text && (
        <section className="mt-10">
          <h2 className="text-xs font-bold text-[color:var(--color-text-muted)] uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Quote className="w-3.5 h-3.5" />
            鲜活例句
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

      {/* ============ 💡 助记法 ============ */}
      {mnemonic && (
        <section className="mt-10">
          <h2 className="text-xs font-bold text-brand-700 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5" />
            记忆窍门
          </h2>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-50 to-emerald-50 border-l-4 border-brand-400">
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-brand-200 text-brand-800 text-xs font-bold mb-3">
              {MNEMONIC_TYPE_LABEL[mnemonic.type] ?? "助记"}
            </div>
            <p className="text-base md:text-lg leading-relaxed text-[color:var(--color-text)]">
              {mnemonic.content}
            </p>
          </div>
        </section>
      )}

      {/* ============ 联想区 ============ */}
      {(synonyms.length > 0 ||
        antonyms.length > 0 ||
        collocations.length > 0 ||
        morphList.length > 0) && (
        <section className="mt-10">
          <h2 className="text-xs font-bold text-[color:var(--color-text-muted)] uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            词汇联想
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {synonyms.length > 0 && (
              <AssocCard title="近义词" tagColor="bg-emerald-50 text-emerald-700">
                <TagCloud items={synonyms} colorClass="bg-emerald-50 text-emerald-700 border-emerald-200" />
              </AssocCard>
            )}
            {antonyms.length > 0 && (
              <AssocCard title="反义词" tagColor="bg-rose-50 text-rose-700">
                <TagCloud items={antonyms} colorClass="bg-rose-50 text-rose-700 border-rose-200" />
              </AssocCard>
            )}
            {collocations.length > 0 && (
              <AssocCard title="常用搭配" tagColor="bg-blue-50 text-blue-700">
                <TagCloud items={collocations} colorClass="bg-blue-50 text-blue-700 border-blue-200" />
              </AssocCard>
            )}
            {morphList.length > 0 && (
              <AssocCard title="词形变化" tagColor="bg-violet-50 text-violet-700">
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

      <WordActions />
    </div>
  );
}

function AssocCard({
  title,
  children,
}: {
  title: string;
  tagColor?: string;
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

function TagCloud({ items, colorClass }: { items: string[]; colorClass: string }) {
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
