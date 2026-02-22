#!/bin/bash
# 本地构建 + 服务器部署脚本
# 在本地运行此脚本，构建后上传到服务器

set -e

echo "=========================================="
echo "🏗️ 本地构建 + 远程部署脚本"
echo "=========================================="

SERVER_HOST="47.236.188.95"
SERVER_USER="admin"
PROJECT_DIR="/home/admin/newclaw-pro"

echo ""
echo "📦 步骤 1: 本地清理..."
rm -rf .next
rm -rf node_modules

echo ""
echo "📦 步骤 2: 本地安装依赖..."
npm install --no-audit --no-fund

echo ""
echo "🏗️ 步骤 3: 本地构建..."
NODE_OPTIONS="--max-old-space-size=4096" npm run build

echo ""
echo "📦 步骤 4: 准备部署包..."
# 创建部署目录
mkdir -p deploy
cp -r .next deploy/
cp -r public deploy/ 2>/dev/null || true
cp -r data deploy/ 2>/dev/null || true
cp package.json deploy/
cp ecosystem.config.js deploy/ 2>/dev/null || true
cp next.config.mjs deploy/ 2>/dev/null || true

echo ""
echo "🚀 步骤 5: 上传到服务器..."
# 清理服务器上的旧目录
ssh ${SERVER_USER}@${SERVER_HOST} "rm -rf ${PROJECT_DIR}"

# 创建新目录
ssh ${SERVER_USER}@${SERVER_HOST} "mkdir -p ${PROJECT_DIR}"

# 上传文件
scp -r deploy/* ${SERVER_USER}@${SERVER_HOST}:${PROJECT_DIR}/

echo ""
echo "🚀 步骤 6: 在服务器上安装生产依赖..."
ssh ${SERVER_USER}@${SERVER_HOST} "cd ${PROJECT_DIR} && npm install --production --no-audit --no-fund"

echo ""
echo "🚀 步骤 7: 启动服务..."
ssh ${SERVER_USER}@${SERVER_HOST} "cd ${PROJECT_DIR} && pm2 delete newclaw-pro 2>/dev/null || true && pm2 start ecosystem.config.js && pm2 save"

echo ""
echo "🧹 步骤 8: 清理本地部署目录..."
rm -rf deploy

echo "=========================================="
echo "✅ 部署完成！"
echo "=========================================="
echo ""
echo "🌐 网站地址: http://${SERVER_HOST}"
