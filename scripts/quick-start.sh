#!/bin/bash
#
# 快速启动脚本 - 假设依赖已安装
#

cd /home/admin/newclaw-pro

echo "🚀 Quick start (skipping npm ci)..."

# 直接构建（如果 node_modules 存在）
if [ -d "node_modules" ]; then
    echo "✅ node_modules exists, building..."
    npm run build 2>&1 | tail -20
else
    echo "❌ node_modules missing, running npm ci..."
    npm ci
    npm run build
fi

echo ""
echo "🔄 Starting with PM2..."

# 停止旧进程
pm2 stop newclaw-pro 2>/dev/null || true
pm2 delete newclaw-pro 2>/dev/null || true

# 启动新进程
pm2 start npm --name "newclaw-pro" -- start

sleep 2

echo ""
echo "📊 PM2 Status:"
pm2 status

echo ""
echo "🧪 Testing..."
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3000 || echo "❌ Not responding yet"
