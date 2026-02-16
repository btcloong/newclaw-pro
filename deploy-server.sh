#!/bin/bash
# 部署脚本 - 在服务器上执行

set -e

echo "🚀 开始部署 NewClaw..."

# 进入项目目录
cd /home/admin/newclaw-pro

# 拉取最新代码
echo "📥 拉取最新代码..."
git pull origin main

# 安装依赖
echo "📦 安装依赖..."
npm install

# 构建
echo "🔨 构建项目..."
npm run build

# 重启 PM2
echo "🔄 重启服务..."
pm2 restart newclaw-pro || pm2 start npm --name "newclaw-pro" -- start

# 保存 PM2 配置
pm2 save

echo "✅ 部署完成！"
echo "🌐 网站: https://newclaw.com"
