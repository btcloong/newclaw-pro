#!/bin/bash
# GitHub Secrets 一键配置脚本
# 使用方法: GITHUB_TOKEN=your_token bash configure-secrets.sh

set -e

REPO="btcloong/newclaw-pro"

# 颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 检查 GITHUB_TOKEN
if [ -z "$GITHUB_TOKEN" ]; then
  echo -e "${RED}错误: 请设置 GITHUB_TOKEN 环境变量${NC}"
  echo ""
  echo "使用方法:"
  echo "  GITHUB_TOKEN=ghp_xxxxxxxxxxxx bash configure-secrets.sh"
  echo ""
  echo "如何获取 Token:"
  echo "  1. 访问 https://github.com/settings/tokens"
  echo "  2. 点击 'Generate new token (classic)'"
  echo "  3. 勾选 'repo' 和 'workflow' 权限"
  echo "  4. 复制 token"
  exit 1
fi

echo "=========================================="
echo "  GitHub Secrets 配置工具"
echo "=========================================="
echo ""
echo "仓库: $REPO"
echo ""

# 验证 Token
echo -e "${YELLOW}[1/6] 验证 GitHub Token...${NC}"
if ! curl -s -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user > /dev/null; then
  echo -e "${RED}错误: Token 无效或已过期${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Token 有效${NC}"
echo ""

# 获取 public key
echo -e "${YELLOW}[2/6] 获取仓库公钥...${NC}"
KEY_RESPONSE=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/$REPO/actions/secrets/public-key")

KEY_ID=$(echo "$KEY_RESPONSE" | grep -o '"key_id": "[^"]*"' | cut -d'"' -f4)
PUBLIC_KEY=$(echo "$KEY_RESPONSE" | grep -o '"key": "[^"]*"' | cut -d'"' -f4)

if [ -z "$KEY_ID" ] || [ -z "$PUBLIC_KEY" ]; then
  echo -e "${RED}错误: 无法获取仓库公钥${NC}"
  echo "响应: $KEY_RESPONSE"
  exit 1
fi

echo -e "${GREEN}✓ 获取公钥成功${NC}"
echo ""

# 加密函数 (使用 libsodium)
encrypt_secret() {
  local secret="$1"
  local key="$2"
  
  # 使用 Python 进行加密
  python3 << EOF
import base64
import nacl.public
import nacl.encoding

public_key = nacl.public.PublicKey(
    base64.b64decode("$key"),
    nacl.encoding.RawEncoder
)
sealed_box = nacl.public.SealedBox(public_key)
encrypted = sealed_box.encrypt("$secret".encode())
print(base64.b64encode(encrypted).decode())
EOF
}

# 配置 Secrets
configure_secret() {
  local name="$1"
  local value="$2"
  
  echo -e "${YELLOW}配置 $name...${NC}"
  
  # 加密值
  ENCRYPTED_VALUE=$(encrypt_secret "$value" "$PUBLIC_KEY")
  
  # 创建/更新 Secret
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
    -X PUT \
    -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/repos/$REPO/actions/secrets/$name" \
    -d "{
      \"encrypted_value\": \"$ENCRYPTED_VALUE\",
      \"key_id\": \"$KEY_ID\"
    }")
  
  if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "204" ]; then
    echo -e "${GREEN}✓ $name 配置成功${NC}"
    return 0
  else
    echo -e "${RED}✗ $name 配置失败 (HTTP $HTTP_CODE)${NC}"
    return 1
  fi
}

# 安装依赖
echo -e "${YELLOW}[3/6] 检查依赖...${NC}"
if ! python3 -c "import nacl" 2>/dev/null; then
  echo "安装 PyNaCl..."
  pip3 install pynacl -q
fi
echo -e "${GREEN}✓ 依赖检查完成${NC}"
echo ""

# 配置所有 Secrets
echo -e "${YELLOW}[4/6] 配置 Secrets...${NC}"
echo ""

FAILED=0

configure_secret "GEMINI_API_KEY" "AIzaSyAic3PWhq8eWyEKr_V41FqbJ_0MC_ZImAs" || ((FAILED++))
configure_secret "API_KEY" "newclaw_secret_key_2026" || ((FAILED++))
configure_secret "SERVER_HOST" "47.236.188.95" || ((FAILED++))
configure_secret "SERVER_USER" "admin" || ((FAILED++))
configure_secret "SERVER_PASSWORD" "*A5+Vw+2fv6WjdT" || ((FAILED++))

echo ""

# 验证配置
echo -e "${YELLOW}[5/6] 验证配置...${NC}"
SECRETS_LIST=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/$REPO/actions/secrets")

SECRET_COUNT=$(echo "$SECRETS_LIST" | grep -o '"name":' | wc -l)
echo -e "${GREEN}✓ 已配置 $SECRET_COUNT 个 Secrets${NC}"
echo ""

# 显示结果
echo -e "${YELLOW}[6/6] 配置完成!${NC}"
echo ""
echo "=========================================="
if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}  所有 Secrets 配置成功!${NC}"
else
  echo -e "${RED}  $FAILED 个 Secrets 配置失败${NC}"
fi
echo "=========================================="
echo ""
echo "已配置的 Secrets:"
echo "$SECRETS_LIST" | grep -o '"name": "[^"]*"' | cut -d'"' -f4 | while read name; do
  echo "  ✓ $name"
done
echo ""
echo "下一步:"
echo "  1. 访问 https://github.com/$REPO/actions"
echo "  2. 选择 'Auto Crawl RSS Feeds'"
echo "  3. 点击 'Run workflow' 测试"
echo ""
