# 部署指南

> 24h 评审展示版的最后一公里。代码已就绪，下面是 30 分钟内可完成的步骤。

## 步骤 1：Supabase 建库（5 分钟）

1. 打开 [supabase.com](https://supabase.com)，登录后 New Project
2. 项目名 `laiwu-wordbook`，区域选 **Tokyo / Singapore**（国内访问更快）
3. 等数据库创建完成（约 1 分钟）
4. Dashboard → SQL Editor → New Query → 复制粘贴 `supabase/schema.sql` 整段 → Run
5. Dashboard → Settings → API → 复制三个值备用：
   - Project URL
   - `anon` `public` key
   - `service_role` key（点击眼睛图标显示）

## 步骤 2：填本地 .env.local（1 分钟）

```bash
cd ~/projects/laiwu-web
cat > .env.local <<'EOF'
NEXT_PUBLIC_SUPABASE_URL=<上面的 Project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<上面的 anon key>
SUPABASE_SERVICE_ROLE_KEY=<上面的 service_role key>
EOF
```

## 步骤 3：导入数据（2-5 分钟）

```bash
# 先做 dry-run 验证
bun run scripts/import.ts --dry-run

# 真正导入
bun run scripts/import.ts
```

验证：

```bash
# 在 Supabase Dashboard SQL Editor 执行
SELECT count(*) FROM words;
SELECT word, frequency_level FROM words WHERE has_slang = true LIMIT 5;
```

## 步骤 4：推 GitHub（3 分钟）

```bash
# 在 GitHub 创建一个空仓库 laiwu-web（私有）
# 不要勾任何初始化选项

# 在本地：
git remote add origin git@github.com:<你的用户名>/laiwu-web.git
git push -u origin main
```

## 步骤 5：部署 Vercel（5 分钟）

1. 打开 [vercel.com/new](https://vercel.com/new)，登录
2. 选择刚才的 GitHub 仓库 `laiwu-web` → Import
3. **Environment Variables** 部分添加：

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | 步骤 1 的 Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 步骤 1 的 anon key |

⚠️ **不要**配置 `SUPABASE_SERVICE_ROLE_KEY` —— 那是 import 脚本本地用的，部署不需要。

4. Framework Preset 自动识别为 Next.js → Deploy
5. 等待 2-3 分钟构建完成，访问 `https://laiwu-web-xxx.vercel.app`

## 步骤 6：评审展示前自检（5 分钟）

按这个路径走一遍，每步通过：

- [ ] 首页加载 ≤ 2s，4 张创新点卡片正常显示
- [ ] 点击"进入词库" → 词库页能看到词卡
- [ ] 搜索框输入 `lit` → 能找到
- [ ] 筛选"含熟词生义"打开 → 列表只剩有 🔥 标志的词
- [ ] 点击 `lit` 卡片 → 详情页正常显示熟词生义高亮（🔥 极好的；炸裂的）
- [ ] 详情页点击"发音" → 浏览器朗读单词
- [ ] 点击"加入计划" → 出现 toast 提示
- [ ] 进入 `/study` → 看到进度卡 + 90 天热力图 + 今日清单
- [ ] 点击"开始今日学习" → 学习页能翻面 + 评分
- [ ] 通过 10 张卡 → 出现撒花动画
- [ ] 进入 `/about` → 项目介绍完整
- [ ] 手机浏览器打开同样正常（移动端响应式）

## 故障排查

### 部署后页面 500
- 检查 Vercel 环境变量是否正确填入
- 查看 Vercel → Deployments → Function Logs

### 词库页是空的
- 确认 Supabase 已跑过 `import.ts`，`SELECT count(*) FROM words` 大于 0
- 确认 RLS 策略已创建：`SELECT * FROM pg_policies WHERE tablename = 'words'`

### 搜索没结果
- 浏览器开发者工具 Network 看 Supabase 请求返回什么
- 大概率是 RLS 拦截了，回 SQL Editor 跑：
  ```sql
  DROP POLICY IF EXISTS "Public read access" ON words;
  CREATE POLICY "Public read access" ON words FOR SELECT USING (true);
  ```

### 字体没加载
- 已经用 fontsource 自托管，理论上不会出错
- 如果浏览器显示降级字体，刷新清缓存

## 自定义域名（可选）

在 Vercel → Project Settings → Domains 添加你的域名（如 `laiwu.bfsu.edu.cn`），按指引配置 DNS。

## 演示前 5 分钟

1. 打开浏览器开一个干净窗口
2. 访问部署 URL
3. 按 Cmd/Ctrl + Shift + R 强刷一次
4. 准备好这个 90 秒 demo 顺序：

```
首页（Hero + 数字滚动） → 进入词库 → 搜 lit → 点 lit 卡片
  → 看熟词生义高亮 → 返回 → 进入学习计划 → 看热力图
  → 开始学习 → 翻 2 张卡 → 进入关于页 → 讲创新点
```
