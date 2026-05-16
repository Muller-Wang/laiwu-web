"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Lightbulb,
  Flame,
  Users,
  Newspaper,
} from "lucide-react";
import { useT } from "@/components/i18n-provider";
import type { DictKey } from "@/lib/i18n/dict";

// ============================================================
// 漂浮单词背景
// ============================================================
const FLOATING_WORDS = [
  { text: "lit 🔥", x: "8%", y: "15%", delay: 0 },
  { text: "goat", x: "85%", y: "20%", delay: 0.4 },
  { text: "sick", x: "12%", y: "70%", delay: 0.8 },
  { text: "vibe", x: "88%", y: "65%", delay: 1.2 },
  { text: "spill the tea", x: "75%", y: "85%", delay: 1.6 },
  { text: "slay", x: "20%", y: "40%", delay: 2.0 },
];

function FloatingWords() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {FLOATING_WORDS.map((w, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: [0, 1, 0.85, 1],
            y: [20, -10, 5, -8],
          }}
          transition={{
            duration: 6,
            delay: w.delay,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute text-base md:text-lg font-bold text-brand-800 select-none whitespace-nowrap"
          style={{ left: w.x, top: w.y }}
        >
          {w.text}
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================
// 数字滚动
// ============================================================
function CountUp({
  to,
  suffix = "",
  prefix = "",
  duration = 1600,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);

  return (
    <span>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

// ============================================================
// 主页面
// ============================================================
export default function HomePage() {
  const t = useT();

  const STATS: Array<{ to: number; suffix: string; labelKey: DictKey }> = [
    { to: 7000, suffix: "+", labelKey: "home.stats.words" },
    { to: 20000, suffix: "+", labelKey: "home.stats.examples" },
    { to: 85, suffix: "%", labelKey: "home.stats.fresh" },
  ];

  const INNOVATIONS: Array<{
    icon: typeof Newspaper;
    color: string;
    titleKey: DictKey;
    descKey: DictKey;
    badgeKey: DictKey;
  }> = [
    {
      icon: Newspaper,
      color: "from-blue-400 to-blue-600",
      titleKey: "home.inn1.title",
      descKey: "home.inn1.desc",
      badgeKey: "home.inn1.badge",
    },
    {
      icon: Lightbulb,
      color: "from-amber-400 to-orange-500",
      titleKey: "home.inn2.title",
      descKey: "home.inn2.desc",
      badgeKey: "home.inn2.badge",
    },
    {
      icon: Flame,
      color: "from-rose-400 to-pink-600",
      titleKey: "home.inn3.title",
      descKey: "home.inn3.desc",
      badgeKey: "home.inn3.badge",
    },
    {
      icon: Users,
      color: "from-emerald-400 to-teal-600",
      titleKey: "home.inn4.title",
      descKey: "home.inn4.desc",
      badgeKey: "home.inn4.badge",
    },
  ];

  return (
    <div className="flex-1">
      {/* ============ HERO ============ */}
      <section className="relative min-h-[88vh] flex items-center justify-center px-4 overflow-hidden">
        {/* 渐变背景（最底层）*/}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at top, var(--color-brand-100), transparent 60%), radial-gradient(ellipse at bottom right, var(--color-accent-100), transparent 50%)",
          }}
        />

        {/* 多语种字海封面（整张均匀，羽化 60% → opacity 0.4） */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "url('/cover-v2.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.05,
            filter: "saturate(0.85)",
          }}
        />

        <FloatingWords />

        <div className="max-w-5xl mx-auto text-center relative z-10 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            {t("home.badge")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05]"
          >
            {t("home.brand")}
            <span className="bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700 bg-clip-text text-transparent">
              {t("home.brandSuffix")}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-xl md:text-2xl text-[color:var(--color-text-muted)] font-medium"
          >
            {t("home.subtitle")}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 text-base md:text-lg text-[color:var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed"
          >
            {t("home.intro")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/wordbook"
              className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white text-base font-semibold shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transition-all hover:-translate-y-0.5"
            >
              {t("home.cta.enter")}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white hover:bg-[color:var(--color-surface-2)] text-[color:var(--color-text)] text-base font-semibold border border-[color:var(--color-border)] shadow-sm hover:shadow-md transition-all"
            >
              {t("home.cta.about")}
            </Link>
          </motion.div>
        </div>

        {/* 底部白色羽化层：让 Hero 平滑过渡到下方数字 section */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.6) 60%, #ffffff 100%)",
          }}
        />
      </section>

      {/* ============ 数字 ============ */}
      <section className="py-20 px-4 border-b border-[color:var(--color-border)] bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="text-5xl md:text-6xl font-extrabold text-brand-600 tracking-tight">
                <CountUp to={stat.to} suffix={stat.suffix} />
              </div>
              <div className="mt-3 text-sm md:text-base text-[color:var(--color-text-muted)] font-medium">
                {t(stat.labelKey)}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ 四大创新点 ============ */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              {t("home.section.title")}
            </h2>
            <p className="mt-4 text-lg text-[color:var(--color-text-muted)] max-w-2xl mx-auto">
              {t("home.section.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {INNOVATIONS.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="group p-7 rounded-3xl bg-white border border-[color:var(--color-border)] hover:border-brand-300 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-5">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-md`}
                  >
                    <card.icon className="w-7 h-7 text-white" strokeWidth={2.2} />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[color:var(--color-surface-2)] text-xs font-medium text-[color:var(--color-text-muted)]">
                    {t(card.badgeKey)}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3">{t(card.titleKey)}</h3>
                <p className="text-[color:var(--color-text-muted)] leading-relaxed text-[15px]">
                  {t(card.descKey)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 终端 CTA ============ */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 p-12 md:p-16 text-center text-white shadow-2xl shadow-brand-500/20 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent-300/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              {t("home.cta2.title")}
            </h2>
            <p className="mt-4 text-lg text-white/85 max-w-xl mx-auto">
              {t("home.cta2.subtitle")}
            </p>
            <Link
              href="/wordbook"
              className="mt-8 group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-brand-700 font-bold text-base shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
            >
              {t("home.cta2.button")}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
