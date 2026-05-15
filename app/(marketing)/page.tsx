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
            opacity: [0, 0.6, 0.4, 0.6],
            y: [20, -10, 5, -8],
          }}
          transition={{
            duration: 6,
            delay: w.delay,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute text-sm md:text-base font-semibold text-brand-600/40 select-none whitespace-nowrap"
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
  return (
    <div className="flex-1">
      {/* ============ HERO ============ */}
      <section className="relative min-h-[88vh] flex items-center justify-center px-4 overflow-hidden">
        {/* 渐变背景 */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse at top, var(--color-brand-100), transparent 60%), radial-gradient(ellipse at bottom right, var(--color-accent-100), transparent 50%)",
          }}
        />
        <FloatingWords />

        <div className="max-w-7xl mx-auto w-full text-center relative z-10 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            为雅思考生与海外华人打造
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-extrabold tracking-tight leading-[0.95] text-[clamp(4rem,14vw,13rem)]"
          >
            来悟
            <span className="bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700 bg-clip-text text-transparent">
              单词书
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-xl md:text-2xl text-[color:var(--color-text-muted)] font-medium"
          >
            中国本土版柯林斯词典
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 text-base md:text-lg text-[color:var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed"
          >
            AI 驱动的 7000 词雅思单词书。
            <br className="hidden md:block" />
            鲜活例句 · 多元巧记 · 熟词生义 —— 让记单词从机械重复走向真正理解。
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
              进入词库
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white hover:bg-[color:var(--color-surface-2)] text-[color:var(--color-text)] text-base font-semibold border border-[color:var(--color-border)] shadow-sm hover:shadow-md transition-all"
            >
              了解项目背景
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============ 数字 ============ */}
      <section className="py-20 px-4 border-y border-[color:var(--color-border)] bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { to: 7000, suffix: "+", label: "核心雅思词汇" },
            { to: 20000, suffix: "+", label: "AI 仿写鲜活例句" },
            { to: 85, suffix: "%", label: "近两年语料占比" },
          ].map((stat, i) => (
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
                {stat.label}
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
              我们用 AI 重新定义单词书
            </h2>
            <p className="mt-4 text-lg text-[color:var(--color-text-muted)] max-w-2xl mx-auto">
              四个维度，让 7000 词从"背得快"变成"用得好"
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Newspaper,
                color: "from-blue-400 to-blue-600",
                title: "实时鲜活例句",
                desc: "Grok3 模型自动抓取《经济学人》《时代周刊》等权威期刊 2022-2024 年最新文章，新鲜度高达 85%，告别十年前的过时语料。",
                badge: "技术创新",
              },
              {
                icon: Lightbulb,
                color: "from-amber-400 to-orange-500",
                title: "多元巧记法",
                desc: "谐音法、象形法、词根词缀法、故事联想法四大记忆策略，由 DeepSeek 智能匹配。用户实测记忆效率提升 40%。",
                badge: "方法创新",
              },
              {
                icon: Flame,
                color: "from-rose-400 to-pink-600",
                title: "熟词生义标注",
                desc: "国内首创系统性熟词生义体系，1200+ 典型案例覆盖雅思高频易错点和留学生活场景。lit、sick、goat 都不再是字面意思。",
                badge: "内容创新",
              },
              {
                icon: Users,
                color: "from-emerald-400 to-teal-600",
                title: "跨学科专业力",
                desc: "语言学专业逻辑 × AI 技术应用 × 产品思维的有机融合。横跨语言学、计算机科学、英语口译与工商管理的跨领域协作。",
                badge: "团队优势",
              },
            ].map((card, i) => (
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
                    {card.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                <p className="text-[color:var(--color-text-muted)] leading-relaxed text-[15px]">
                  {card.desc}
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
          {/* 装饰光斑 */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent-300/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              准备好开始你的雅思词汇之旅了吗？
            </h2>
            <p className="mt-4 text-lg text-white/85 max-w-xl mx-auto">
              7000 个单词在等你 · 现在就开始
            </p>
            <Link
              href="/wordbook"
              className="mt-8 group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-brand-700 font-bold text-base shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
            >
              立即进入词库
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
