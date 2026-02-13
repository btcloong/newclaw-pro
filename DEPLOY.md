# NewClaw Pro - AI 资讯平台专业版

专业的 AI 新闻聚合、投研分析与创意孵化平台。追踪全球 AI 热点，发现下一个独角兽项目。

## 功能特性

### 首页
- 热点新闻轮播与推荐
- 实时统计数据展示
- 快讯滚动播报
- 热搜榜单
- 新项目发现

### 热点页
- 24小时/7天/30天热门内容
- 实时热度监控
- 趋势分析图表

### 投研页
- 融资动态追踪
- 赛道趋势分析
- 深度研究报告

### 孵化页
- 创意灵感库
- AI 工具推荐
- 项目案例展示

### 详情页
- 新闻详情阅读
- 项目详情展示
- 相关推荐

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS + shadcn/ui
- **数据库**: SQLite (服务器本地文件)
- **爬虫**: Node.js + RSS Parser
- **部署**: PM2 + Nginx

## 数据源

- **GitHub Trending API**: 热门 AI 项目
- **Product Hunt API**: 新产品发现
- **RSS 订阅**: 
  - TechCrunch AI
  - The Verge AI
  - MIT News AI
  - arXiv AI Papers
- **定时更新**: 每30分钟自动抓取

## 阿里云服务器部署指南

### 服务器要求

- **系统**: Ubuntu 22.04 LTS
- **配置**: 2核2G 或以上
- **磁盘**: 20GB SSD 或以上
- **带宽**: 3Mbps 或以上

### 快速部署

#### 1. 购买阿里云服务器

1. 登录阿里云控制台
2. 选择 ECS 实例，推荐配置：
   - 实例规格: 2 vCPU 2 GiB (ecs.t6-c1m1.large)
   - 镜像: Ubuntu 22.04 LTS 64位
   - 系统盘: 20GB SSD
   - 带宽: 3Mbps
3. 配置安全组，开放端口：
   - 22 (SSH)
   - 80 (HTTP)
   - 443 (HTTPS)

#### 2. 连接服务器

```bash
ssh root@your-server-ip
```

#### 3. 下载部署脚本

```bash
# 克隆项目
git clone https://github.com/your-username/newclaw-pro.git /tmp/newclaw-pro
cd /tmp/newclaw-pro

# 或者下载压缩包
wget https://github.com/your-username/newclaw-pro/archive/main.zip
unzip main.zip
cd newclaw-pro-main
```

#### 4. 运行服务器环境配置

```bash
chmod +x deploy/*.sh
sudo ./deploy/setup-server.sh
```

此脚本会自动安装：
- Node.js 20
- Nginx
- PM2
- SQLite3
- Certbot (SSL)
- 防火墙配置
- 定时任务

#### 5. 上传项目代码

**方式一: 使用 SCP**
```bash
# 在本地执行
scp -r ./* root@your-server-ip:/var/www/newclaw-pro/
```

**方式二: 使用 Git**
```bash
# 在服务器上
cd /var/www/newclaw-pro
git clone https://github.com/your-username/newclaw-pro.git .
```

**方式三: 使用 rsync**
```bash
rsync -avz --exclude 'node_modules' --exclude '.git' ./ root@your-server-ip:/var/www/newclaw-pro/
```

#### 6. 部署应用

```bash
sudo ./deploy/deploy-app.sh
```

#### 7. 配置域名和 SSL (可选但推荐)

```bash
# 先确保域名解析到服务器IP
sudo ./deploy/setup-ssl.sh your-domain.com your-email@example.com
```

### 手动部署步骤

如果自动脚本无法满足需求，可以手动部署：

#### 安装 Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 安装 PM2

```bash
sudo npm install -g pm2
```

#### 安装 Nginx

```bash
sudo apt-get update
sudo apt-get install -y nginx
```

#### 配置 Nginx

创建 `/etc/nginx/sites-available/newclaw-pro`:

```nginx
upstream newclaw_backend {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://newclaw_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置：
```bash
sudo ln -s /etc/nginx/sites-available/newclaw-pro /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 构建和启动应用

