#!/bin/bash
#
# 服务器健康检查和重启脚本
# 在阿里云服务器上运行
#

echo "🔍 Checking server health..."

# 检查磁盘空间
echo "💾 Disk space:"
df -h

# 检查内存
echo "🧠 Memory:"
free -h

# 检查 PM2 状态
echo "🔄 PM2 status:"
pm2 status

# 检查端口占用
echo "🌐 Port 3000:"
netstat -tlnp | grep 3000 || echo "Port 3000 not in use"

# 检查日志
echo "📋 Recent errors:"
tail -50 /var/log/newclaw/error.log 2>/dev/null || echo "No error log found"

# 尝试重启
echo ""
echo "🚀 Restarting application..."
cd /home/admin/newclaw-pro

# 先停止
echo "Stopping PM2..."
pm2 stop newclaw-pro 2>/dev/null || true

# 等待
sleep 2

# 重新启动
echo "Starting PM2..."
pm2 start ecosystem.config.js || pm2 reload newclaw-pro

# 检查状态
echo ""
echo "✅ Final status:"
pm2 status

echo ""
echo "📝 Recent logs:"
pm2 logs newclaw-pro --lines 20
