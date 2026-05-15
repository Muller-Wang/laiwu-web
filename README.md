# 来悟单词书 · Web 端

> AI 驱动的 7000 词雅思单词书。北京外国语大学大创项目 · 项目编号 20251003002S

## 技术栈

- **框架**：Next.js 16（App Router）+ React 19 + TypeScript
- **样式**：Tailwind 4（CSS @theme）+ 手写组件
- **数据库**：Supabase Postgres（生产）/ `data/words.json`（本地降级）
- **动效**：Motion (Framer Motion)
- **字体**：Manrope + Noto Sans SC（fontsource 自托管）
- **运行时**：Bun（本地） / Node（Vercel）

## 本地启动

```bash
bun install
bun dev                # http://localhost:3000
bun run build          # 构建检查
```

无需 Supabase 也能完整跑起来 —— 数据自动 fallback 到 `data/words.json`。

## 接入 Supabase（生产环境）

详见 [`supabase/README.md`](./supabase/README.md) 与 [`DEPLOY.md`](./DEPLOY.md)。三步：

1. 在 Supabase 控制台执行 `supabase/schema.sql`
2. 在 `.env.local` 填三个 key（参考 `.env.local.example`）
3. 跑数据导入：`bun run scripts/import.ts`

## 部署到 Vercel

完整流程见 [`DEPLOY.md`](./DEPLOY.md)。简版：

```bash
git push origin main
```

在 Vercel 控制台 Import 仓库，添加两个环境变量：

| 名称 | 用途 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | 浏览器与 SSR |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 公开读取 |

## 路由

| 路径 | 说明 |
|---|---|
| `/` | 首页：Hero + 创新点 |
| `/wordbook` | 词库浏览（搜索 + 4 维筛选 + 分页） |
| `/word/[slug]` | 单词详情（音标 / 释义 / 熟词生义 / 例句 / 助记 / 联想） |
| `/study` | 学习计划（KPI + 热力图 + 今日清单） |
| `/study/session` | 学习模式（翻面卡 + 评分 + 撒花） |
| `/about` | 项目介绍 |

## 目录结构

```
.
├── app/
│   ├── (marketing)/        # 首页 / 关于（静态）
│   ├── (app)/              # 词库 / 单词 / 学习（动态）
│   ├── layout.tsx          # 全局：字体 + Nav + Footer + ToastProvider
│   ├── globals.css         # @theme 配色
│   └── not-found.tsx       # 404
├── components/             # Nav / Footer / WordCard / WordSpeaker / ...
├── lib/
│   ├── supabase.ts         # 客户端 + WordRow 类型
│   ├── words.ts            # 数据访问层（Supabase ↔ JSON 双路）
│   └── utils.ts            # cn / safeGet / freqLabel
├── data/words.json         # 本地词库快照
├── scripts/import.ts       # 导入 entries.json → Supabase
└── supabase/
    ├── schema.sql          # 建表 SQL
    └── README.md           # 接入指南
```

## 设计 Token

| 用途 | 颜色 |
|---|---|
| 主品牌色 | `--color-brand-500` `#10b981` |
| 强调色（熟词生义） | `--color-accent-500` `#f59e0b` |
| 词频高 / 中 / 低 | 红 / 橙 / 灰 |
| 背景 | `--color-bg` `#fafaf9`（米白） |

字体阶梯通过 Tailwind 工具类（`text-7xl font-extrabold`）+ `var(--font-sans)` 控制。

## 项目背景

详见 [`/about` 页面](http://localhost:3000/about) 或部署后的对应路径。
