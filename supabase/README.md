# Supabase 接入指引

## 一次性配置（你拿到账号后）

### 1. 创建 Supabase 项目
- 登录 [supabase.com](https://supabase.com)
- New Project → 取名 `laiwu-wordbook`
- 区域选 **Tokyo / Singapore**（国内访问更快）
- 设置数据库密码并保存

### 2. 执行建表 SQL
- Dashboard → SQL Editor → New Query
- 复制 `schema.sql` 全部内容并 Run
- 验证：左侧 Table Editor 能看到 `words` 表

### 3. 复制凭证
Dashboard → Settings → API：

| 字段 | 写入 |
|---|---|
| Project URL | `.env.local` 的 `NEXT_PUBLIC_SUPABASE_URL` |
| `anon` `public` 密钥 | `.env.local` 的 `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `service_role` 密钥（仅服务端） | `.env.local` 的 `SUPABASE_SERVICE_ROLE_KEY` |

⚠️ `service_role` 绝对不要提交到 git，也不要暴露给浏览器。

### 4. 跑数据导入
```bash
bun run scripts/import.ts
```

完成后到 Table Editor 验证：`SELECT count(*) FROM words;` 应返回数据条数。
