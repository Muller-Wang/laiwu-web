"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  Target,
  Flame as FlameIcon,
  TrendingUp,
  Trophy,
  Settings,
} from "lucide-react";
import type { WordRow } from "@/lib/supabase";
import { StudyHeatmap } from "./study-heatmap";
import { StudyToday } from "./study-today";
import { PlanCreator } from "./plan-creator";
import { useT } from "./i18n-provider";
import {
  countByState,
  getCurrentPlan,
  getDueProgress,
  getProgress,
  getSessionsLast,
  getStreakDays,
  type PlanRow,
  type ProgressRow,
  type SessionRow,
} from "@/lib/db";

type DashboardState = {
  plan: PlanRow;
  counts: { new: number; learning: number; review: number; relearning: number };
  streak: number;
  newWords: WordRow[];
  reviewWords: WordRow[];
  sessions: SessionRow[];
};

export function StudyView({ candidates }: { candidates: WordRow[] }) {
  const t = useT();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<DashboardState | null>(null);
  const [plan, setPlan] = useState<PlanRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const p = await getCurrentPlan();
    setPlan(p);
    if (!p) {
      setDashboard(null);
      setLoading(false);
      return;
    }

    const [counts, streak, due, sessions] = await Promise.all([
      countByState(),
      getStreakDays(),
      getDueProgress(),
      getSessionsLast(90),
    ]);

    // 今日清单：复习 = due <= now 的进度，新学 = 候选词中没在 progress 表的
    const dueWordSet = new Set(due.map((r) => r.word));
    const reviewWords: WordRow[] = candidates.filter((c) =>
      dueWordSet.has(c.word),
    );
    // 也要把进度中存在但不在 candidates 中的词，回填到 reviewWords 末尾（可能没有 detail）
    const remainingDue = due.filter((d) => !reviewWords.some((c) => c.word === d.word));

    const studied = await Promise.all(
      candidates.map(async (c) => ({
        c,
        progress: await getProgress(c.word),
      })),
    );
    const newWords: WordRow[] = studied
      .filter(({ progress }) => progress == null)
      .map(({ c }) => c)
      .slice(0, p.daily_target);

    setDashboard({
      plan: p,
      counts,
      streak,
      newWords,
      reviewWords: reviewWords.slice(0, Math.max(5, p.daily_target / 2)),
      sessions,
    });
    setLoading(false);

    // remainingDue 仅 console 提示，避免 UI 处理无 detail 的词
    if (remainingDue.length > 0) {
      console.info(
        `[study] ${remainingDue.length} due reviews not in candidate pool`,
      );
    }
  }, [candidates]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <div className="h-64 rounded-3xl bg-[color:var(--color-surface-2)] animate-pulse" />
      </div>
    );
  }

  if (!plan || !dashboard) {
    return <NoPlanScreen onCreated={load} />;
  }

  return <PlanDashboard data={dashboard} onChangePlan={load} t={t} />;
}

// ============================================================
// 无计划界面
// ============================================================
function NoPlanScreen({ onCreated }: { onCreated: () => void }) {
  const t = useT();
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-10 md:py-16 space-y-8">
      <header className="text-center">
        <div className="inline-flex items-center gap-2 text-sm text-brand-600 font-medium mb-2">
          <CalendarDays className="w-4 h-4" />
          {t("study.crumb")}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {t("plan.dashboard.noPlan")}
        </h1>
        <p className="mt-3 text-[color:var(--color-text-muted)] max-w-xl mx-auto">
          {t("plan.dashboard.noPlanDesc")}
        </p>
      </header>
      <PlanCreator onCreated={onCreated} />
    </div>
  );
}

// ============================================================
// 计划仪表盘
// ============================================================
function PlanDashboard({
  data,
  onChangePlan,
  t,
}: {
  data: DashboardState;
  onChangePlan: () => void;
  t: ReturnType<typeof useT>;
}) {
  const [editing, setEditing] = useState(false);
  const { plan, counts, streak, newWords, reviewWords, sessions } = data;

  const learned = counts.review + counts.relearning;
  const pendingReview = reviewWords.length;
  const pendingNew = Math.max(
    0,
    plan.scope === "freq1" ? 2000 : plan.scope === "freq12" ? 4500 : 7000,
  ) - learned;

  // 计算计划进度（按日期）
  const startMs = new Date(plan.start_date + "T00:00:00").getTime();
  const elapsedDays = Math.max(
    1,
    Math.min(
      plan.days,
      Math.floor((Date.now() - startMs) / (24 * 3600 * 1000)) + 1,
    ),
  );
  const progressPct = Math.round((elapsedDays / plan.days) * 100);
  const daysRemain = Math.max(0, plan.days - elapsedDays);

  if (editing) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-10 space-y-8">
        <button
          onClick={() => setEditing(false)}
          className="text-sm text-[color:var(--color-text-muted)] hover:text-brand-600"
        >
          ← 返回
        </button>
        <PlanCreator
          onCreated={() => {
            setEditing(false);
            onChangePlan();
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8">
      {/* 标题 + 换计划 */}
      <header className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-brand-600 font-medium mb-2">
            <CalendarDays className="w-4 h-4" />
            {t("study.crumb")}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {plan.name}
          </h1>
          <p className="mt-2 text-[color:var(--color-text-muted)]">
            {t("plan.create.dailyValue", { n: plan.daily_target })}
          </p>
        </div>
        <button
          onClick={() => setEditing(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[color:var(--color-border)] hover:border-brand-300 text-xs font-semibold text-[color:var(--color-text-muted)] transition-colors"
        >
          <Settings className="w-3.5 h-3.5" />
          {t("plan.create.change")}
        </button>
      </header>

      {/* KPI 卡 */}
      <section className="rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 p-6 md:p-8 text-white shadow-xl shadow-brand-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="relative">
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="text-sm text-white/75 font-medium">
                {t("study.progress.total")}
              </div>
              <div className="text-4xl md:text-5xl font-extrabold mt-1">
                {progressPct}%
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/75 font-medium">
                {t("study.progress.dayN", {
                  done: elapsedDays,
                  total: plan.days,
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
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-7">
            <KPI
              icon={<Trophy className="w-5 h-5" />}
              label={t("study.kpi.learned")}
              value={learned}
              suffix={t("study.kpi.unitWord")}
            />
            <KPI
              icon={<Target className="w-5 h-5" />}
              label={t("study.kpi.pendingNew")}
              value={pendingNew}
              suffix={t("study.kpi.unitWord")}
            />
            <KPI
              icon={<TrendingUp className="w-5 h-5" />}
              label={t("study.kpi.pendingReview")}
              value={pendingReview}
              suffix={t("study.kpi.unitWord")}
            />
            <KPI
              icon={<FlameIcon className="w-5 h-5" />}
              label={t("study.kpi.streak")}
              value={streak}
              suffix={t("study.kpi.unitDay")}
            />
          </div>
        </div>
      </section>

      {/* 热力图（真实数据） */}
      <section>
        <StudyHeatmap sessions={sessions} />
      </section>

      {/* 今日清单 */}
      <section>
        <StudyToday newWords={newWords} reviewWords={reviewWords} />
      </section>

      {/* 底部 CTA */}
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
