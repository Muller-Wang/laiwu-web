# 阿里云 ECS 部署指南

> 适用场景：中国大陆 ECS + 已备案域名 + 任意 Linux 发行版
> 目标：30-60 分钟把 laiwu-web 部署到 https://你的域名/

---

## 总体流程

```
1. 阿里云控制台：开安全组 80/443 + 查 ECS 公网 IP + DNS 解析域名 → IP
2. SSH 登录 ECS → 装 Node 20 + Git + PM2 + Nginx + Certbot
3. 拉代码 → 配 .env.local → 装依赖 → 构建 → PM2 启动
4. Nginx 反向代理 (80) → Next.js (3000)
5. Certbot 自动申请 HTTPS 证书 + 自动续期
6. 验收：浏览器打开 https://你的域名/
```

---

## 阶段 1：阿里云控制台准备（5 分钟）

### 1.1 查 ECS 公网 IP
- 登录 https://ecs.console.aliyun.com
- 左侧"实例与镜像" → "实例"
- 找到你的服务器，记下 **公网 IP**（不是私有 IP）

### 1.2 开放安全组端口
- 点击实例名字 → 顶部 Tab "安全组" → 进入安全组 → "入方向"
- 添加以下规则（如果不存在）：

| 端口 | 协议 | 源 | 说明 |
|---|---|---|---|
| 22 | TCP | 0.0.0.0/0 | SSH（一般已开） |
| 80 | TCP | 0.0.0.0/0 | HTTP |
| 443 | TCP | 0.0.0.0/0 | HTTPS |

### 1.3 DNS 解析域名到 ECS
- 阿里云控制台搜"云解析 DNS" → 找到你的域名 → 解析设置
- 添加 A 记录：
  - **记录类型**：A
  - **主机记录**：`@`（裸域名）和 `www`（建议都加）
  - **记录值**：你的 ECS 公网 IP
  - **TTL**：600
- 等 5-10 分钟生效

---

## 阶段 2：SSH 登录服务器

### 选项 A：在浏览器内连接（最简单）
- ECS 控制台 → 找到实例 → 右侧"远程连接" → "立即登录"
- 用 root 用户登录（密码是创建 ECS 时设置的）

### 选项 B：从 Mac 终端 SSH
```bash
ssh root@<公网IP>
# 输入密码
```

---

## 阶段 3：系统准备（10 分钟）

### 3.1 查系统类型
```bash
cat /etc/os-release | grep '^PRETTY'
```

输出类似：
- `PRETTY_NAME="Ubuntu 22.04 LTS"` → 走 Ubuntu 分支
- `PRETTY_NAME="Alibaba Cloud Linux ..."` 或 `CentOS` → 走 RHEL 分支

### 3.2 装基础工具

**Ubuntu / Debian**：
```bash
apt update
apt install -y curl git build-essential nginx
```

**Alibaba Cloud Linux / CentOS**：
```bash
dnf install -y curl git gcc-c++ make nginx
# 老 CentOS 7 用 yum
```

### 3.3 装 Node.js 20（用 nvm）
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
nvm alias default 20

# 验证
node -v   # 应该看到 v20.x
npm -v
```

### 3.4 装 PM2（进程守护）
```bash
npm install -g pm2
```

### 3.5 装 Certbot（HTTPS 证书）

**Ubuntu**：
```bash
apt install -y certbot python3-certbot-nginx
```

**Alibaba Cloud Linux**：
```bash
dnf install -y certbot python3-certbot-nginx
```

---

## 阶段 4：拉代码 + 构建（10 分钟）

### 4.1 让 GitHub 仓库能被 ECS 访问

⚠️ 仓库目前是 **Private**。三选一：

**选项 A（最简单）**：把仓库改 Public
- GitHub → 仓库 → Settings → 滚到最底"Danger Zone" → Change visibility → Public
- 之后任何机器都能 `git clone` 不用配 key

**选项 B**：用 Deploy Key（推荐生产环境）
```bash
# ECS 上生成 key
ssh-keygen -t ed25519 -C "ecs-deploy" -N "" -f ~/.ssh/github_deploy
cat ~/.ssh/github_deploy.pub
# 复制公钥，到 GitHub 仓库 → Settings → Deploy keys → Add → 粘贴
# Title: aliyun-ecs，不勾 Allow write access
```

然后配置 SSH config：
```bash
cat >> ~/.ssh/config <<'EOF'
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/github_deploy
  StrictHostKeyChecking no
