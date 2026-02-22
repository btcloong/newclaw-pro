#!/bin/bash
# 清理服务器内存和缓存脚本

echo "=========================================="
echo "🧹 服务器内存清理脚本"
echo "=========================================="

# 显示清理前状态
echo ""
echo "📊 清理前内存状态:"
free -h
echo ""
echo "💾 磁盘使用情况:"
df -h | grep -E "(Filesystem|/dev/)"

# 1. 清理系统缓存
echo ""
echo "🧹 步骤 1: 清理系统缓存..."
sudo sync
echo 1 | sudo tee /proc/sys/vm/drop_caches > /dev/null
echo 2 | sudo tee /proc/sys/vm/drop_caches > /dev/null
echo 3 | sudo tee /proc/sys/vm/drop_caches > /dev/null
echo "✅ 系统缓存已清理"

# 2. 停止 PM2 进程释放内存
echo ""
echo "🛑 步骤 2: 停止 PM2 进程..."
pm2 stop all 2>/dev/null || echo "没有运行中的 PM2 进程"
pm2 delete all 2>/dev/null || echo "没有需要删除的 PM2 进程"

# 3. 清理 npm 缓存
echo ""
echo "🧹 步骤 3: 清理 npm 缓存..."
npm cache clean --force 2>/dev/null || echo "npm 缓存已清理或不存在"

# 4. 清理旧的 node_modules 和构建目录
echo ""
echo "🧹 步骤 4: 清理旧的构建文件..."
cd /home/admin 2>/dev/null || cd ~

# 删除备份目录
rm -rf newclaw-pro-backup-* 2>/dev/null || true
rm -rf newclaw-pro-backup 2>/dev/null || true

# 如果存在项目目录，清理其中的缓存
if [ -d "newclaw-pro" ]; then
    cd newclaw-pro
    rm -rf .next/cache 2>/dev/null || true
    rm -rf node_modules/.cache 2>/dev/null || true
    cd ..
fi

echo "✅ 旧文件已清理"

# 5. 清理系统日志
echo ""
echo "🧹 步骤 5: 清理系统日志..."
sudo journalctl --vacuum-time=1d 2>/dev/null || echo "日志清理完成或无需清理"
sudo find /var/log -type f -name "*.log" -mtime +7 -delete 2>/dev/null || true
echo "✅ 日志已清理"

# 6. 清理临时文件
echo ""
echo "🧹 步骤 6: 清理临时文件..."
sudo rm -rf /tmp/* 2>/dev/null || true
sudo rm -rf /var/tmp/* 2>/dev/null || true
rm -rf ~/.npm/_cacache 2>/dev/null || true
rm -rf ~/.cache 2>/dev/null || true
echo "✅ 临时文件已清理"

# 7. 清理 Docker (如果安装了)
echo ""
echo "🧹 步骤 7: 清理 Docker (如果存在)..."
if command -v docker &> /dev/null; then
    docker system prune -f 2>/dev/null || echo "Docker 清理完成或无需清理"
else
    echo "Docker 未安装，跳过"
fi

# 显示清理后状态
echo ""
echo "=========================================="
echo "📊 清理后内存状态:"
free -h
echo ""
echo "💾 磁盘使用情况:"
df -h | grep -E "(Filesystem|/dev/)"

echo ""
echo "=========================================="
echo "✅ 内存清理完成！"
echo "=========================================="
echo ""
echo "建议接下来:"
echo "1. 运行 ./scripts/server-rebuild-lowmem.sh 重新部署"
echo "2. 或者添加 swap 分区:"
echo "   sudo fallocate -l 2G /swapfile"
echo "   sudo chmod 600 /swapfile"
echo "   sudo mkswap /swapfile"
echo "   sudo swapon /swapfile"
