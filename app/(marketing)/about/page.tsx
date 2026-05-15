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

const INNOVATIONS = [
  {
    icon: Newspaper,
    title: "实时鲜活例句体系",
    color: "from-blue-400 to-blue-600",
    points: [
      "Grok3 自动抓取《经济学人》《时代周刊》等顶级期刊 2022-2024 年文章",
      "上下文相关性多层评分筛选 + 人工抽样复核",
      "目前 7000 词均配权威母语者语料，新鲜度高达 85%",
      "月度更新机制，让学习内容与时代同步",
    ],
  },
  {
    icon: Lightbulb,
    title: "多元巧记法体系",
    color: "from-amber-400 to-orange-500",
    points: [
      "四大记忆方法：谐音法、象形法、词根词缀法、故事联想法",
      "DeepSeek 模型按词源 / 释义 / 词频智能匹配策略",
      "Kimi 模型合理性评估 + 人工抽样审核 + 用户反馈闭环",
      "用户测试反馈：记忆效率平均提升 40%，遗忘周期明显延长",
    ],
  },
  {
    icon: Flame,
    title: "熟词生义标注",
    color: "from-rose-400 to-pink-600",
    points: [
      "国内词书市场率先系统性引入熟词生义 + 中外异义标注",
      "Grok3 模型对英美主流媒体语料大规模分析，自动识别义项差异",
      "英美用法差异、正式 / 非正式语体差异专项标注",
      "已完成 1200+ 典型案例，覆盖雅思高频易错点与留学生活场景",
    ],
  },
  {
    icon: Users,
    title: "跨学科专业力",
    color: "from-emerald-400 to-teal-600",
    points: [
      "核心成员横跨语言学、计算机科学、英语口译、工商管理",
      "语言学专业素养 × AI 技术应用 × 产品思维的有机融合",
      "从英语习得规律与跨文化交际双重视角设计内容",
      "兼具学术深度与产品打磨能力，每条词条经多轮人工抽检",
    ],
  },
];

const ACHIEVEMENTS = [
  { label: "核心雅思词汇", value: "7,000+" },
  { label: "AI 鲜活例句", value: "20,000+" },
  { label: "熟词生义案例", value: "1,200+" },
  { label: "助记法覆盖率", value: "100%" },
  { label: "首播观看人次", value: "1,635" },
  { label: "AI 内容可用率", value: "93%" },
];

const PIPELINE = [
  { icon: FileText, label: "原始词表", desc: "Python PDF 解析" },
  { icon: Cpu, label: "Coze 工作流", desc: "豆包内容生成" },
  { icon: CheckCircle2, label: "Kimi 校验", desc: "质量评估" },
  { icon: Database, label: "Supabase", desc: "结构化存储" },
  { icon: Globe, label: "Web 端", desc: "本网站" },
];

export default function AboutPage() {
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
            重新定义 AI 时代的英语词汇学习
          </div>
          <h1 className="font-extrabold tracking-tight leading-[1.05] text-[clamp(2.5rem,7vw,8.5rem)]">
            让单词学习从机械记忆
            <br />
            走向真正
            <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
              理解与运用
            </span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-[color:var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed">
            鲜活语料 · 多元巧记 · 熟词生义 —— 一本面向 AI 时代的雅思核心词书
          </p>
        </div>
      </section>

      {/* 项目背景 */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-4">
            <Quote className="w-3.5 h-3.5" />
            产品故事
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            来自对传统词书三大痛点的深刻洞察
          </h2>
          <div className="space-y-4 text-base md:text-lg text-[color:var(--color-text)] leading-relaxed">
            <p>
              <strong className="text-rose-600">例句陈旧</strong>：
              市面绝大多数雅思单词书沿用十年前甚至更早的语料，与当今英语使用语境严重脱节。
            </p>
            <p>
              <strong className="text-orange-600">记忆方法单一</strong>：
              缺乏科学、有趣的记忆引导，学习者只能依赖机械重复，遗忘率极高。
            </p>
            <p>
              <strong className="text-amber-600">忽视熟词生义</strong>：
              学习者掌握单词基础义却在实际使用中频繁出错，尤其影响口语考试中的理解与表达。
            </p>
            <p className="pt-2 text-[color:var(--color-text-muted)]">
              「来悟单词书」以多模型协作的 AI 内容生产管线为技术底座，
              服务雅思备考人群与广大英语学习者，定位「中国本土版柯林斯词典」，
              强调产品思维与用户中心理念。
            </p>
          </div>
        </div>
      </section>

      {/* 四大创新点 */}
      <section className="py-16 px-4 bg-white border-y border-[color:var(--color-border)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-3">
              四大创新
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              用 AI 重新定义单词书
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
                <h3 className="text-xl font-bold mb-4">{it.title}</h3>
                <ul className="space-y-2 text-sm md:text-[15px] text-[color:var(--color-text)] leading-relaxed">
                  {it.points.map((p, j) => (
                    <li key={j} className="flex gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                      <span>{p}</span>
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
              技术架构
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              多模型协作的 AI 内容生产管线
            </h2>
            <p className="mt-3 text-[color:var(--color-text-muted)]">
              三轮模型迭代 · 提示词工程六维框架 · AI 内容可用率从 72% 提升至 93%
            </p>
          </div>

          {/* 管线图 */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2">
            {PIPELINE.map((p, i) => (
              <div key={i} className="flex items-center gap-4 md:gap-2 w-full md:w-auto md:flex-1">
                <div className="flex-1 md:flex-none flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-[color:var(--color-border)] shadow-sm w-full">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-2">
                    <p.icon className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-sm">{p.label}</div>
                  <div className="text-xs text-[color:var(--color-text-muted)] mt-0.5">
                    {p.desc}
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
              项目成果
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              用数据说话
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
                  {a.label}
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
              想了解更多？
            </h2>
            <p className="mt-3 text-white/85 max-w-xl mx-auto">
              欢迎合作伙伴、教育机构、内容创作者联系我们
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
                进入词库
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="mt-8 text-xs text-white/60">
              © 2026 来悟单词书 · 让单词学习从机械记忆走向真正理解
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
