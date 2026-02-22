#!/bin/bash
# 修复脚本 - 在服务器上运行

set -e

echo "🛑 Stopping service..."
pm2 delete newclaw-pro 2>/dev/null || echo "Service not running"

echo "💾 Backing up data..."
mkdir -p /tmp/data-backup
cp -r /home/admin/newclaw-pro/data/* /tmp/data-backup/ 2>/dev/null || echo "No data to backup"

echo "🗑️ Removing corrupted repository..."
rm -rf /home/admin/newclaw-pro

echo "📥 Cloning fresh repository..."
git clone https://github.com/btcloong/newclaw-pro.git /home/admin/newclaw-pro
cd /home/admin/newclaw-pro

echo "📂 Restoring data..."
mkdir -p data
cp -r /tmp/data-backup/* data/ 2>/dev/null || echo "No data to restore"

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building project..."
npm run build

echo "🚀 Starting service..."
pm2 start ecosystem.config.js

echo "✅ Done! Checking status..."
pm2 status

echo ""
echo "📝 Testing API..."
curl -s http://localhost:3000/api/news | head -c 100
