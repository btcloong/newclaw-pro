#!/bin/bash
# 保存为 fix.sh 在服务器上运行

cd /home/admin/newclaw-pro 2>/dev/null || cd ~

echo "=== NewClaw Quick Fix ==="

# 检查是否在正确目录
if [ ! -f "package.json" ]; then
    echo "❌ Not in project directory"
    ls -la
    exit 1
fi

# 清理
echo "1. Cleaning..."
rm -rf .next node_modules/.cache

# 构建
echo "2. Building..."
npm run build 2>&1 | tail -10

# 启动
echo "3. Starting..."
pm2 delete newclaw-pro 2>/dev/null
pm2 start npm --name "newclaw-pro" -- start

echo "4. Done! Checking..."
sleep 3
pm2 status
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:3000
