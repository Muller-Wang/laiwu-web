"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Frown,
  Meh,
  Smile,
  Sparkles,
  RotateCw,
  ChevronLeft,
  PartyPopper,
  Home,
  Repeat,
} from "lucide-react";
import type { WordRow } from "@/lib/supabase";
import { safeGet, cn } from "@/lib/utils";
import { WordSpeaker } from "./word-speaker";

const RATINGS = [
  {
    key: "forget",
    label: "忘记",
    color: "bg-rose-500 hover:bg-rose-600 shadow-rose-500/30",
    border: "border-rose-200",
    icon: Frown,
    hint: "明天再见",
  },
  {
    key: "hard",
    label: "困难",
    color: "bg-orange-500 hover:bg-orange-600 shadow-orange-500/30",
    border: "border-orange-200",
    icon: Meh,
    hint: "10 分钟后",
  },
  {
    key: "good",
    label: "良好",
    color: "bg-blue-500 hover:bg-blue-600 shadow-blue-500/30",
    border: "border-blue-200",
    icon: Smile,
    hint: "明天",
  },
  {
    key: "easy",
    label: "简单",
    color: "bg-brand-500 hover:bg-brand-600 shadow-brand-500/30",
    border: "border-brand-200",
    icon: Sparkles,
    hint: "4 天后",
  },
] as const;

