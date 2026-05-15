import Link from "next/link";
import { ChevronLeft, ChevronRight, BookOpen, Search as SearchIcon } from "lucide-react";
import { listWords } from "@/lib/words";
import { WordCard } from "@/components/word-card";
import { SearchBar, FilterPanel } from "@/components/wordbook-controls";

type SearchParams = {
  q?: string;
  freq?: string;
  pos?: string;
  slang?: string;
  mn?: string;
  page?: string;
};

export default async function WordbookPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
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

  const buildHref = (overrides: Partial<SearchParams>) => {
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
            词库
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            7000 雅思核心词
          </h1>
          <p className="mt-2 text-[color:var(--color-text-muted)]">
            {hasActiveFilters
              ? `共筛选出 ${total.toLocaleString()} 个词条`
              : `共收录 ${total.toLocaleString()} 个词条 · 每个词都配有 AI 鲜活例句`}
          </p>
        </div>
      </header>

      {/* 搜索条 */}
      <div className="mb-6">
        <SearchBar initialQ={q} />
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
                      上一页
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-transparent text-sm font-medium text-[color:var(--color-text-muted)] cursor-not-allowed">
                      <ChevronLeft className="w-4 h-4" />
                      上一页
                    </span>
                  )}
                  <div className="px-4 py-2 text-sm font-medium text-[color:var(--color-text-muted)]">
                    第 <span className="text-brand-700 font-bold">{page}</span>{" "}
                    页 / 共 {totalPages} 页
                  </div>
                  {page < totalPages ? (
                    <Link
                      href={buildHref({ page: String(page + 1) })}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-[color:var(--color-border)] hover:border-brand-300 transition-colors text-sm font-medium"
                    >
                      下一页
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-transparent text-sm font-medium text-[color:var(--color-text-muted)] cursor-not-allowed">
                      下一页
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
              <h3 className="text-xl font-bold mb-2">没找到相关词条</h3>
              <p className="text-[color:var(--color-text-muted)]">
                试试换个关键词，或清除筛选条件再试
              </p>
              {hasActiveFilters && (
                <Link
                  href="/wordbook"
                  className="mt-4 inline-block px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-colors"
                >
                  清除所有筛选
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
