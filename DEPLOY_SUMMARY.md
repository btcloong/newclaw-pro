# NewClaw Pro 部署完成总结

## 项目概述

NewClaw Pro AI资讯平台专业版已完成开发，包含以下完整功能：

### 功能模块

1. **首页** - 热点新闻、统计数据、快讯、热搜榜单、项目发现
2. **热点页** - 24h/7天/30天热门，实时热度监控
3. **投研页** - 融资动态、赛道趋势、研究报告
4. **孵化页** - 创意库、工具推荐、案例展示
5. **详情页** - 新闻详情、项目详情、研究报告详情

### 技术栈

- Next.js 14 App Router
- TypeScript
- Tailwind CSS + shadcn/ui
- 内存存储（可扩展至 SQLite/PostgreSQL）
- PM2 + Nginx

## 部署文件说明

### 1. 服务器环境配置脚本
**文件**: `deploy/setup-server.sh`

自动安装和配置：
- Node.js 20
- Nginx
- PM2
- SQLite3
- Certbot (SSL)
- 防火墙 (UFW)
- Fail2Ban (安全防护)
- 定时任务

### 2. 应用部署脚本
**文件**: `deploy/deploy-app.sh`

执行：
- 安装依赖
- 初始化数据库
- 构建应用
- 首次数据抓取
- 启动/重启应用

### 3. SSL 配置脚本
**文件**: `deploy/setup-ssl.sh`

自动配置：
- Let's Encrypt SSL 证书
- Nginx HTTPS 配置
- 自动续期

### 4. PM2 配置文件
**文件**: `ecosystem.config.js`

配置：
- 单实例模式（适配 2核2G）
- 内存限制 1G
- 自动重启策略
- 日志配置

## 阿里云服务器部署步骤

### 第一步：购买服务器

1. 登录阿里云控制台
2. 创建 ECS 实例：
   - 实例规格: 2 vCPU 2 GiB
   - 镜像: Ubuntu 22.04 LTS
   - 系统盘: 20GB SSD
   - 带宽: 3Mbps
3. 配置安全组规则：
   - 入方向: 22 (SSH), 80 (HTTP), 443 (HTTPS)

### 第二步：连接服务器并配置环境

```bash
ssh root@your-server-ip

# 上传部署脚本到服务器
# 或者直接在服务器上下载

# 执行环境配置
chmod +x /var/www/newclaw-pro/deploy/setup-server.sh
/var/www/newclaw-pro/deploy/setup-server.sh
```

### 第三步：上传项目代码

```bash
# 在本地项目目录执行
rsync -avz --exclude 'node_modules' --exclude '.git' \
  ./ root@your-server-ip:/var/www/newclaw-pro/
```

### 第四步：部署应用

```bash
ssh root@your-server-ip
cd /var/www/newclaw-pro
chmod +x deploy/*.sh
./deploy/deploy-app.sh
```

### 第五步：配置域名和 SSL

```bash
# 确保域名已解析到服务器IP
./deploy/setup-ssl.sh your-domain.com your-email@example.com
```

## 访问地址

部署完成后，可通过以下地址访问：

- **HTTP**: http://your-server-ip
- **HTTPS**: https://your-domain.com (配置 SSL 后)

## 常用管理命令

```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs

# 重启应用
pm2 restart newclaw-pro

# 平滑重启
pm2 reload newclaw-pro

# 手动触发数据更新
npm run crawl

# 查看 Nginx 状态
systemctl status nginx

# 重启 Nginx
systemctl restart nginx
```

## 定时任务

已配置的定时任务：

1. **数据更新**: 每30分钟自动运行爬虫
2. **日志清理**: 每周日清理7天前的日志
3. **SSL 续期**: 每天检查并自动续期证书

查看定时任务：
```bash
crontab -l
```

## 监控和维护

### 日志位置

- 应用日志: `/var/log/newclaw/`
- Nginx 访问日志: `/var/log/nginx/newclaw-access.log`
- Nginx 错误日志: `/var/log/nginx/newclaw-error.log`

### 性能监控

```bash
# 查看 PM2 监控
pm2 monit

# 查看系统资源
htop
```

## 故障排查

### 应用无法访问

1. 检查应用状态: `pm2 status`
2. 检查端口监听: `netstat -tlnp | grep 3000`
3. 检查 Nginx 配置: `nginx -t`
4. 查看错误日志: `pm2 logs` 或 `tail -f /var/log/nginx/newclaw-error.log`

### 数据未更新

1. 检查定时任务: `crontab -l`
2. 手动运行爬虫: `npm run crawl`
3. 检查爬虫日志: `tail -f /var/log/newclaw/crawl.log`

## 安全建议

1. **修改 SSH 端口**: 将默认 22 端口改为其他端口
2. **禁用 root 登录**: 创建普通用户并禁用 root SSH 登录
3. **配置防火墙**: 仅开放必要端口
4. **定期更新**: `apt-get update && apt-get upgrade`
5. **使用 SSH 密钥**: 禁用密码登录

## 扩展功能

### 添加真实数据源

编辑 `src/lib/crawler.ts`，配置真实 API：

1. **GitHub API**: 设置 `GITHUB_TOKEN` 环境变量
2. **Product Hunt API**: 申请 API 访问权限
3. **RSS 源**: 配置 RSS 订阅源

### 切换到数据库存储

如需使用 SQLite 或 PostgreSQL：

1. 安装数据库依赖
2. 更新 `src/lib/db.ts` 使用真实数据库
3. 配置数据库连接字符串

## 项目文件清单

```
newclaw-pro/
├── src/
│   ├── app/              # Next.js 页面
│   ├── components/       # React 组件
│   └── lib/              # 工具函数和数据
├── scripts/              # 爬虫脚本
├── deploy/               # 部署脚本
├── .github/workflows/    # GitHub Actions
├── public/               # 静态资源
├── ecosystem.config.js   # PM2 配置
├── next.config.mjs       # Next.js 配置
└── README.md             # 项目文档
```

## 完成状态

✅ 首页 - 完整功能
✅ 热点页 - 完整功能
✅ 投研页 - 完整功能
✅ 孵化页 - 完整功能
✅ 新闻详情页 - 完整功能
✅ 项目详情页 - 完整功能
✅ 研究报告详情页 - 完整功能
✅ 部署脚本 - 完整配置
✅ 服务器配置 - 自动化脚本
✅ SSL 配置 - 自动化脚本

## 后续优化建议

1. 添加用户认证系统
2. 实现真实数据抓取
3. 添加搜索功能
4. 实现邮件订阅
5. 添加管理后台
6. 优化移动端体验
7. 添加 PWA 支持

---

**部署日期**: 2026-02-13
**版本**: v1.0.0
