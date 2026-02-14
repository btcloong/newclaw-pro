#!/bin/bash

# NewClaw Pro 一键部署脚本
# 使用方法: ssh root@47.236.188.95 'bash -s' < deploy.sh

echo "🚀 开始部署 NewClaw..."

cd /home/admin

# 清理旧项目
echo "📁 清理旧项目..."
rm -rf newclaw-pro

# 克隆新项目
echo "📥 克隆代码..."
git clone https://github.com/btcloong/newclaw-pro.git

cd newclaw-pro

# 安装依赖
echo "📦 安装依赖..."
npm install

# 构建项目
echo "🔨 构建项目..."
npm run build

# 停止旧应用
echo "🛑 停止旧应用..."
pm2 delete newclaw-pro 2>/dev/null || true

# 启动新应用
echo "▶️ 启动应用..."
pm2 start "npm start" --name newclaw-pro

# 保存配置
echo "💾 保存配置..."
pm2 save

echo ""
echo "✅ 部署完成!"
echo ""
echo "📊 应用状态:"
pm2 status

echo ""
echo "🌐 访问地址: http://47.236.188.95"
