"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Target, CalendarDays, Sparkles } from "lucide-react";
import { setCurrentPlan, type PlanScope } from "@/lib/db";
import { useT } from "./i18n-provider";
import { cn } from "@/lib/utils";
import type { DictKey } from "@/lib/i18n/dict";

const SCOPE_OPTIONS: Array<{ value: PlanScope; size: number; labelKey: DictKey }> = [
  { value: "freq1", size: 2000, labelKey: "plan.create.scope.freq1" },
  { value: "freq12", size: 4500, labelKey: "plan.create.scope.freq12" },
  { value: "all", size: 7000, labelKey: "plan.create.scope.all" },
];

const DAYS_OPTIONS = [30, 60, 90, 180];

export function PlanCreator({ onCreated }: { onCreated: () => void }) {
  const t = useT();
  const [scope, setScope] = useState<PlanScope>("freq1");
  const [days, setDays] = useState(30);
  const [busy, setBusy] = useState(false);

  const scopeMeta =
    SCOPE_OPTIONS.find((o) => o.value === scope) ?? SCOPE_OPTIONS[0];
  const daily = Math.ceil(scopeMeta.size / days);

  const submit = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await setCurrentPlan({
        name: `${days} 天速过 ${scopeMeta.size}+ 词`,
        scope,
        days,
        daily_target: daily,
        start_date: new Date().toISOString().slice(0, 10),
      });
      onCreated();
    } catch (e) {
      console.error("[plan] create failed", e);
      setBusy(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-3xl bg-white border border-[color:var(--color-border)] shadow-sm p-6 md:p-10 space-y-8"
    >
      <header>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          {t("plan.create.title")}
        </div>
        <p className="text-[color:var(--color-text-muted)]">
          {t("plan.create.desc")}
        </p>
      </header>

      {/* 范围 */}
      <div>
        <div className="flex items-center gap-2 text-sm font-bold mb-3">
          <Target className="w-4 h-4 text-brand-600" />
          {t("plan.create.scope")}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {SCOPE_OPTIONS.map((opt) => {
            const active = scope === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setScope(opt.value)}
                className={cn(
                  "p-4 rounded-2xl text-left border-2 transition-all",
                  active
                    ? "bg-brand-50 border-brand-500"
                    : "bg-white border-[color:var(--color-border)] hover:border-brand-300",
                )}
              >
                <div className="text-xs text-[color:var(--color-text-muted)] mb-1">
                  {opt.value === "freq1"
                    ? "HIGH"
                    : opt.value === "freq12"
                      ? "HIGH+MID"
                      : "ALL"}
                </div>
                <div className="font-bold text-sm leading-relaxed">
                  {t(opt.labelKey)}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 天数 */}
      <div>
        <div className="flex items-center gap-2 text-sm font-bold mb-3">
          <CalendarDays className="w-4 h-4 text-brand-600" />
          {t("plan.create.days")}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {DAYS_OPTIONS.map((d) => {
            const active = days === d;
            return (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={cn(
                  "py-3 rounded-2xl font-bold transition-all border-2",
                  active
                    ? "bg-brand-500 text-white border-brand-500"
                    : "bg-white border-[color:var(--color-border)] hover:border-brand-300",
                )}
              >
                {t("plan.create.daysLabel", { n: d })}
              </button>
            );
          })}
        </div>
      </div>

      {/* 每日量预览 */}
      <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-emerald-50 border border-brand-200 p-5">
        <div className="text-xs font-semibold text-brand-700 uppercase tracking-wider mb-1">
          {t("plan.create.daily")}
        </div>
        <div className="text-2xl font-extrabold text-brand-700">
          {t("plan.create.dailyValue", { n: daily })}
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        disabled={busy}
        onClick={submit}
        className="w-full py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold shadow-lg shadow-brand-500/30 transition-all disabled:opacity-60"
      >
        {t("plan.create.submit")}
      </motion.button>
    </motion.div>
  );
}
