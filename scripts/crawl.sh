#!/bin/bash

# 定时抓取脚本 - 每30分钟运行一次
# 将此脚本添加到 crontab: */30 * * * * /home/admin/newclaw-pro/scripts/crawl.sh

cd /home/admin/newclaw-pro

echo "🚀 Starting crawl at $(date)"

# 运行爬虫
npx tsx src/lib/crawler.ts >> logs/crawl.log 2>&1

# 检查是否需要重启应用（如果数据有更新）
if [ $? -eq 0 ]; then
    echo "✅ Crawl completed successfully at $(date)"
else
    echo "❌ Crawl failed at $(date)"
fi

echo "----------------------------------------"
