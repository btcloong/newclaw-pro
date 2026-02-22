#!/bin/bash
# 完整修复脚本 - 在服务器上运行

cd /home/admin/newclaw-pro

echo "=== NewClaw Full Fix ==="

# 1. 安装依赖
echo "1. Installing dependencies..."
npm ci 2>&1 | tail -5

# 2. 构建
echo "2. Building..."
npm run build 2>&1 | tail -10

# 3. 清理 PM2
echo "3. Cleaning PM2..."
pm2 delete all 2>/dev/null

# 4. 启动
echo "4. Starting..."
pm2 start npm --name "newclaw-pro" -- start

echo "5. Waiting..."
sleep 5

echo "6. Status:"
pm2 status

echo "7. Testing:"
curl -s -o /dev/null -w "HTTP: %{http_code}\n" http://localhost:3000
