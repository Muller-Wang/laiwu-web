"use client";

import Link from "next/link";
import {
  CalendarDays,
  Target,
  Flame as FlameIcon,
  TrendingUp,
  Trophy,
} from "lucide-react";
import type { WordRow } from "@/lib/supabase";
import { StudyHeatmap } from "./study-heatmap";
import { StudyToday } from "./study-today";
import { useT } from "./i18n-provider";

const PLAN = {
  daysTotal: 30,
  daysDone: 12,
  learned: 740,
  pendingNew: 1260,
  pendingReview: 156,
  streak: 12,
};

export function StudyView({
  newWords,
  reviewWords,
}: {
  newWords: WordRow[];
  reviewWords: WordRow[];
}) {
  const t = useT();
  const progress = Math.round((PLAN.daysDone / PLAN.daysTotal) * 100);
  const daysRemain = PLAN.daysTotal - PLAN.daysDone;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8">
      {/* 计划标题 */}
      <header>
        <div className="flex items-center gap-2 text-sm text-brand-600 font-medium mb-2">
          <CalendarDays className="w-4 h-4" />
          {t("study.crumb")}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {t("study.planName")}
        </h1>
        <p className="mt-2 text-[color:var(--color-text-muted)]">
          {t("study.intro")}
        </p>
      </header>

      {/* 顶部计划卡 + 4 个 KPI */}
      <section className="rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 p-6 md:p-8 text-white shadow-xl shadow-brand-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="relative">
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="text-sm text-white/75 font-medium">
                {t("study.progress.total")}
              </div>
              <div className="text-4xl md:text-5xl font-extrabold mt-1">
                {progress}%
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/75 font-medium">
                {t("study.progress.dayN", {
                  done: PLAN.daysDone,
                  total: PLAN.daysTotal,
                })}
              </div>
              <div className="text-sm font-semibold mt-1">
                {t("study.progress.remain", { n: daysRemain })}
              </div>
            </div>
          </div>
          <div className="h-3 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-7">
            <KPI
              icon={<Trophy className="w-5 h-5" />}
              label={t("study.kpi.learned")}
              value={PLAN.learned}
              suffix={t("study.kpi.unitWord")}
            />
            <KPI
              icon={<Target className="w-5 h-5" />}
              label={t("study.kpi.pendingNew")}
              value={PLAN.pendingNew}
              suffix={t("study.kpi.unitWord")}
            />
            <KPI
              icon={<TrendingUp className="w-5 h-5" />}
              label={t("study.kpi.pendingReview")}
              value={PLAN.pendingReview}
              suffix={t("study.kpi.unitWord")}
            />
            <KPI
              icon={<FlameIcon className="w-5 h-5" />}
              label={t("study.kpi.streak")}
              value={PLAN.streak}
              suffix={t("study.kpi.unitDay")}
            />
          </div>
        </div>
      </section>

      {/* 热力图 */}
      <section>
        <StudyHeatmap />
      </section>

      {/* 今日清单 */}
      <section>
        <StudyToday newWords={newWords} reviewWords={reviewWords} />
      </section>

      {/* 底部大 CTA */}
      <section>
        <Link
          href="/study/session"
          className="block group rounded-3xl bg-white border-2 border-dashed border-brand-300 hover:border-brand-500 hover:bg-brand-50/50 p-8 text-center transition-all"
        >
          <div className="text-lg font-bold text-brand-700">
            {t("study.cta.title")}
          </div>
          <div className="mt-1 text-sm text-[color:var(--color-text-muted)]">
            {t("study.cta.desc", {
              newN: newWords.length,
              reviewN: reviewWords.length,
            })}
          </div>
        </Link>
      </section>
    </div>
  );
}

function KPI({
  icon,
  label,
  value,
  suffix,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div className="rounded-2xl bg-white/15 backdrop-blur-sm p-4 border border-white/20">
      <div className="flex items-center gap-1.5 text-xs text-white/80 font-medium mb-1">
        {icon}
        {label}
      </div>
      <div className="text-2xl font-extrabold leading-none">
        {value.toLocaleString()}
        {suffix && (
          <span className="text-sm font-bold ml-1 text-white/80">{suffix}</span>
        )}
      </div>
    </div>
  );
}
