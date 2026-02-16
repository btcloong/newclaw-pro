#!/bin/bash
# 服务器端部署脚本 - 在 47.236.188.95 上执行

set -e

cd /home/admin/newclaw-pro

echo "=== [1/6] 拉取最新代码 ==="
git fetch origin
git reset --hard origin/main

echo "=== [2/6] 安装依赖 ==="
npm install

echo "=== [3/6] 设置环境变量 ==="
if [ ! -f ".env.local" ]; then
  echo "GEMINI_API_KEY=AIzaSyAic3PWhq8eWyEKr_V41FqbJ_0MC_ZImAs" > .env.local
  echo "API_KEY=newclaw_secret_key_2026" >> .env.local
fi

echo "=== [4/6] 构建应用 ==="
npm run build

echo "=== [5/6] 重启 PM2 ==="
pm2 delete newclaw-pro 2>/dev/null || true
pm2 start "npm start" --name newclaw-pro
pm2 save

echo "=== [6/6] 检查状态 ==="
pm2 status

echo ""
echo "✅ 部署完成！"
echo "网站: https://newclaw.com"
echo "查看日志: pm2 logs newclaw-pro"
