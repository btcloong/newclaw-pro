#!/bin/bash
# 手动触发爬虫脚本
# 使用方法: bash trigger-crawl.sh [auto|full|high|medium|low|ai]

API_URL="https://newclaw.com/api/crawl"
API_KEY="newclaw_secret_key_2026"
CRAWL_TYPE="${1:-auto}"

echo "=========================================="
echo "  触发 NewClaw 爬虫"
echo "=========================================="
echo ""
echo "类型: $CRAWL_TYPE"
echo "URL: $API_URL"
echo ""

# 发送请求
response=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d "{\"type\": \"$CRAWL_TYPE\"}" 2>&1)

# 检查响应
if echo "$response" | grep -q '"success":true'; then
  echo "✅ 爬虫触发成功!"
  echo ""
  echo "响应:"
  echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
else
  echo "❌ 爬虫触发失败"
  echo ""
  echo "响应:"
  echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
  exit 1
fi

echo ""
echo "查看爬虫状态:"
echo "  curl -H 'X-API-Key: $API_KEY' $API_URL"
