#!/bin/bash
#
# 紧急修复脚本 - 在服务器上运行
#

cd /home/admin/newclaw-pro

echo "🧹 Cleaning up..."
# 清理旧的构建和依赖
rm -rf .next
rm -rf node_modules/.cache

echo "📦 Reinstalling dependencies..."
npm ci

echo "🔨 Building..."
npm run build 2>&1 | tee build.log

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    tail -100 build.log
    exit 1
fi

echo "🚀 Starting with PM2..."
# 确保使用正确的启动方式
pm2 start npm --name "newclaw-pro" -- start

sleep 3

echo "📊 Status:"
pm2 status

echo ""
echo "📝 Logs:"
pm2 logs newclaw-pro --lines 20
