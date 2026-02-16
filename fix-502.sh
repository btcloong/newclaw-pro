#!/bin/bash
# 快速修复 502 错误
# 在服务器上以 admin 用户执行

echo "=== 开始修复 502 错误 ==="
echo ""

cd /home/admin/newclaw-pro

# 1. 检查并安装依赖
echo "[1/4] 检查依赖..."
if [ ! -d "node_modules" ]; then
    echo "安装依赖..."
    npm install
fi

# 2. 构建应用
echo "[2/4] 构建应用..."
npm run build

# 3. 重启应用
echo "[3/4] 重启应用..."
pm2 delete newclaw-pro 2>/dev/null || true
pm2 start npm --name newclaw-pro -- start

# 4. 保存 PM2 配置
echo "[4/4] 保存配置..."
pm2 save

echo ""
echo "=== 修复完成 ==="
echo ""
pm2 status
echo ""
echo "测试: curl http://localhost:3000"
