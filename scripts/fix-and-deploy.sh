#!/bin/bash
# 修复并部署 NewClaw
# 在服务器上运行: ./fix-and-deploy.sh

set -e

echo "🚀 开始修复部署..."

cd /home/admin/newclaw-pro

echo "📥 拉取最新代码..."
git fetch origin
git reset --hard origin/main

echo "🧹 清理并重新安装依赖..."
rm -rf node_modules package-lock.json .next
npm install

echo "🏗️ 构建..."
npm run build

echo "🔄 重启服务..."
pm2 reload newclaw-pro || pm2 start ecosystem.config.js

echo "✅ 部署完成!"
