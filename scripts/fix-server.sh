#!/bin/bash
# 服务器修复脚本 - 复制到服务器执行

echo "🔧 Starting server fix..."

cd /home/admin/newclaw-pro

echo "🛑 Stopping service..."
pm2 stop newclaw-pro 2>/dev/null || true

echo "🗑️ Force removing node_modules..."
sudo rm -rf node_modules package-lock.json

echo "📥 Resetting to latest code..."
git fetch origin main
git reset --hard origin/main

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building..."
npm run build

echo "🚀 Starting service..."
pm2 start ecosystem.config.js || pm2 reload newclaw-pro

echo "✅ Done!"
echo ""
pm2 status
echo ""
curl -s http://localhost:3000/api/news | head -c 200
