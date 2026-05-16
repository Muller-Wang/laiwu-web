"use client";

import Link from "next/link";
import {
  Newspaper,
  Lightbulb,
  Flame,
  Users,
  ArrowRight,
  Database,
  Cpu,
  FileText,
  CheckCircle2,
  Award,
  Quote,
  Globe,
  Mail,
} from "lucide-react";
import { useT } from "@/components/i18n-provider";
import type { DictKey } from "@/lib/i18n/dict";

type Innovation = {
  icon: typeof Newspaper;
  titleKey: DictKey;
  color: string;
  pointKeys: DictKey[];
};

const INNOVATIONS: Innovation[] = [
  {
    icon: Newspaper,
    titleKey: "about.inn1.title",
    color: "from-blue-400 to-blue-600",
    pointKeys: [
      "about.inn1.p1",
      "about.inn1.p2",
      "about.inn1.p3",
      "about.inn1.p4",
    ],
  },
  {
    icon: Lightbulb,
    titleKey: "about.inn2.title",
    color: "from-amber-400 to-orange-500",
    pointKeys: [
      "about.inn2.p1",
      "about.inn2.p2",
      "about.inn2.p3",
      "about.inn2.p4",
    ],
  },
  {
    icon: Flame,
    titleKey: "about.inn3.title",
    color: "from-rose-400 to-pink-600",
    pointKeys: [
      "about.inn3.p1",
      "about.inn3.p2",
      "about.inn3.p3",
      "about.inn3.p4",
    ],
  },
  {
    icon: Users,
    titleKey: "about.inn4.title",
    color: "from-emerald-400 to-teal-600",
    pointKeys: [
      "about.inn4.p1",
      "about.inn4.p2",
      "about.inn4.p3",
      "about.inn4.p4",
    ],
  },
];

const ACHIEVEMENTS: Array<{ labelKey: DictKey; value: string }> = [
  { labelKey: "about.ach.l1", value: "7,000+" },
  { labelKey: "about.ach.l2", value: "20,000+" },
  { labelKey: "about.ach.l3", value: "1,200+" },
  { labelKey: "about.ach.l4", value: "100%" },
  { labelKey: "about.ach.l5", value: "1,635" },
  { labelKey: "about.ach.l6", value: "93%" },
];

const PIPELINE: Array<{
  icon: typeof FileText;
  labelKey: DictKey;
  descKey: DictKey;
}> = [
  { icon: FileText, labelKey: "about.pipe.p1.label", descKey: "about.pipe.p1.desc" },
  { icon: Cpu, labelKey: "about.pipe.p2.label", descKey: "about.pipe.p2.desc" },
  { icon: CheckCircle2, labelKey: "about.pipe.p3.label", descKey: "about.pipe.p3.desc" },
  { icon: Database, labelKey: "about.pipe.p4.label", descKey: "about.pipe.p4.desc" },
  { icon: Globe, labelKey: "about.pipe.p5.label", descKey: "about.pipe.p5.desc" },
];

export default function AboutPage() {
  const t = useT();

  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 md:py-28 px-4 overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse at top, var(--color-brand-100), transparent 60%)",
          }}
        />
        <div className="max-w-7xl mx-auto w-full text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-sm font-medium mb-6">
            <Award className="w-4 h-4" />
            {t("about.badge")}
          </div>
          <h1 className="font-extrabold tracking-tight leading-[1.05] text-[clamp(2.5rem,7vw,8.5rem)]">
            {t("about.title.l1")}
            <br />
            {t("about.title.l2")}
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
              {" "}
              {t("about.title.l3")}
            </span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-[color:var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed">
            {t("about.subtitle")}
          </p>
        </div>
      </section>

      {/* 产品故事 */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-4">
            <Quote className="w-3.5 h-3.5" />
            {t("about.story.tag")}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            {t("about.story.title")}
          </h2>
          <div className="space-y-4 text-base md:text-lg text-[color:var(--color-text)] leading-relaxed">
            <p>
              <strong className="text-rose-600">{t("about.pain1.tag")}</strong>
              ：{t("about.pain1.desc")}
            </p>
            <p>
              <strong className="text-orange-600">{t("about.pain2.tag")}</strong>
              ：{t("about.pain2.desc")}
            </p>
            <p>
              <strong className="text-amber-600">{t("about.pain3.tag")}</strong>
              ：{t("about.pain3.desc")}
            </p>
            <p className="pt-2 text-[color:var(--color-text-muted)]">
              {t("about.story.summary")}
            </p>
          </div>
        </div>
      </section>

      {/* 四大创新点 */}
      <section className="py-16 px-4 bg-white border-y border-[color:var(--color-border)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-3">
              {t("about.inn.tag")}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {t("about.inn.title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {INNOVATIONS.map((it, i) => (
              <div
                key={i}
                className="p-7 rounded-3xl bg-white border border-[color:var(--color-border)] shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${it.color} flex items-center justify-center shadow-md mb-5`}
                >
                  <it.icon className="w-7 h-7 text-white" strokeWidth={2.2} />
                </div>
                <h3 className="text-xl font-bold mb-4">{t(it.titleKey)}</h3>
                <ul className="space-y-2 text-sm md:text-[15px] text-[color:var(--color-text)] leading-relaxed">
                  {it.pointKeys.map((k, j) => (
                    <li key={j} className="flex gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                      <span>{t(k)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 技术架构 */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-3">
              {t("about.pipe.tag")}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {t("about.pipe.title")}
            </h2>
            <p className="mt-3 text-[color:var(--color-text-muted)]">
              {t("about.pipe.subtitle")}
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2">
            {PIPELINE.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-4 md:gap-2 w-full md:w-auto md:flex-1"
              >
                <div className="flex-1 md:flex-none flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-[color:var(--color-border)] shadow-sm w-full">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-2">
                    <p.icon className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-sm">{t(p.labelKey)}</div>
                  <div className="text-xs text-[color:var(--color-text-muted)] mt-0.5">
                    {t(p.descKey)}
                  </div>
                </div>
                {i < PIPELINE.length - 1 && (
                  <ArrowRight className="hidden md:block w-5 h-5 text-[color:var(--color-text-muted)] shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 项目成果 */}
      <section className="py-16 px-4 bg-white border-y border-[color:var(--color-border)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-3">
              {t("about.ach.tag")}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {t("about.ach.title")}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {ACHIEVEMENTS.map((a, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-gradient-to-br from-brand-50 to-emerald-50 border border-brand-200 text-center"
              >
                <div className="text-3xl md:text-4xl font-extrabold text-brand-700 tracking-tight">
                  {a.value}
                </div>
                <div className="mt-2 text-sm text-[color:var(--color-text-muted)] font-medium">
                  {t(a.labelKey)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 联系 */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 p-10 md:p-12 text-white text-center shadow-xl shadow-brand-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {t("about.contact.title")}
            </h2>
            <p className="mt-3 text-white/85 max-w-xl mx-auto">
              {t("about.contact.desc")}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <a
                href="mailto:muller@bfsu.edu.cn"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white text-brand-700 font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <Mail className="w-4 h-4" />
                muller@bfsu.edu.cn
              </a>
              <Link
                href="/wordbook"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/15 backdrop-blur-sm hover:bg-white/25 text-white font-bold border border-white/30 transition-all"
              >
                {t("about.contact.enter")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="mt-8 text-xs text-white/60">{t("about.contact.copy")}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
