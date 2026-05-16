"use client";

import Link from "next/link";
import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Volume2,
  Trophy,
  Home,
  Repeat,
} from "lucide-react";
import { useT } from "./i18n-provider";
import type { Question } from "@/lib/quiz";
import { judge } from "@/lib/quiz";
import { markWrong, clearWrong } from "@/lib/db";
import { cn } from "@/lib/utils";

export function QuizSession({
  type,
  questions,
}: {
  type: string;
  questions: Question[];
}) {
  const t = useT();
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  const total = questions.length;
  const q = questions[idx];

  const submit = async () => {
    if (!q || submitted) return;
    const userAns = q.type.startsWith("mc_") ? (selected ?? "") : input;
    if (!userAns) return;
    const correct = judge(q, userAns);
    setSubmitted(true);
    if (correct) {
      setCorrectCount((c) => c + 1);
      // 答对了：从 wrong_words 移除
      await clearWrong(q.word.word).catch(() => {});
    } else {
      await markWrong(q.word.word, q.type).catch(() => {});
    }
  };

  const next = () => {
    if (idx + 1 >= total) {
      setDone(true);
    } else {
      setIdx(idx + 1);
      setSelected(null);
      setInput("");
      setSubmitted(false);
    }
  };

  const restart = () => {
    setIdx(0);
    setSelected(null);
    setInput("");
    setSubmitted(false);
    setCorrectCount(0);
    setDone(false);
  };

  if (done) {
    return <DoneScreen total={total} correct={correctCount} onRestart={restart} />;
  }

  if (!q) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-[color:var(--color-text-muted)]">{t("quiz.empty")}</p>
        <Link
          href="/quiz"
          className="mt-4 inline-block px-5 py-2 rounded-xl bg-brand-500 text-white text-sm font-semibold"
        >
          {t("quiz.done.back")}
        </Link>
      </div>
    );
  }

  const isMc = q.type === "mc_zh2en" || q.type === "mc_en2zh";
  const promptKey =
    q.type === "mc_zh2en"
      ? "quiz.q.prompt.zh2en"
      : q.type === "mc_en2zh"
        ? "quiz.q.prompt.en2zh"
        : q.type === "spelling"
          ? "quiz.q.prompt.spelling"
          : "quiz.q.prompt.dictation";

  const progress = ((idx + (submitted ? 1 : 0)) / total) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
      {/* 顶部 */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/quiz"
          className="inline-flex items-center gap-1.5 text-sm text-[color:var(--color-text-muted)] hover:text-brand-600"
        >
          <ChevronLeft className="w-4 h-4" />
          {t("quiz.done.back")}
        </Link>
        <div className="text-sm font-semibold text-[color:var(--color-text-muted)]">
          {t("quiz.q.progress", { cur: idx + 1, total })}
        </div>
      </div>

      <div className="h-2 rounded-full bg-[color:var(--color-surface-2)] overflow-hidden mb-8">
        <motion.div
          className="h-full bg-brand-500 rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* 题面 */}
      <motion.div
        key={idx}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-3xl bg-white border border-[color:var(--color-border)] shadow-sm p-6 md:p-10"
      >
        <div className="text-xs font-bold text-[color:var(--color-text-muted)] uppercase tracking-wider mb-3">
          {t(promptKey)}
        </div>

        {/* 题干内容 */}
        {q.type === "mc_en2zh" ? (
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-2">
            {q.prompt}
          </h2>
        ) : q.type === "mc_zh2en" || q.type === "spelling" ? (
          <p className="text-xl md:text-2xl font-semibold mb-2">{q.prompt}</p>
        ) : (
          // dictation 听写
          <DictationPrompt word={q.word.word} />
        )}

        {q.type === "spelling" && q.hint && (
          <div className="mt-4 font-mono text-lg tracking-widest text-[color:var(--color-text-muted)]">
            {q.hint}
          </div>
        )}

        {/* 选项 / 输入 */}
        <div className="mt-8">
          {isMc && q.options ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {q.options.map((opt) => {
                const isSelected = selected === opt;
                const isAnswer = submitted && opt === q.answer;
                const isWrongPick =
                  submitted && isSelected && opt !== q.answer;
                return (
                  <button
                    key={opt}
                    disabled={submitted}
                    onClick={() => setSelected(opt)}
                    className={cn(
                      "px-4 py-4 rounded-2xl border-2 text-left font-semibold transition-all",
                      !submitted && isSelected
                        ? "border-brand-500 bg-brand-50"
                        : !submitted
                          ? "border-[color:var(--color-border)] hover:border-brand-300 bg-white"
                          : isAnswer
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : isWrongPick
                              ? "border-rose-500 bg-rose-50 text-rose-700"
                              : "border-[color:var(--color-border)] bg-white opacity-60",
                    )}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          ) : (
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={submitted}
              placeholder=""
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && !submitted && submit()}
              className="w-full px-5 py-4 rounded-2xl border-2 border-[color:var(--color-border)] focus:border-brand-400 outline-none text-lg font-mono"
            />
          )}
        </div>

        {/* 反馈区 */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "mt-5 p-4 rounded-2xl text-sm font-medium",
                judge(q, isMc ? (selected ?? "") : input)
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700",
              )}
            >
              {judge(q, isMc ? (selected ?? "") : input) ? (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {t("quiz.q.correct")}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  {t("quiz.q.wrong")}：<strong>{q.answer}</strong>
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 操作按钮 */}
        <div className="mt-6 flex justify-end">
          {!submitted ? (
            <button
              onClick={submit}
              disabled={isMc ? !selected : !input}
              className="px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white font-bold transition-all"
            >
              {t("quiz.q.submit")}
            </button>
          ) : (
            <button
              onClick={next}
              className="inline-flex items-center gap-1.5 px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold transition-all"
            >
              {t("quiz.q.next")}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function DictationPrompt({ word }: { word: string }) {
  const t = useT();
  const speak = () => {
    if (typeof window === "undefined") return;
    const u = new SpeechSynthesisUtterance(word);
    u.lang = "en-US";
    u.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };
  return (
    <button
      onClick={speak}
      className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold"
    >
      <Volume2 className="w-5 h-5" />
      {t("quiz.q.play")}
    </button>
  );
}

function DoneScreen({
  total,
  correct,
  onRestart,
}: {
  total: number;
  correct: number;
  onRestart: () => void;
}) {
  const t = useT();
  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-16 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 16 }}
        className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-400 to-brand-600 text-white mb-6 shadow-xl shadow-brand-500/30"
      >
        <Trophy className="w-12 h-12" />
      </motion.div>
      <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
        {t("quiz.done.title")}
      </h2>
      <p className="mt-3 text-lg text-[color:var(--color-text-muted)]">
        {t("quiz.done.score", { correct, total })}
      </p>
      <div className="mt-10 flex flex-col sm:flex-row justify-center gap-3">
        <Link
          href="/quiz"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-semibold shadow-lg shadow-brand-500/30 transition-all"
        >
          <Home className="w-4 h-4" />
          {t("quiz.done.back")}
        </Link>
        <button
          onClick={onRestart}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white border border-[color:var(--color-border)] hover:border-brand-300 font-semibold transition-all"
        >
          <Repeat className="w-4 h-4" />
          {t("quiz.done.again")}
        </button>
      </div>
    </div>
  );
}
