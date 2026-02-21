#!/bin/bash
#
# 在服务器上手动运行爬虫
# 用法: ./run-crawler.sh [auto|full|high|twitter|ai]
#

set -e

CRAWL_TYPE="${1:-auto}"

echo "🚀 Running crawler: $CRAWL_TYPE"
echo "⏰ Time: $(date -u +"%Y-%m-%d %H:%M:%S UTC")"

# 进入项目目录
cd /home/admin/newclaw-pro

# 确保依赖已安装
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm ci
fi

# 设置环境变量
export NODE_ENV=production

# 运行爬虫
echo "🕷️ Starting crawl..."
npx tsx src/lib/crawler-cli.ts "$CRAWL_TYPE"

echo ""
echo "✅ Crawl completed!"
echo ""

# 显示统计
echo "📊 Data directory:"
ls -la data/

echo ""
echo "📈 News count:"
if [ -f "data/news.json" ]; then
    cat data/news.json | wc -l
else
    echo "No news.json found"
fi

echo ""
echo "🐦 Tweets count:"
if [ -f "data/tweets.json" ]; then
    cat data/tweets.json | wc -l
else
    echo "No tweets.json found"
fi
