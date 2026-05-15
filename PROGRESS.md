# 来悟单词书 Web 端 进度

> 实现计划见 `~/docs/plans/2026-05-15-laiwu-web-mvp.md`

## 当前状态

**阶段**：A1 项目初始化（进行中）
**部署**：未部署
**Supabase**：未接入（等用户提供 URL + key）

## 完成情况

### 阶段 A：基础建设
- [x] A1 项目初始化
  - [x] create-next-app（Next 16 + React 19 + Tailwind 4）
  - [x] 安装核心依赖（supabase-js / motion / lucide-react / heatmap / clsx / cva）
  - [x] 配色系统写入 globals.css
  - [x] Manrope + Noto Sans SC 字体配置
  - [x] 目录结构（(marketing) / (app) route groups）
  - [x] 占位页面（home / about / wordbook / word/[slug] / study / study/session）
  - [x] lib/utils.ts + lib/supabase.ts（含 graceful 降级）
- [ ] A2 Supabase 准备（等用户给 key）
- [ ] A3 数据导入（等 A2）

### 阶段 B：核心页面
- [ ] B1 全局布局与导航
- [ ] B2 首页 P1
- [ ] B3 词库页 P2
- [ ] B4 单词详情页 P3

### 阶段 C：辅助页面
- [ ] C1 学习计划页 P4
- [ ] C2 学习模式页 P5

### 阶段 D：收尾
- [ ] D1 关于页 P6
- [ ] D2 视觉打磨
- [ ] D3 部署

## 关键决策

- **Next 16 而非 15**：脚手架默认 16，与 ldreader-site 一致，沿用
- **不用 shadcn CLI**：避免交互式 prompt 卡住，手动建组件文件更可控
- **lib/supabase.ts 内置降级**：env 缺失时 supabase 返回 null，上游需配合 mock 数据
- **(marketing) vs (app) 路由组**：未来如要给 marketing 页面单独的 layout/字体，方便分离

## 阻塞

- 等用户提供 Supabase URL + anon key + service_role key
- 等用户提供 GitHub repo
- 等用户提供 Vercel 账号
