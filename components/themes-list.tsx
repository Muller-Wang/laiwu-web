"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { THEMES } from "@/lib/themes";
import { useI18n } from "./i18n-provider";

export function ThemesList() {
  const { lang } = useI18n();
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8">
      <header>
        <div className="flex items-center gap-2 text-sm text-brand-600 font-medium mb-2">
          <Sparkles className="w-4 h-4" />
          {lang === "zh" ? "主题词包" : "Theme Packs"}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {lang === "zh"
            ? "按场景精选的高频词包"
            : "Curated word packs by scenario"}
        </h1>
        <p className="mt-2 text-[color:var(--color-text-muted)]">
          {lang === "zh"
            ? "围绕特定场景挑选 30 个核心词，配合熟词生义与例句，专项突破"
            : "30 essential words per scenario, with slang meanings and examples"}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {THEMES.map((t, i) => (
          <motion.div
            key={t.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Link
              href={`/themes/${t.slug}`}
              className="group block p-6 md:p-7 rounded-3xl bg-white border border-[color:var(--color-border)] hover:border-brand-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center text-3xl shadow-md`}
                >
                  {t.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold mb-1 group-hover:text-brand-600 transition-colors">
                    {lang === "zh" ? t.nameZh : t.nameEn}
                  </h3>
                  <p className="text-sm text-[color:var(--color-text-muted)] leading-relaxed">
                    {lang === "zh" ? t.descZh : t.descEn}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-[color:var(--color-text-muted)] font-semibold">
                      {t.words.length}{" "}
                      {lang === "zh" ? "核心词" : "core words"}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[color:var(--color-text-muted)] group-hover:translate-x-1 group-hover:text-brand-600 transition-all" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
