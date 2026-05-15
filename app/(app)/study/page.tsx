import Link from "next/link";
import {
  CalendarDays,
  Target,
  Flame as FlameIcon,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { listWords } from "@/lib/words";
import { StudyHeatmap } from "@/components/study-heatmap";
import { StudyToday } from "@/components/study-today";

export default async function StudyPage() {
  // 假数据：用高频词当今日新学，中频词当待复习
  const [{ items: newWords }, { items: reviewWords }] = await Promise.all([
    listWords({ freq: 1, pageSize: 10, page: 1 }),
    listWords({ freq: 2, pageSize: 5, page: 1 }),
  ]);

  const PLAN = {
    name: "30 天速过雅思核心 2000 词",
    daysTotal: 30,
    daysDone: 12,
    learned: 740,
    pendingNew: 1260,
    pendingReview: 156,
    streak: 12,
  };
  const progress = Math.round((PLAN.daysDone / PLAN.daysTotal) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8">
      {/* 计划标题 */}
      <header>
        <div className="flex items-center gap-2 text-sm text-brand-600 font-medium mb-2">
          <CalendarDays className="w-4 h-4" />
          我的学习计划
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {PLAN.name}
        </h1>
        <p className="mt-2 text-[color:var(--color-text-muted)]">
          每天约学习 67 个词 · 包含 5 词回顾 · 评审展示用 Demo 数据
        </p>
      </header>

      {/* 顶部计划卡 + 4 个 KPI */}
      <section className="rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 p-6 md:p-8 text-white shadow-xl shadow-brand-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="relative">
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="text-sm text-white/75 font-medium">总进度</div>
              <div className="text-4xl md:text-5xl font-extrabold mt-1">
                {progress}%
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/75 font-medium">
                第 {PLAN.daysDone} / {PLAN.daysTotal} 天
              </div>
              <div className="text-sm font-semibold mt-1">还有 18 天</div>
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
              label="已掌握"
              value={PLAN.learned}
              suffix="词"
            />
            <KPI
              icon={<Target className="w-5 h-5" />}
              label="待新学"
              value={PLAN.pendingNew}
              suffix="词"
            />
            <KPI
              icon={<TrendingUp className="w-5 h-5" />}
              label="待复习"
              value={PLAN.pendingReview}
              suffix="词"
            />
            <KPI
              icon={<FlameIcon className="w-5 h-5" />}
              label="连续打卡"
              value={PLAN.streak}
              suffix="天"
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
            🚀 开始今日学习
          </div>
          <div className="mt-1 text-sm text-[color:var(--color-text-muted)]">
            预计 15 分钟 · {newWords.length} 个新词 + {reviewWords.length} 个复习
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
