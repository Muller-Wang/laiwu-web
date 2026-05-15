# 来悟单词书 Web 端 进度

> 实现计划见 `~/docs/plans/2026-05-15-laiwu-web-mvp.md`

## 当前状态

**阶段**：D3 部署准备（等用户提供 GitHub + Vercel）
**部署**：未部署，本地构建通过
**Supabase**：脚本就绪，等用户提供 key

## 完成情况

### 阶段 A：基础建设 ✅
- [x] A1 项目初始化（Next 16 + React 19 + Tailwind 4 + fontsource）
- [x] A2 Supabase schema 与接入指南
- [x] A3 数据导入脚本（dry-run 已验证 1849 条）

### 阶段 B：核心页面 ✅
- [x] B1 全局布局：Nav（移动汉堡）+ Footer + ToastProvider
- [x] B2 首页：Hero + 漂浮单词 + 3 大数字 + 4 创新点 + CTA
- [x] B3 词库页：搜索 + 4 维筛选 + 卡片网格 + 分页 + URL state
- [x] B4 单词详情：完整 schema + 熟词生义高亮 + Web Speech + 浮动操作

### 阶段 C：辅助页面 ✅
- [x] C1 学习计划：进度卡 + KPI + 90 天热力图 + 今日清单 Tabs
- [x] C2 学习模式：翻面卡 + 4 档评分 + 完成撒花动画

### 阶段 D：收尾
- [x] D1 关于页：背景 + 4 创新 + 管线图 + 6 项成果 + 联系
- [x] D2 视觉打磨：404 / metadata / viewport / themeColor
- [ ] D3 部署（等 GitHub + Vercel）

## 路由列表（7 条）

| 路径 | 类型 | 说明 |
|---|---|---|
| `/` | static | 首页 |
| `/about` | static | 关于项目 |
| `/wordbook` | dynamic | 词库（依赖 searchParams） |
| `/word/[slug]` | dynamic | 单词详情 |
| `/study` | static | 学习计划 |
| `/study/session` | dynamic | 学习模式 |
| `/_not-found` | static | 404 |

## 关键决策

- **Next 16 而非 15**：脚手架默认 16，与 ldreader-site 一致，沿用
- **不用 shadcn CLI**：避免交互式 prompt 卡住，手动建组件文件更可控
- **lib/supabase.ts 内置降级**：env 缺失时 supabase 返回 null，自动 fallback 到 `data/words.json`
- **(marketing) vs (app) 路由组**：未来如要给 marketing 页面单独 layout，方便分离
- **fontsource 自托管字体**：避免 next/font/google 国内构建失败
- **mock data + Supabase 双路**：保证用户没给 key 之前网站也能跑

## 待用户提供

- [ ] Supabase URL + anon key + service_role key
- [ ] GitHub repo（用于推送 + Vercel 接入）
- [ ] Vercel 账号

## 部署后操作清单

1. 在 Supabase 控制台跑 `supabase/schema.sql`
2. 在 `.env.local` 填三个 key
3. `bun run scripts/import.ts` 导入 7000 词
4. 推 GitHub
5. Vercel Import + 配置环境变量
6. Vercel Deploy
