"use client";

import { useEffect, useState } from "react";
import type { WordRow } from "@/lib/supabase";
import {
  buildQuestions,
  buildWrongQuestions,
  type Question,
  type QuizType,
} from "@/lib/quiz";
import { getAllProgress, listWrongWords } from "@/lib/db";
import { QuizSession } from "./quiz-session";
import { useT } from "./i18n-provider";
import Link from "next/link";

/**
 * 测验运行入口：
 * 客户端按 type 读 progress / wrong_words → 与 candidates 求交集 → 出题 → 交给 QuizSession
 */
export function QuizRunner({
  type,
  count,
  candidates,
}: {
  type: QuizType;
  count: number;
  candidates: WordRow[];
}) {
  const t = useT();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const candMap = new Map(candidates.map((c) => [c.word, c]));

      let pool: WordRow[];
      if (type === "wrong") {
        const wrongs = await listWrongWords();
        const wrongPool = wrongs
          .map((w) => candMap.get(w.word))
          .filter((x): x is WordRow => !!x);
        const qs = buildWrongQuestions(wrongPool, candidates, count);
        setQuestions(qs);
        setLoading(false);
        return;
      }

      const progress = await getAllProgress();
      const studiedWords = progress
        .map((p) => candMap.get(p.word))
        .filter((x): x is WordRow => !!x);
      pool = studiedWords.length > 0 ? studiedWords : [];

      if (pool.length === 0) {
        setQuestions([]);
      } else {
        // 选择题需要 4 选 1，干扰项来自 candidates 总池
        const qs = buildQuestions(type, pool, count);
        // 修正：选择题的干扰项扩展到全候选池
        if (type === "mc_zh2en" || type === "mc_en2zh") {
          const finalQs = buildQuestions(type, pool, count).map((q) => {
            const fresh = buildQuestions(type, [q.word, ...candidates], 1)[0];
            return fresh;
          });
          setQuestions(finalQs);
        } else {
          setQuestions(qs);
        }
      }
      setLoading(false);
    })();
  }, [type, count, candidates]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="h-64 rounded-3xl bg-[color:var(--color-surface-2)] animate-pulse" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-[color:var(--color-text-muted)]">
          {t("quiz.empty")}
        </p>
        <Link
          href="/study"
          className="inline-block px-5 py-2 rounded-xl bg-brand-500 text-white text-sm font-semibold"
        >
          {t("study.crumb")}
        </Link>
      </div>
    );
  }

  return <QuizSession type={type} questions={questions} />;
}
