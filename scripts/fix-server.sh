#!/bin/bash
#
# 完整的服务器修复脚本
# 保存为 fix-server.sh 在服务器上运行
#

set -e

echo "=========================================="
echo "🔧 NewClaw Server Fix Script"
echo "=========================================="
echo ""

# 1. 检查系统资源
echo "📊 Step 1: Checking system resources..."
echo "--- Disk Space ---"
df -h
echo ""
echo "--- Memory ---"
free -h
echo ""
echo "--- Load Average ---"
uptime
echo ""

# 2. 检查 Node.js 和 NPM
echo "📦 Step 2: Checking Node.js..."
node --version || echo "❌ Node.js not found"
npm --version || echo "❌ NPM not found"
echo ""

# 3. 进入项目目录
echo "📁 Step 3: Entering project directory..."
cd /home/admin/newclaw-pro || {
    echo "❌ Failed to enter /home/admin/newclaw-pro"
    echo "Checking if directory exists..."
    ls -la /home/admin/
    exit 1
}
echo "✅ In project directory: $(pwd)"
echo ""

# 4. 检查 PM2
echo "🔄 Step 4: Checking PM2..."
if command -v pm2 &> /dev/null; then
    echo "✅ PM2 found"
    pm2 --version
    echo ""
    echo "Current PM2 processes:"
    pm2 status
else
    echo "❌ PM2 not found, installing..."
    npm install -g pm2
fi
echo ""

# 5. 拉取最新代码
echo "📥 Step 5: Pulling latest code..."
git pull origin main || echo "⚠️ Git pull failed, continuing..."
echo ""

# 6. 安装依赖
echo "📦 Step 6: Installing dependencies..."
npm ci || npm install
echo ""

# 7. 构建项目
echo "🔨 Step 7: Building project..."
npm run build || {
    echo "❌ Build failed!"
    echo "Checking for TypeScript errors..."
    npx tsc --noEmit 2>&1 | head -50
    exit 1
}
echo ""

# 8. 停止旧的 PM2 进程
echo "🛑 Step 8: Stopping old PM2 process..."
pm2 stop newclaw-pro 2>/dev/null || true
pm2 delete newclaw-pro 2>/dev/null || true
sleep 2
echo ""

# 9. 启动新的 PM2 进程
echo "🚀 Step 9: Starting PM2..."
pm2 start ecosystem.config.js || {
    echo "❌ PM2 start failed, trying alternative..."
    pm2 start npm --name "newclaw-pro" -- start
}
echo ""

# 10. 保存 PM2 配置
echo "💾 Step 10: Saving PM2 config..."
pm2 save
echo ""

# 11. 检查端口
echo "🌐 Step 11: Checking port 3000..."
sleep 3
if netstat -tlnp 2>/dev/null | grep -q ":3000"; then
    echo "✅ Port 3000 is listening"
    netstat -tlnp | grep ":3000"
elif ss -tlnp 2>/dev/null | grep -q ":3000"; then
    echo "✅ Port 3000 is listening"
    ss -tlnp | grep ":3000"
else
    echo "⚠️ Port 3000 not listening yet, waiting..."
    sleep 5
    if netstat -tlnp 2>/dev/null | grep -q ":3000"; then
        echo "✅ Port 3000 is now listening"
    else
        echo "❌ Port 3000 still not listening"
    fi
fi
echo ""

# 12. 测试本地访问
echo "🧪 Step 12: Testing local access..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "Local curl failed"
echo ""

# 13. 检查 Nginx
echo "🌐 Step 13: Checking Nginx..."
if command -v nginx &> /dev/null; then
    echo "✅ Nginx found"
    sudo systemctl status nginx --no-pager || true
    echo ""
    echo "Testing Nginx config..."
    sudo nginx -t || true
else
    echo "ℹ️ Nginx not installed (may not be needed if using direct port)"
fi
echo ""

# 14. 检查防火墙
echo "🔥 Step 14: Checking firewall..."
if command -v ufw &> /dev/null; then
    echo "UFW status:"
    sudo ufw status || true
elif command -v firewall-cmd &> /dev/null; then
    echo "Firewalld status:"
    sudo firewall-cmd --state || true
    sudo firewall-cmd --list-all || true
else
    echo "ℹ️ No firewall detected"
fi
echo ""

# 15. 最终状态
echo "=========================================="
echo "📋 Final Status"
echo "=========================================="
pm2 status
echo ""
echo "📝 Recent logs:"
pm2 logs newclaw-pro --lines 20

echo ""
echo "=========================================="
echo "✅ Fix script completed!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Check if website is accessible: curl -I http://localhost:3000"
echo "2. Check external access: https://newclaw.com"
echo "3. If still not working, check: pm2 logs newclaw-pro"
