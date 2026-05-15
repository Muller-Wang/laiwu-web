"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useTransition } from "react";
import { Search, X, SlidersHorizontal, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const FREQ_OPTIONS = [
  { value: "", label: "全部词频" },
  { value: "1", label: "高频" },
  { value: "2", label: "中频" },
  { value: "3", label: "低频" },
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

  // 同步到 URL
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

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[color:var(--color-text-muted)] pointer-events-none" />
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="搜索单词、释义、例句…"
        className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white border border-[color:var(--color-border)] focus:border-brand-400 focus:ring-4 focus:ring-brand-100 outline-none text-base font-medium transition-all"
      />
      {q && (
        <button
          onClick={() => setQ("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-[color:var(--color-surface-2)]"
          aria-label="清空"
        >
          <X className="w-4 h-4 text-[color:var(--color-text-muted)]" />
        </button>
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
            筛选
            {activeCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-brand-500 text-white text-xs">
                {activeCount}
              </span>
            )}
          </span>
          <span className="text-sm text-[color:var(--color-text-muted)]">
            {open ? "收起" : "展开"}
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
  return (
    <div className="p-5 rounded-2xl bg-white border border-[color:var(--color-border)] space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          筛选
        </h3>
        {activeCount > 0 && (
          <button
            onClick={reset}
            className="text-xs text-brand-600 hover:underline font-medium"
          >
            清空
          </button>
        )}
      </div>

      {/* 词频 */}
      <div>
        <div className="text-xs font-semibold text-[color:var(--color-text-muted)] mb-2 uppercase tracking-wide">
          词频
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
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 词性 */}
      <div>
        <div className="text-xs font-semibold text-[color:var(--color-text-muted)] mb-2 uppercase tracking-wide">
          词性
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
          label="🔥 含熟词生义"
          checked={val.slang}
          onChange={(v) => update({ slang: v })}
        />
        <Toggle
          label="💡 含助记法"
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
