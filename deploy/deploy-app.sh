#!/bin/bash
# NewClaw Pro 应用部署脚本
# 在服务器上运行此脚本部署应用

set -e

APP_DIR="/var/www/newclaw-pro"
LOG_DIR="/var/log/newclaw"

echo "=========================================="
echo "  NewClaw Pro 应用部署"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 检查目录
if [ ! -d "$APP_DIR" ]; then
    echo -e "${RED}错误: 应用目录不存在 $APP_DIR${NC}"
    echo "请先运行 setup-server.sh 配置服务器环境"
    exit 1
fi

cd $APP_DIR

echo -e "${YELLOW}步骤 1/6: 安装依赖...${NC}"
npm ci --production

echo -e "${YELLOW}步骤 2/6: 初始化数据库...${NC}"
mkdir -p data
# 数据库会自动创建

echo -e "${YELLOW}步骤 3/6: 构建应用...${NC}"
npm run build

echo -e "${YELLOW}步骤 4/6: 首次数据抓取...${NC}"
npm run crawl 2>&1 | tee $LOG_DIR/first-crawl.log || echo "首次抓取完成（可能有部分源失败）"

echo -e "${YELLOW}步骤 5/6: 启动/重启应用...${NC}"
# 如果 PM2 中已有应用，先删除
pm2 delete newclaw-pro 2>/dev/null || true

# 启动应用
pm2 start ecosystem.config.js

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup systemd -u www-data --hp /var/www 2>/dev/null || true

echo -e "${YELLOW}步骤 6/6: 检查应用状态...${NC}"
sleep 3
pm2 status

echo ""
echo -e "${GREEN}==========================================${NC}"
echo -e "${GREEN}  部署完成!${NC}"
echo -e "${GREEN}==========================================${NC}"
echo ""
echo "应用状态:"
pm2 show newclaw-pro | grep -E "status|memory|uptime" || true
echo ""
echo "访问地址:"
echo "  - HTTP:  http://$(curl -s ifconfig.me 2>/dev/null || echo 'your-server-ip')"
echo ""
echo "常用命令:"
echo "  pm2 status          - 查看应用状态"
echo "  pm2 logs            - 查看日志"
echo "  pm2 restart all     - 重启应用"
echo "  pm2 reload all      - 平滑重启"
echo "  npm run crawl       - 手动触发数据更新"
echo ""
