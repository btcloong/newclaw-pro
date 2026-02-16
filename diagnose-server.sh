#!/bin/bash
# 服务器诊断脚本
# 在服务器上以 admin 用户执行

echo "=========================================="
echo "  NewClaw 服务器诊断"
echo "=========================================="
echo ""

# 1. 检查 PM2 状态
echo "[1/6] 检查 PM2 状态..."
pm2 status
echo ""

# 2. 检查端口监听
echo "[2/6] 检查端口 3000..."
netstat -tlnp 2>/dev/null | grep 3000 || ss -tlnp | grep 3000
echo ""

# 3. 检查 Nginx 状态
echo "[3/6] 检查 Nginx 状态..."
systemctl status nginx --no-pager 2>&1 | head -20
echo ""

# 4. 查看应用日志
echo "[4/6] 查看应用日志（最近 50 行）..."
pm2 logs newclaw-pro --lines 50 2>&1 || echo "无日志"
echo ""

# 5. 检查磁盘空间
echo "[5/6] 检查磁盘空间..."
df -h
echo ""

# 6. 检查内存
echo "[6/6] 检查内存..."
free -h
echo ""

echo "=========================================="
echo "  诊断完成"
echo "=========================================="
echo ""
echo "常见问题修复:"
echo ""
echo "1. 如果应用未运行，手动启动:"
echo "   cd /home/admin/newclaw-pro && pm2 start npm --name newclaw-pro -- start"
echo ""
echo "2. 如果端口被占用，查找并杀死进程:"
echo "   lsof -i :3000 && kill -9 \$(lsof -t -i:3000)"
echo ""
echo "3. 重启 Nginx:"
echo "   sudo systemctl restart nginx"
echo ""
echo "4. 查看详细错误:"
echo "   pm2 logs newclaw-pro --lines 100"
echo ""
