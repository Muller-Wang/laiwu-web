"use client";

import { useEffect, useRef, useState } from "react";
import {
  Download,
  Upload,
  Trash2,
  Database,
  Settings as SettingsIcon,
  AlertTriangle,
} from "lucide-react";
import { motion } from "motion/react";
import {
  exportAllData,
  importBundle,
  clearAllData,
  getAllProgress,
  listBookmarks,
  listWrongWords,
  getSessionsLast,
} from "@/lib/db";
import { useToast } from "./toast";
import { cn } from "@/lib/utils";

export function SettingsView() {
  const { push } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [stats, setStats] = useState<{
    progress: number;
    bookmarks: number;
    wrong: number;
    sessions: number;
  } | null>(null);
  const [confirming, setConfirming] = useState(false);

  const loadStats = async () => {
    const [p, b, w, s] = await Promise.all([
      getAllProgress(),
      listBookmarks(),
      listWrongWords(),
      getSessionsLast(36500), // 全部
    ]);
    setStats({
      progress: p.length,
      bookmarks: b.length,
      wrong: w.length,
      sessions: s.length,
    });
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleExport = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const bundle = await exportAllData();
      const blob = new Blob([JSON.stringify(bundle, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const stamp = new Date().toISOString().slice(0, 10);
      a.download = `laiwu-backup-${stamp}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      push("已导出备份文件");
    } finally {
      setBusy(false);
    }
  };

  const handleImport = async (file: File) => {
    if (busy) return;
    setBusy(true);
    try {
      const text = await file.text();
      const bundle = JSON.parse(text);
      const { counts } = await importBundle(bundle, "merge");
      push(
        `导入完成：进度 ${counts.progress}、收藏 ${counts.bookmarks}、错题 ${counts.wrong_words}`,
      );
      await loadStats();
    } catch (err) {
      console.error(err);
      push("导入失败，文件格式错误");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleClear = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await clearAllData();
      push("所有学习数据已清空");
      await loadStats();
    } finally {
      setBusy(false);
      setConfirming(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8">
      <header>
        <div className="flex items-center gap-2 text-sm text-brand-600 font-medium mb-2">
          <SettingsIcon className="w-4 h-4" />
          数据与设置
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          数据管理
        </h1>
        <p className="mt-2 text-[color:var(--color-text-muted)]">
          所有学习数据都存在你的浏览器本地。导出 JSON 可以在另一台设备恢复。
        </p>
      </header>

      {/* 统计 */}
      <section className="rounded-3xl bg-white border border-[color:var(--color-border)] p-6">
        <div className="flex items-center gap-2 text-sm font-bold mb-4">
          <Database className="w-4 h-4 text-brand-600" />
          本地数据概览
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "已学单词", value: stats?.progress ?? "..." },
            { label: "收藏数", value: stats?.bookmarks ?? "..." },
            { label: "错题数", value: stats?.wrong ?? "..." },
            { label: "学习会话", value: stats?.sessions ?? "..." },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-2xl bg-[color:var(--color-surface-2)] p-4"
            >
              <div className="text-xs text-[color:var(--color-text-muted)] font-medium mb-1">
                {s.label}
              </div>
              <div className="text-2xl font-extrabold text-brand-700">
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 导出导入 */}
      <section className="rounded-3xl bg-white border border-[color:var(--color-border)] p-6 space-y-4">
        <h2 className="font-bold">数据备份</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={busy}
            onClick={handleExport}
            className="flex items-center gap-3 p-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-all disabled:opacity-60"
          >
            <Download className="w-5 h-5" />
            <div className="flex-1 text-left">
              <div>导出全部数据</div>
              <div className="text-xs font-normal opacity-85">
                JSON 文件，可在另一台设备导入恢复
              </div>
            </div>
          </motion.button>

          <motion.label
            whileTap={{ scale: 0.97 }}
            className={cn(
              "flex items-center gap-3 p-4 rounded-2xl bg-white border-2 border-brand-300 hover:border-brand-500 text-brand-700 font-semibold cursor-pointer transition-all",
              busy && "opacity-60 pointer-events-none",
            )}
          >
            <Upload className="w-5 h-5" />
            <div className="flex-1 text-left">
              <div>导入备份文件</div>
              <div className="text-xs font-normal opacity-85">
                合并模式：保留本地数据 + 覆盖同名条目
              </div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImport(file);
              }}
              className="hidden"
            />
          </motion.label>
        </div>
      </section>

      {/* 危险操作 */}
      <section className="rounded-3xl bg-rose-50 border border-rose-200 p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-rose-700">
          <AlertTriangle className="w-4 h-4" />
          危险操作
        </div>
        <p className="text-sm text-rose-700/80">
          清空将删除所有学习进度、收藏、错题与计划。建议先导出备份。
        </p>
        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-rose-300 text-rose-700 text-sm font-semibold hover:bg-rose-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            清空所有学习数据
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleClear}
              disabled={busy}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 transition-colors disabled:opacity-60"
            >
              确认清空
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[color:var(--color-border)] text-sm font-semibold hover:bg-[color:var(--color-surface-2)] transition-colors"
            >
              取消
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
