"use client";

import { Languages } from "lucide-react";
import { motion } from "motion/react";
import { useI18n } from "./i18n-provider";

export function LangSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang, t } = useI18n();

  const toggle = () => setLang(lang === "zh" ? "en" : "zh");

  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={toggle}
      title={t("lang.switch")}
      aria-label={t("lang.switch")}
      className={
        compact
          ? "inline-flex items-center justify-center gap-1.5 w-10 h-10 rounded-xl bg-white border border-[color:var(--color-border)] hover:border-brand-300 transition-colors"
          : "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[color:var(--color-border)] hover:border-brand-300 text-sm font-semibold transition-colors"
      }
    >
      <Languages className="w-4 h-4 text-[color:var(--color-text-muted)]" />
      <span className="font-mono text-xs">
        {lang === "zh" ? "EN" : "中"}
      </span>
    </motion.button>
  );
}
