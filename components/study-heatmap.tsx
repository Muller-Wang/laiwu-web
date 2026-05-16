"use client";

import CalendarHeatmap from "react-calendar-heatmap";
import { useEffect, useMemo, useState } from "react";
import { useT } from "./i18n-provider";

// 用确定性 PRNG 避免 hydration mismatch
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function StudyHeatmap() {
  const [mounted, setMounted] = useState(false);
  const t = useT();

  useEffect(() => setMounted(true), []);

  const { startDate, endDate, values } = useMemo(() => {
    const end = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() - 90);
    const rand = mulberry32(20260515);
    const vals: { date: string; count: number }[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const r = rand();
      const count = r < 0.15 ? 0 : Math.floor(r * 50) + 5;
      vals.push({ date: d.toISOString().slice(0, 10), count });
    }
    return { startDate: start, endDate: end, values: vals };
  }, []);

  if (!mounted) {
    return <div className="h-32 rounded-2xl bg-[color:var(--color-surface-2)] animate-pulse" />;
  }

  return (
    <div className="rounded-2xl bg-white border border-[color:var(--color-border)] p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold">{t("study.heatmap.title")}</h3>
        <div className="flex items-center gap-1.5 text-xs text-[color:var(--color-text-muted)]">
          <span>{t("study.heatmap.less")}</span>
          <span className="w-3 h-3 rounded-sm bg-[#ebedf0]" />
          <span className="w-3 h-3 rounded-sm bg-brand-200" />
          <span className="w-3 h-3 rounded-sm bg-brand-400" />
          <span className="w-3 h-3 rounded-sm bg-brand-600" />
          <span className="w-3 h-3 rounded-sm bg-brand-800" />
          <span>{t("study.heatmap.more")}</span>
        </div>
      </div>
      <div className="heatmap-wrapper">
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={values}
          classForValue={(v) => {
            if (!v || v.count === 0) return "color-empty";
            if (v.count < 10) return "color-scale-1";
            if (v.count < 20) return "color-scale-2";
            if (v.count < 35) return "color-scale-3";
            return "color-scale-4";
          }}
          showWeekdayLabels={false}
        />
      </div>
      <style>{`
        .heatmap-wrapper :global(.react-calendar-heatmap text) {
          font-size: 9px;
          fill: var(--color-text-muted);
        }
        .heatmap-wrapper :global(.color-empty) { fill: #ebedf0; }
        .heatmap-wrapper :global(.color-scale-1) { fill: var(--color-brand-200); }
        .heatmap-wrapper :global(.color-scale-2) { fill: var(--color-brand-400); }
        .heatmap-wrapper :global(.color-scale-3) { fill: var(--color-brand-600); }
        .heatmap-wrapper :global(.color-scale-4) { fill: var(--color-brand-800); }
        .heatmap-wrapper :global(rect) { rx: 2; ry: 2; }
      `}</style>
    </div>
  );
}
