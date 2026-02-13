#!/bin/bash
# NewClaw Pro AI资讯平台 - 阿里云服务器部署脚本
# 适用于: Ubuntu 22.04 LTS, 2核2G配置

set -e

echo "=========================================="
echo "  NewClaw Pro 部署脚本"
echo "=========================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置变量
APP_NAME="newclaw-pro"
APP_DIR="/var/www/newclaw-pro"
DOMAIN="${DOMAIN:-your-domain.com}"
EMAIL="${EMAIL:-your-email@example.com}"
NODE_VERSION="20"

# 检查 root 权限
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}请使用 sudo 运行此脚本${NC}"
    exit 1
fi

echo -e "${YELLOW}步骤 1/10: 更新系统包...${NC}"
apt-get update && apt-get upgrade -y

echo -e "${YELLOW}步骤 2/10: 安装基础依赖...${NC}"
apt-get install -y \
    curl \
    wget \
    git \
    nginx \
    certbot \
    python3-certbot-nginx \
    sqlite3 \
    build-essential \
    python3-pip \
    ufw \
    htop \
    fail2ban

echo -e "${YELLOW}步骤 3/10: 安装 Node.js ${NODE_VERSION}...${NC}"
if ! command -v node &> /dev/null || [ "$(node -v | cut -d'v' -f2 | cut -d'.' -f1)" != "$NODE_VERSION" ]; then
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
    apt-get install -y nodejs
fi
node -v
npm -v

echo -e "${YELLOW}步骤 4/10: 安装 PM2...${NC}"
npm install -g pm2
pm2 --version

echo -e "${YELLOW}步骤 5/10: 配置防火墙...${NC}"
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable

echo -e "${YELLOW}步骤 6/10: 创建应用目录...${NC}"
mkdir -p $APP_DIR
mkdir -p $APP_DIR/data
mkdir -p $APP_DIR/logs
mkdir -p /var/log/newclaw

# 设置目录权限
chown -R www-data:www-data $APP_DIR
chmod -R 755 $APP_DIR

echo -e "${YELLOW}步骤 7/10: 配置 Nginx...${NC}"
cat > /etc/nginx/sites-available/newclaw-pro << 'EOF'
upstream newclaw_backend {
    server 127.0.0.1:3000;
    keepalive 64;
}

# 限制请求速率
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=general:10m rate=30r/s;

server {
    listen 80;
    server_name _;  # 接受所有域名，或改为你的域名
    
    # 日志配置
    access_log /var/log/nginx/newclaw-access.log;
    error_log /var/log/nginx/newclaw-error.log;
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;
    
    # 静态文件缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        try_files $uri @backend;
    }
    
    # 安全响应头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # API 限流
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://newclaw_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }
    
    # 主应用代理
    location / {
        limit_req zone=general burst=50 nodelay;
        proxy_pass http://newclaw_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }
    
    # 后端备用
    location @backend {
        proxy_pass http://newclaw_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

# 启用站点
rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/newclaw-pro /etc/nginx/sites-enabled/newclaw-pro

# 测试 Nginx 配置
nginx -t

# 重启 Nginx
systemctl restart nginx
systemctl enable nginx

echo -e "${YELLOW}步骤 8/10: 配置 PM2...${NC}"
cat > $APP_DIR/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'newclaw-pro',
    script: './node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/var/www/newclaw-pro',
    instances: 1,  // 2核2G配置，使用单实例
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      DATABASE_URL: 'file:/var/www/newclaw-pro/data/newclaw.db'
    },
    // 日志配置
    log_file: '/var/log/newclaw/combined.log',
    out_file: '/var/log/newclaw/out.log',
    error_file: '/var/log/newclaw/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    // 内存限制和自动重启
    max_memory_restart: '1G',
    min_uptime: '10s',
    max_restarts: 5,
    // 监控
    monitoring: false,
    // 优雅重启
    kill_timeout: 5000,
    listen_timeout: 10000,
    // 自动重启策略
    autorestart: true,
    restart_delay: 3000,
  }]
};
EOF

echo -e "${YELLOW}步骤 9/10: 配置定时任务...${NC}"
# 创建数据更新脚本
cat > $APP_DIR/update-data.sh << 'EOF'
#!/bin/bash
# 数据更新脚本
cd /var/www/newclaw-pro
export NODE_ENV=production
export DATABASE_URL=file:/var/www/newclaw-pro/data/newclaw.db

# 记录日志
echo "[$(date)] Starting data update..." >> /var/log/newclaw/crawl.log

# 运行爬虫
npm run crawl >> /var/log/newclaw/crawl.log 2>&1

# 记录完成
echo "[$(date)] Data update completed" >> /var/log/newclaw/crawl.log
EOF

chmod +x $APP_DIR/update-data.sh

# 添加定时任务
(crontab -l 2>/dev/null || echo "") | grep -v "newclaw" | (cat; echo "
# NewClaw Pro 数据更新 - 每30分钟
*/30 * * * * /var/www/newclaw-pro/update-data.sh

# NewClaw Pro 日志清理 - 每周日
0 0 * * 0 find /var/log/newclaw -name '*.log' -type f -mtime +7 -delete
") | crontab -

echo -e "${YELLOW}步骤 10/10: 配置 Fail2Ban...${NC}"
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
action = iptables-multiport[name=ReqLimit, port="http,https", protocol=tcp]
logpath = /var/log/nginx/newclaw-error.log
findtime = 600
bantime = 7200
maxretry = 10
EOF

systemctl restart fail2ban
systemctl enable fail2ban

echo ""
echo -e "${GREEN}==========================================${NC}"
echo -e "${GREEN}  基础环境配置完成!${NC}"
echo -e "${GREEN}==========================================${NC}"
echo ""
echo "接下来需要:"
echo "1. 将项目代码上传到 $APP_DIR"
echo "2. 运行: cd $APP_DIR && npm install"
echo "3. 运行: npm run build"
echo "4. 运行: pm2 start ecosystem.config.js"
echo "5. 配置 SSL: certbot --nginx -d your-domain.com"
echo ""
echo "数据更新已配置为每30分钟自动运行"
echo ""