```bash
cd /var/www/newclaw-pro
npm install
npm run build

# 使用 PM2 启动
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 配置 SSL 证书

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 配置 GitHub Token (可选)

为了抓取 GitHub Trending 数据，建议配置 GitHub Token：

1. 访问 https://github.com/settings/tokens
2. 生成新的 Personal Access Token (不需要特殊权限)
3. 在服务器上设置环境变量：

```bash
echo 'export GITHUB_TOKEN=your_token_here' | sudo tee /etc/profile.d/github.sh
source /etc/profile.d/github.sh
```

4. 更新 PM2 配置以使用环境变量

## 项目结构

```
newclaw-pro/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx         # 首页
│   │   ├── hot/             # 热点页
│   │   ├── research/        # 投研页
│   │   ├── incubator/       # 孵化页
│   │   └── layout.tsx       # 根布局
│   ├── components/          # React 组件
│   │   ├── ui/              # shadcn/ui 组件
│   │   ├── layout/          # 布局组件
│   │   └── *.tsx            # 业务组件
│   └── lib/
│       ├── db.ts            # 数据库配置
│       ├── schema.ts        # 数据库表结构
│       └── crawler.ts       # 爬虫逻辑
├── scripts/
│   └── crawler.ts           # 爬虫脚本入口
├── deploy/
│   ├── setup-server.sh      # 服务器环境配置
│   ├── deploy-app.sh        # 应用部署脚本
│   └── setup-ssl.sh         # SSL 配置脚本
├── data/                    # SQLite 数据库目录
├── public/                  # 静态资源
├── next.config.mjs          # Next.js 配置
├── tailwind.config.ts       # Tailwind 配置
├── package.json
└── README.md
```

## 常用命令

```bash
# 开发模式
npm run dev

# 构建
npm run build

# 启动生产服务器
npm start

# 运行爬虫
npm run crawl

# 查看 PM2 状态
pm2 status
pm2 logs

# 重启应用
pm2 restart newclaw-pro

# 平滑重启
pm2 reload newclaw-pro

# 手动触发数据更新
npm run crawl
npm run crawl:news
npm run crawl:github
npm run crawl:producthunt
```

## 定时任务

数据更新已配置为每30分钟自动运行：

```bash
# 查看定时任务
crontab -l

# 手动运行数据更新
/var/www/newclaw-pro/update-data.sh
```

## 性能优化

针对 2核2G 服务器的优化配置：

1. **PM2 单实例模式**: 避免内存不足
2. **Nginx 静态缓存**: 30天缓存期
3. **Gzip 压缩**: 减少传输大小
4. **请求限流**: 防止过载
5. **数据库**: 本地 SQLite，无网络开销

## 监控和维护

### 查看日志

```bash
# 应用日志
pm2 logs

# Nginx 访问日志
sudo tail -f /var/log/nginx/newclaw-access.log

# 爬虫日志
sudo tail -f /var/log/newclaw/crawl.log
```

### 备份数据

```bash
# 备份数据库
sudo cp /var/www/newclaw-pro/data/newclaw.db /backup/newclaw-$(date +%Y%m%d).db

# 自动备份脚本
echo '0 2 * * * root cp /var/www/newclaw-pro/data/newclaw.db /backup/newclaw-$(date +\%Y\%m\%d).db' | sudo tee /etc/cron.d/newclaw-backup
```

### 更新应用

```bash
cd /var/www/newclaw-pro
git pull
npm install
npm run build
pm2 reload newclaw-pro
```

## 故障排查

### 应用无法启动

```bash
# 检查日志
pm2 logs

# 检查端口占用
sudo netstat -tlnp | grep 3000

# 手动测试
npm start
```

### Nginx 502 错误

```bash
# 检查应用是否运行
pm2 status

# 检查 Nginx 配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

### 数据库权限问题

```bash
# 修复权限
sudo chown -R www-data:www-data /var/www/newclaw-pro/data
sudo chmod 755 /var/www/newclaw-pro/data
```

## 安全建议

1. **修改默认端口**: 将 SSH 端口改为非 22 端口
2. **禁用 root 登录**: 创建普通用户并禁用 root SSH 登录
3. **配置防火墙**: 仅开放必要端口
4. **定期更新**: 保持系统和依赖更新
5. **使用密钥登录**: 禁用密码登录，使用 SSH 密钥

## 许可证

MIT License

## 联系方式

如有问题或建议，欢迎提交 Issue 或 Pull Request。