EOF
chmod 600 ~/.ssh/config
```

### 4.2 克隆代码
```bash
mkdir -p /var/www && cd /var/www

# 选项 A（public）：
git clone https://github.com/Muller-Wang/laiwu-web.git

# 选项 B（private + deploy key）：
git clone git@github.com:Muller-Wang/laiwu-web.git

cd laiwu-web
```

### 4.3 配 .env.local
```bash
cat > .env.local <<'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://jamjjjyzfpdzdookerds.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_KQTZ0sghAdAhQY0-q6xdPw_TNEr_WBo
EOF
```

⚠️ 故意**不**写 `SUPABASE_SERVICE_ROLE_KEY` —— 那只是本地导入脚本用的，部署不需要也不应该出现在服务器上。

### 4.4 装依赖 + 构建
```bash
npm install --legacy-peer-deps   # bun 也行但 ECS 上 Node 更稳
npm run build
```

构建成功会显示 `Generating static pages... Route (app) ...`。

### 4.5 PM2 启动
```bash
pm2 start npm --name laiwu-web -- start
pm2 save
pm2 startup   # 跑出一行命令，复制粘贴执行（让 PM2 开机自启）
```

验证：`pm2 status` 看到 `laiwu-web online` 即可。
内部测试：`curl http://127.0.0.1:3000/` 应返回 HTML。

---

## 阶段 5：Nginx 反向代理（5 分钟）

### 5.1 写 Nginx 配置
```bash
cat > /etc/nginx/conf.d/laiwu.conf <<'EOF'
server {
    listen 80;
    server_name 你的域名 www.你的域名;   # ← 替换

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 90;
    }

    # Next.js 静态资源缓存
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 30d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
EOF

nginx -t        # 语法检查
systemctl reload nginx
systemctl enable nginx
```

### 5.2 验证 HTTP 能访问
浏览器打开 `http://你的域名/`，应该看到首页（暂时无 HTTPS，下一步加）。

如果 502 Bad Gateway：检查 `pm2 status` 是否 online，`curl http://127.0.0.1:3000/` 是否能通。

---

## 阶段 6：HTTPS（5 分钟）

```bash
certbot --nginx -d 你的域名 -d www.你的域名
# 跟着提示走：
# - 输入邮箱（用于过期提醒）
# - 同意条款
# - 选择是否把 HTTP 自动重定向到 HTTPS → 选 2 (Redirect)
```

完成后：
- 浏览器打开 `https://你的域名/` 显示绿锁
- 续期是自动的（certbot 装了 cron）

---

## 阶段 7：验收

参考 `DEPLOY.md` 第 6 步的 12 项 checklist。

---

## 后续维护

### 更新代码
```bash
cd /var/www/laiwu-web
git pull
npm install --legacy-peer-deps
npm run build
pm2 restart laiwu-web
```

### 查日志
```bash
pm2 logs laiwu-web --lines 100
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 重启
```bash
pm2 restart laiwu-web        # 重启应用
systemctl restart nginx       # 重启网关
```

### 备份数据
数据全在 Supabase，无需备份服务器。

---

## 故障排查

### 502 Bad Gateway
- `pm2 status` 看应用是否 online
- `pm2 logs laiwu-web --lines 50` 看错误
- 检查 `.env.local` 是否正确

### 域名无法访问
- `dig 你的域名` 看 DNS 解析对不对
- `curl -I http://公网IP` 看服务器是否回应（在另一台机器执行）
- 阿里云控制台 → 安全组 → 确认 80/443 已开

### 证书申请失败
- 确认 DNS 已经传播：`dig 你的域名`
- 确认 80 端口开放（certbot 需要走 HTTP-01 验证）
- 重试：`certbot --nginx -d 你的域名 --force-renewal`

### 内存不够（2C4G 应该足够，但极端情况）
```bash
# 加 swap
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```
