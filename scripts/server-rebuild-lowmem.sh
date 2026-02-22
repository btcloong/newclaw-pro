#!/bin/bash
# NewClaw 服务器修复脚本 - 内存优化版
# 在服务器上运行此脚本

set -e

echo "=========================================="
echo "🚀 NewClaw 服务器修复脚本 (内存优化版)"
echo "=========================================="

# 1. 设置内存优化环境变量
export NODE_OPTIONS="--max-old-space-size=1024"
export NEXT_TELEMETRY_DISABLED=1

# 2. 清理并重新克隆
echo "📦 步骤 1: 清理并重新克隆代码..."
cd /home/admin
rm -rf newclaw-pro-backup
mv newclaw-pro newclaw-pro-backup 2>/dev/null || true
git clone https://github.com/btcloong/newclaw-pro.git
cd newclaw-pro

# 3. 安装依赖 (禁用 husky 减少内存使用)
echo "📦 步骤 2: 安装依赖..."
npm install --no-audit --no-fund --prefer-offline

# 4. 创建数据目录
echo "📁 步骤 3: 创建数据目录..."
mkdir -p data

# 5. 构建 (使用 standalone 模式，减少内存使用)
echo "🏗️ 步骤 4: 构建项目..."
npm run build || {
    echo "⚠️ 标准构建失败，尝试内存优化构建..."
    # 清理缓存
    rm -rf .next/cache
    # 使用更激进的内存限制
    NODE_OPTIONS="--max-old-space-size=1536" npm run build
}

# 6. 停止旧的 PM2 进程
echo "🛑 步骤 5: 停止旧进程..."
pm2 delete newclaw-pro 2>/dev/null || true
sleep 2

# 7. 启动新的 PM2 进程
echo "✅ 步骤 6: 启动服务..."
pm2 start ecosystem.config.js || {
    echo "⚠️ 使用 ecosystem 启动失败，尝试直接启动..."
    pm2 start npm --name "newclaw-pro" -- start
}

# 8. 保存 PM2 配置
echo "💾 步骤 7: 保存 PM2 配置..."
pm2 save

echo "=========================================="
echo "✅ 修复完成！"
echo "=========================================="
echo ""
echo "检查状态:"
pm2 status

# 9. 测试
echo ""
echo "🧪 测试服务..."
sleep 5
curl -s http://localhost:3000/api/crawl | head -c 500 || echo "服务可能还在启动中..."

echo ""
echo "🌐 网站地址: http://47.236.188.95"
echo ""
echo "如果内存仍然不足，建议："
echo "1. 升级服务器到 2GB+ 内存"
echo "2. 或者添加 swap 分区"
