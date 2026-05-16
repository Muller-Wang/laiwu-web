"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CheckSquare,
  ListChecks,
  PenLine,
  Ear,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { useT } from "./i18n-provider";
import { listWrongWords, getAllProgress } from "@/lib/db";
import type { QuizType } from "@/lib/quiz";
import type { DictKey } from "@/lib/i18n/dict";

type Entry = {
  type: QuizType;
  icon: typeof CheckSquare;
  labelKey: DictKey;
  color: string;
};

const ENTRIES: Entry[] = [
  {
    type: "mc_zh2en",
    icon: CheckSquare,
    labelKey: "quiz.start.mc_zh2en",
    color: "from-blue-400 to-blue-600",
  },
  {
    type: "mc_en2zh",
    icon: ListChecks,
    labelKey: "quiz.start.mc_en2zh",
    color: "from-emerald-400 to-emerald-600",
  },
  {
    type: "spelling",
    icon: PenLine,
    labelKey: "quiz.start.spelling",
    color: "from-amber-400 to-orange-500",
  },
  {
    type: "dictation",
    icon: Ear,
    labelKey: "quiz.start.dictation",
    color: "from-violet-400 to-violet-600",
  },
  {
    type: "wrong",
    icon: AlertTriangle,
    labelKey: "quiz.start.wrong",
    color: "from-rose-400 to-rose-600",
  },
];

export function QuizCenter() {
  const t = useT();
  const [studiedCount, setStudiedCount] = useState<number | null>(null);
  const [wrongCount, setWrongCount] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const [all, wrongs] = await Promise.all([
        getAllProgress(),
        listWrongWords(),
      ]);
      setStudiedCount(all.length);
      setWrongCount(wrongs.length);
    })();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8">
      <header>
        <div className="text-sm text-brand-600 font-medium mb-2">
          {t("quiz.crumb")}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {t("quiz.title")}
        </h1>
        <p className="mt-2 text-[color:var(--color-text-muted)]">
          {t("quiz.intro")}
        </p>
      </header>

      {studiedCount !== null && studiedCount === 0 ? (
        <div className="rounded-3xl bg-white border border-[color:var(--color-border)] p-10 text-center text-[color:var(--color-text-muted)]">
          {t("quiz.empty")}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ENTRIES.map((e) => {
            const disabled = e.type === "wrong" && wrongCount === 0;
            const count =
              e.type === "wrong" ? wrongCount : studiedCount;
            return (
              <Link
                key={e.type}
                href={
                  disabled
                    ? "#"
                    : `/quiz/session?type=${e.type}&count=10`
                }
                aria-disabled={disabled}
                className={`group flex items-center gap-4 p-5 rounded-3xl bg-white border border-[color:var(--color-border)] hover:border-brand-300 hover:shadow-md transition-all ${
                  disabled ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${e.color} flex items-center justify-center shadow-md`}
                >
                  <e.icon className="w-7 h-7 text-white" strokeWidth={2.2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-base">{t(e.labelKey)}</div>
                  <div className="text-xs text-[color:var(--color-text-muted)] mt-0.5">
                    {count != null ? `${count} 词可用` : "..."}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[color:var(--color-text-muted)] group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