export function StudySession({ words }: { words: WordRow[] }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);

  const total = words.length;
  const current = words[idx];
  const progress = ((idx + (flipped ? 1 : 0.5)) / total) * 100;

  const rate = () => {
    if (idx + 1 >= total) {
      setDone(true);
    } else {
      setIdx(idx + 1);
      setFlipped(false);
    }
  };

  const restart = () => {
    setIdx(0);
    setFlipped(false);
    setDone(false);
  };

  if (done) return <CompletionScreen total={total} onRestart={restart} />;

  if (!current) return null;

  const def = safeGet<{ pos: string; definition: string } | undefined>(
    current,
    "data.core_meanings.0",
    undefined,
  );
  const example = current.data.example;

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
      {/* 顶部进度 */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/study"
          className="inline-flex items-center gap-1.5 text-sm text-[color:var(--color-text-muted)] hover:text-brand-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          返回计划
        </Link>
        <div className="text-sm font-semibold text-[color:var(--color-text-muted)]">
          <span className="text-brand-700">{idx + 1}</span> / {total}
        </div>
      </div>

      <div className="h-2 rounded-full bg-[color:var(--color-surface-2)] overflow-hidden mb-10">
        <motion.div
          className="h-full bg-brand-500 rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* 卡片区 */}
      <div className="perspective-1000 select-none">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full"
          style={{ perspective: "1500px" }}
        >
          <motion.div
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
            className="relative w-full"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* 正面 */}
            <button
              onClick={() => setFlipped(true)}
              disabled={flipped}
              className="w-full min-h-[420px] p-8 md:p-12 rounded-3xl bg-white border border-[color:var(--color-border)] shadow-xl flex flex-col items-center justify-center text-center"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="text-xs font-semibold text-[color:var(--color-text-muted)] mb-2 uppercase tracking-wider">
                第 {idx + 1} 个
              </div>
              <h2 className="text-6xl md:text-8xl font-extrabold tracking-tight">
                {current.word}
              </h2>
              {current.pronunciation_us && (
                <div className="mt-6 flex items-center gap-3">
                  <span className="font-mono text-base text-[color:var(--color-text-muted)]">
                    {current.pronunciation_us}
                  </span>
                  <span
                    onClick={(e) => e.stopPropagation()}
                    className="inline-block"
                  >
                    <WordSpeaker text={current.word} label="发音" />
                  </span>
                </div>
              )}
              <div className="mt-10 inline-flex items-center gap-1.5 text-sm text-brand-600 font-medium px-4 py-2 rounded-xl bg-brand-50">
                <RotateCw className="w-4 h-4" />
                点击查看释义
              </div>
            </button>

            {/* 背面 */}
            <div
              className="absolute inset-0 w-full min-h-[420px] p-8 md:p-12 rounded-3xl bg-white border border-[color:var(--color-border)] shadow-xl flex flex-col"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-3xl md:text-4xl font-extrabold">
                  {current.word}
                </h2>
                {current.pronunciation_us && (
                  <span className="font-mono text-sm text-[color:var(--color-text-muted)]">
                    {current.pronunciation_us}
                  </span>
                )}
              </div>

              {def && (
                <div className="flex items-start gap-3 mb-5">
                  <span className="shrink-0 px-2 py-0.5 rounded-md bg-[color:var(--color-surface-2)] text-xs font-bold">
                    {def.pos}
                  </span>
                  <p className="text-lg md:text-xl leading-relaxed font-semibold">
                    {def.definition}
                  </p>
                </div>
              )}

              {example?.text && (
                <div className="mt-auto p-4 rounded-xl bg-[color:var(--color-surface-2)]">
                  <p
                    className="text-sm md:text-base leading-relaxed"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    &ldquo;{example.text}&rdquo;
                  </p>
                  {example.translation && (
                    <p className="mt-2 text-xs text-[color:var(--color-text-muted)]">
                      {example.translation}
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* 评分按钮 */}
      <AnimatePresence>
        {flipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8"
          >
            {RATINGS.map((r) => (
              <motion.button
                key={r.key}
                whileTap={{ scale: 0.96 }}
                whileHover={{ y: -2 }}
                onClick={rate}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-4 py-4 rounded-2xl text-white font-bold shadow-lg transition-all",
                  r.color,
                )}
              >
                <r.icon className="w-5 h-5" />
                <div>{r.label}</div>
                <div className="text-xs font-medium opacity-80">{r.hint}</div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {!flipped && (
        <p className="mt-8 text-center text-sm text-[color:var(--color-text-muted)]">
          先回忆这个单词的意思，再翻面对照
        </p>
      )}
    </div>
  );
}

// ============================================================
// 完成态
// ============================================================
function CompletionScreen({
  total,
  onRestart,
}: {
  total: number;
  onRestart: () => void;
}) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100 - 50,
        y: -50 - Math.random() * 50,
        rot: Math.random() * 360,
        delay: Math.random() * 0.5,
        emoji: ["🎉", "✨", "🌟", "🎊", "💫"][i % 5],
      })),
    [],
  );

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-16 text-center relative">
      {/* 撒花 */}
      <div className="absolute inset-x-0 top-0 h-32 overflow-visible pointer-events-none">
        {pieces.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, x: 0, y: 0, rotate: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              x: p.x * 4,
              y: [0, p.y, 200],
              rotate: p.rot + 360,
            }}
            transition={{
              duration: 2.5,
              delay: p.delay,
              ease: "easeOut",
            }}
            className="absolute left-1/2 top-1/2 text-2xl"
          >
            {p.emoji}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 16 }}
        className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-400 to-brand-600 text-white mb-6 shadow-xl shadow-brand-500/30"
      >
        <PartyPopper className="w-12 h-12" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl md:text-5xl font-extrabold tracking-tight"
      >
        今日完成！
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-3 text-[color:var(--color-text-muted)] text-lg"
      >
        你刚刚学习了 {total} 个单词，连续打卡 +1 🔥
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-10 flex flex-col sm:flex-row justify-center gap-3"
      >
        <Link
          href="/study"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-semibold shadow-lg shadow-brand-500/30 transition-all"
        >
          <Home className="w-4 h-4" />
          返回计划
        </Link>
        <button
          onClick={onRestart}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white border border-[color:var(--color-border)] hover:border-brand-300 font-semibold transition-all"
        >
          <Repeat className="w-4 h-4" />
          再来一组
        </button>
      </motion.div>
    </div>
  );
}
