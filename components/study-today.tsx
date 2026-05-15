"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, RefreshCw, ArrowRight, Play } from "lucide-react";
import type { WordRow } from "@/lib/supabase";
import { safeGet, cn } from "@/lib/utils";

export function StudyToday({
  newWords,
  reviewWords,
}: {
  newWords: WordRow[];
  reviewWords: WordRow[];
}) {
  const [tab, setTab] = useState<"new" | "review">("new");
  const list = tab === "new" ? newWords : reviewWords;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">今日清单</h2>
        <Link
          href="/study/session"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold shadow-md shadow-brand-500/30 hover:shadow-lg transition-all"
        >
          <Play className="w-4 h-4 fill-current" />
          开始今日学习
        </Link>
      </div>

      <div className="flex gap-2 mb-4">
        <TabButton
          active={tab === "new"}
          onClick={() => setTab("new")}
          icon={<Sparkles className="w-4 h-4" />}
          label="新学词"
          count={newWords.length}
          activeColor="brand"
        />
        <TabButton
          active={tab === "review"}
          onClick={() => setTab("review")}
          icon={<RefreshCw className="w-4 h-4" />}
          label="待复习"
          count={reviewWords.length}
          activeColor="accent"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          {list.map((row) => {
            const def = safeGet<{ pos: string; definition: string } | undefined>(
              row,
              "data.core_meanings.0",
              undefined,
            );
            return (
              <Link
                key={row.id}
                href={`/word/${encodeURIComponent(row.word)}`}
                className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-[color:var(--color-border)] hover:border-brand-300 hover:shadow-md transition-all"
              >
                <div
                  className={cn(
                    "shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold",
                    tab === "new"
                      ? "bg-brand-50 text-brand-700"
                      : "bg-accent-50 text-accent-600",
                  )}
                >
                  {row.word.slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold truncate group-hover:text-brand-600 transition-colors">
                    {row.word}
                  </div>
                  {def && (
                    <div className="text-xs text-[color:var(--color-text-muted)] truncate mt-0.5">
                      <span className="font-medium">{def.pos}</span>{" "}
                      {def.definition}
                    </div>
                  )}
                </div>
                <ArrowRight className="w-4 h-4 text-[color:var(--color-text-muted)] group-hover:translate-x-0.5 group-hover:text-brand-600 transition-all shrink-0" />
              </Link>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
  activeColor,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
  activeColor: "brand" | "accent";
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
        active
          ? activeColor === "brand"
            ? "bg-brand-500 text-white shadow-md"
            : "bg-accent-500 text-white shadow-md"
          : "bg-white border border-[color:var(--color-border)] hover:bg-[color:var(--color-surface-2)]",
      )}
    >
      {icon}
      {label}
      <span
        className={cn(
          "px-1.5 py-0.5 rounded-md text-xs font-bold",
          active
            ? "bg-white/20 text-white"
            : "bg-[color:var(--color-surface-2)] text-[color:var(--color-text-muted)]",
        )}
      >
        {count}
      </span>
    </button>
  );
}
