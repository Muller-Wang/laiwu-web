"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Share2, Download, X, BookOpen, Flame } from "lucide-react";
import { toPng } from "html-to-image";
import type { WordRow } from "@/lib/supabase";
import { safeGet } from "@/lib/utils";

export function ShareCardButton({ row }: { row: WordRow }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <motion.button
        whileTap={{ scale: 0.94 }}
        whileHover={{ scale: 1.02 }}
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white border border-[color:var(--color-border)] shadow-lg text-sm font-semibold text-[color:var(--color-text)] hover:border-brand-300"
      >
        <Share2 className="w-4 h-4 text-brand-600" />
        分享
      </motion.button>

      <AnimatePresence>
        {open && <ShareModal row={row} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

function ShareModal({ row, onClose }: { row: WordRow; onClose: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  const download = async () => {
    if (!cardRef.current || busy) return;
    setBusy(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `laiwu-${row.word}.png`;
      a.click();
    } catch (e) {
      console.error("[share] export failed", e);
    } finally {
      setBusy(false);
    }
  };

  const def = safeGet<{ pos: string; definition: string } | undefined>(
    row,
    "data.core_meanings.0",
    undefined,
  );
  const slang = safeGet<{ definition: string } | undefined>(
    row,
    "data.slang_meanings.0",
    undefined,
  );
  const example = row.data.example;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-md w-full"
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-[color:var(--color-surface-2)]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 卡片本体 */}
        <div
          ref={cardRef}
          className="rounded-3xl overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #fef3c7 100%)",
            fontFamily:
              '"Manrope", "Noto Sans SC", "PingFang SC", system-ui, sans-serif',
          }}
        >
          {/* 卡片内容 */}
          <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-sm">来悟单词书</span>
            </div>

            {/* 单词 */}
            <div>
              <h2 className="text-5xl font-extrabold tracking-tight leading-none break-words">
                {row.word}
              </h2>
              {row.pronunciation_us && (
                <p className="mt-3 font-mono text-sm text-[color:var(--color-text-muted)]">
                  {row.pronunciation_us}
                </p>
              )}
            </div>

            {/* 释义 */}
            {def && (
              <div className="flex items-start gap-2">
                <span className="shrink-0 px-2 py-0.5 rounded-md bg-white text-xs font-bold">
                  {def.pos}
                </span>
                <p className="text-lg font-semibold leading-relaxed">
                  {def.definition}
                </p>
              </div>
            )}

            {/* 熟词生义（如有） */}
            {slang && (
              <div className="rounded-2xl bg-white/70 border-l-4 border-amber-400 p-4">
                <div className="text-xs font-bold text-amber-700 mb-1 flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  熟词生义
                </div>
                <p className="text-sm font-semibold leading-relaxed">
                  {slang.definition}
                </p>
              </div>
            )}

            {/* 例句 */}
            {example?.text && (
              <div>
                <p
                  className="text-sm leading-relaxed italic"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  &ldquo;{example.text}&rdquo;
                </p>
                {example.translation && (
                  <p className="mt-1 text-xs text-[color:var(--color-text-muted)]">
                    {example.translation}
                  </p>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="pt-4 border-t border-black/10 flex items-center justify-between text-xs text-[color:var(--color-text-muted)]">
              <span>laiwu-web.vercel.app</span>
              <span>AI 驱动 · 7000 词雅思单词书</span>
            </div>
          </div>
        </div>

        {/* 下载按钮 */}
        <button
          onClick={download}
          disabled={busy}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-bold shadow-xl transition-all"
        >
          <Download className="w-4 h-4" />
          {busy ? "生成中…" : "保存为图片"}
        </button>
      </motion.div>
    </motion.div>
  );
}
