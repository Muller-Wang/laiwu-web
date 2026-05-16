import { listWords, suggestWords } from "@/lib/words";
import {
  WordbookView,
  type WordbookSearchParams,
} from "@/components/wordbook-view";

export default async function WordbookPage({
  searchParams,
}: {
  searchParams: Promise<WordbookSearchParams>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const freq = sp.freq ? Number(sp.freq) : undefined;
  const pos = sp.pos ? sp.pos.split(",").filter(Boolean) : [];
  const hasSlang = sp.slang === "1";
  const hasMnemonic = sp.mn === "1";
  const page = Math.max(1, Number(sp.page) || 1);
  const pageSize = 30;

  const { items, total } = await listWords({
    q: q || undefined,
    freq,
    pos: pos.length ? pos : undefined,
    hasSlang: hasSlang || undefined,
    hasMnemonic: hasMnemonic || undefined,
    page,
    pageSize,
  });

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const hasActiveFilters =
    !!q || !!freq || pos.length > 0 || hasSlang || hasMnemonic;

  // 空结果且用户输了查询词 → 拉拼写纠错建议
  let suggestions: string[] = [];
  if (items.length === 0 && q) {
    suggestions = await suggestWords(q, 5);
  }

  return (
    <WordbookView
      items={items}
      total={total}
      totalPages={totalPages}
      page={page}
      sp={sp}
      hasActiveFilters={hasActiveFilters}
      pos={pos}
      hasSlang={hasSlang}
      hasMnemonic={hasMnemonic}
      suggestions={suggestions}
    />
  );
}
