#!/bin/bash
#
# 手动部署脚本 - 在阿里云服务器上运行
# 用法: ./deploy.sh
#

set -e

echo "🚀 Starting deployment..."

# 进入项目目录
cd /home/admin/newclaw-pro

echo "📥 Pulling latest code..."
git fetch origin main
git reset --hard origin/main

echo "📦 Installing dependencies..."
rm -rf node_modules/.cache
npm ci

echo "🔨 Building project..."
npm run build

echo "🔄 Reloading PM2..."
pm2 reload newclaw-pro || pm2 start ecosystem.config.js

echo "✅ Deployment completed!"
echo ""
echo "📊 Checking status..."
pm2 status

echo ""
echo "📝 Recent logs:"
pm2 logs newclaw-pro --lines 20
