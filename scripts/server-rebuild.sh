#!/bin/bash
# NewClaw 服务器完整修复脚本
# 在服务器上运行此脚本

set -e

echo "=========================================="
echo "🚀 NewClaw 服务器修复脚本"
echo "=========================================="

# 1. 清理并重新克隆
echo "📦 步骤 1: 清理并重新克隆代码..."
cd /home/admin
rm -rf newclaw-pro-backup
mv newclaw-pro newclaw-pro-backup 2>/dev/null || true
git clone https://github.com/btcloong/newclaw-pro.git
cd newclaw-pro

# 2. 安装依赖
echo "📦 步骤 2: 安装依赖..."
npm install

# 3. 创建数据目录
echo "📁 步骤 3: 创建数据目录..."
mkdir -p data

# 4. 构建
echo "🏗️ 步骤 4: 构建项目..."
npm run build

# 5. 停止旧的 PM2 进程
echo "🛑 步骤 5: 停止旧进程..."
pm2 delete newclaw-pro 2>/dev/null || true

# 6. 启动新的 PM2 进程
echo "✅ 步骤 6: 启动服务..."
pm2 start ecosystem.config.js

# 7. 保存 PM2 配置
echo "💾 步骤 7: 保存 PM2 配置..."
pm2 save

echo "=========================================="
echo "✅ 修复完成！"
echo "=========================================="
echo ""
echo "检查状态:"
pm2 status

# 8. 测试
echo ""
echo "🧪 测试服务..."
sleep 3
curl -s http://localhost:3000/api/crawl | head -c 500

echo ""
echo "🌐 网站地址: http://47.236.188.95"
