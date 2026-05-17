"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  useState,
  useEffect,
  useCallback,
  useTransition,
  useRef,
} from "react";
import { Search, X, SlidersHorizontal, Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useT } from "./i18n-provider";
import type { DictKey } from "@/lib/i18n/dict";
import {
  loadIndex,
  searchLocal,
  type IndexEntry,
} from "@/lib/word-index";

const FREQ_OPTIONS: Array<{ value: string; labelKey: DictKey }> = [
  { value: "", labelKey: "wordbook.freqAll" },
  { value: "1", labelKey: "wordbook.freq1" },
  { value: "2", labelKey: "wordbook.freq2" },
  { value: "3", labelKey: "wordbook.freq3" },
];

const POS_OPTIONS = ["n.", "v.", "adj.", "adv."];

function useDebounce<T>(value: T, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export function SearchBar({ initialQ = "" }: { initialQ?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [q, setQ] = useState(initialQ);
  const debounced = useDebounce(q, 300);
  const t = useT();

  // 客户端预加载的词形索引
  const [index, setIndex] = useState<IndexEntry[] | null>(null);
  const [suggestions, setSuggestions] = useState<IndexEntry[]>([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 同步到 URL（debounced）
  useEffect(() => {
    const current = new URLSearchParams(searchParams.toString());
    const cur = current.get("q") ?? "";
    if (cur === debounced) return;
    if (debounced) current.set("q", debounced);
    else current.delete("q");
    current.delete("page");
    startTransition(() => {
      router.push(`/wordbook?${current.toString()}`, { scroll: false });
    });
  }, [debounced, router, searchParams]);

  // 首次聚焦时 lazy load 索引
  const ensureIndex = useCallback(async () => {
    if (index || typeof window === "undefined") return;
    try {
      const data = await loadIndex();
      setIndex(data);
    } catch (e) {
      console.warn("[search] failed to load word index", e);
    }
  }, [index]);

  // 输入变化时本地搜索（0ms）
  useEffect(() => {
    if (!index || !q.trim()) {
      setSuggestions([]);
      return;
    }
    setSuggestions(searchLocal(q, index, 8));
  }, [q, index]);

  // 点击外部关闭下拉
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={wrapperRef}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[color:var(--color-text-muted)] pointer-events-none z-10" />
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => {
          ensureIndex();
          setOpen(true);
        }}
        placeholder={t("wordbook.searchPlaceholder")}
        className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white border border-[color:var(--color-border)] focus:border-brand-400 focus:ring-4 focus:ring-brand-100 outline-none text-base font-medium transition-all"
      />
      {q && (
        <button
          onClick={() => {
            setQ("");
            setSuggestions([]);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-[color:var(--color-surface-2)] z-10"
          aria-label={t("wordbook.clearSearch")}
        >
          <X className="w-4 h-4 text-[color:var(--color-text-muted)]" />
        </button>
      )}

      {/* 下拉建议 */}
      {open && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 z-30 rounded-2xl bg-white border border-[color:var(--color-border)] shadow-xl overflow-hidden">
          {suggestions.map((s) => (
            <Link
              key={s.w}
              href={`/word/${encodeURIComponent(s.w)}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors border-b border-[color:var(--color-border)] last:border-b-0"
            >
              <span className="font-bold text-base text-[color:var(--color-text)]">
                {s.w}
              </span>
              {s.d && (
                <span className="text-sm text-[color:var(--color-text-muted)] truncate">
                  {s.d}
                </span>
              )}
              <span
                className={cn(
                  "ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold text-white shrink-0",
                  s.f === 1
                    ? "bg-rose-500"
                    : s.f === 2
                      ? "bg-amber-500"
                      : "bg-gray-400",
                )}
              >
                {s.f === 1 ? "高频" : s.f === 2 ? "中频" : "低频"}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

type FilterValue = {
  freq: string;
  pos: string[];
  slang: boolean;
  mn: boolean;
};

export function FilterPanel({ initial }: { initial: FilterValue }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState<FilterValue>(initial);
  const t = useT();

  const apply = useCallback(
    (next: FilterValue) => {
      const sp = new URLSearchParams(searchParams.toString());
      if (next.freq) sp.set("freq", next.freq);
      else sp.delete("freq");
      if (next.pos.length > 0) sp.set("pos", next.pos.join(","));
      else sp.delete("pos");
      if (next.slang) sp.set("slang", "1");
      else sp.delete("slang");
      if (next.mn) sp.set("mn", "1");
      else sp.delete("mn");
      sp.delete("page");
      startTransition(() => {
        router.push(`/wordbook?${sp.toString()}`, { scroll: false });
      });
    },
    [router, searchParams],
  );

  const update = (patch: Partial<FilterValue>) => {
    const next = { ...val, ...patch };
    setVal(next);
    apply(next);
  };

  const togglePos = (p: string) => {
    const next = val.pos.includes(p)
      ? val.pos.filter((x) => x !== p)
      : [...val.pos, p];
    update({ pos: next });
  };

  const reset = () => {
    const next = { freq: "", pos: [], slang: false, mn: false };
    setVal(next);
    apply(next);
  };

  const activeCount =
    (val.freq ? 1 : 0) +
    val.pos.length +
    (val.slang ? 1 : 0) +
    (val.mn ? 1 : 0);

  return (
    <>
      {/* 桌面端：折叠面板 */}
      <aside className="hidden md:block sticky top-20 self-start w-64 shrink-0">
        <FilterBody
          val={val}
          togglePos={togglePos}
          update={update}
          reset={reset}
          activeCount={activeCount}
        />
      </aside>

      {/* 移动端：粘性按钮 + 折叠 */}
      <div className="md:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white border border-[color:var(--color-border)] font-medium"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            {t("wordbook.filter")}
            {activeCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-brand-500 text-white text-xs">
                {activeCount}
              </span>
            )}
          </span>
          <span className="text-sm text-[color:var(--color-text-muted)]">
            {open ? t("wordbook.filterCollapse") : t("wordbook.filterExpand")}
          </span>
        </button>
        {open && (
          <div className="mt-3">
            <FilterBody
              val={val}
              togglePos={togglePos}
              update={update}
              reset={reset}
              activeCount={activeCount}
            />
          </div>
        )}
      </div>
    </>
  );
}

function FilterBody({
  val,
  togglePos,
  update,
  reset,
  activeCount,
}: {
  val: FilterValue;
  togglePos: (p: string) => void;
  update: (p: Partial<FilterValue>) => void;
  reset: () => void;
  activeCount: number;
}) {
  const t = useT();
  return (
    <div className="p-5 rounded-2xl bg-white border border-[color:var(--color-border)] space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          {t("wordbook.filter")}
        </h3>
        {activeCount > 0 && (
          <button
            onClick={reset}
            className="text-xs text-brand-600 hover:underline font-medium"
          >
            {t("wordbook.filterClear")}
          </button>
        )}
      </div>

      {/* 词频 */}
      <div>
        <div className="text-xs font-semibold text-[color:var(--color-text-muted)] mb-2 uppercase tracking-wide">
          {t("wordbook.freq")}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {FREQ_OPTIONS.map((opt) => {
            const active = val.freq === opt.value;
            return (
              <button
                key={opt.value || "all"}
                onClick={() => update({ freq: opt.value })}
                className={cn(
                  "px-3 py-2 rounded-xl text-sm font-medium transition-all text-left",
                  active
                    ? "bg-brand-500 text-white"
                    : "bg-[color:var(--color-surface-2)] hover:bg-brand-50 text-[color:var(--color-text)]",
                )}
              >
                {t(opt.labelKey)}
              </button>
            );
          })}
        </div>
      </div>

      {/* 词性 */}
      <div>
        <div className="text-xs font-semibold text-[color:var(--color-text-muted)] mb-2 uppercase tracking-wide">
          {t("wordbook.pos")}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {POS_OPTIONS.map((p) => {
            const active = val.pos.includes(p);
            return (
              <button
                key={p}
                onClick={() => togglePos(p)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
                  active
                    ? "bg-brand-500 text-white border-brand-500"
                    : "bg-white border-[color:var(--color-border)] hover:border-brand-300",
                )}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      {/* 开关组 */}
      <div className="space-y-2">
        <Toggle
          label={t("wordbook.filterSlang")}
          checked={val.slang}
          onChange={(v) => update({ slang: v })}
        />
        <Toggle
          label={t("wordbook.filterMn")}
          checked={val.mn}
          onChange={(v) => update({ mn: v })}
        />
      </div>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors",
        checked
          ? "bg-brand-50 text-brand-700"
          : "bg-[color:var(--color-surface-2)] hover:bg-brand-50",
      )}
    >
      <span className="text-sm font-medium">{label}</span>
      <span
        className={cn(
          "w-5 h-5 rounded-md flex items-center justify-center transition-all",
          checked
            ? "bg-brand-500 text-white"
            : "bg-white border border-[color:var(--color-border)]",
        )}
      >
        {checked && <Check className="w-3.5 h-3.5" />}
      </span>
    </button>
  );
}
