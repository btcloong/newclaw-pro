#!/bin/bash
# GitHub Secrets 配置脚本
# 使用: bash setup-github-secrets.sh

# 配置
REPO="btcloong/newclaw-pro"

# Secrets 配置
declare -A SECRETS=(
  ["GEMINI_API_KEY"]="AIzaSyAic3PWhq8eWyEKr_V41FqbJ_0MC_ZImAs"
  ["API_KEY"]="newclaw_secret_key_2026"
  ["SERVER_HOST"]="47.236.188.95"
  ["SERVER_USER"]="admin"
  ["SERVER_PASSWORD"]="*A5+Vw+2fv6WjdT"
)

echo "=========================================="
echo "  GitHub Secrets 配置工具"
echo "=========================================="
echo ""
echo "仓库: $REPO"
echo ""

# 检查 gh CLI
if ! command -v gh &> /dev/null; then
  echo "错误: 需要安装 GitHub CLI (gh)"
  echo "安装: https://cli.github.com/"
  exit 1
fi

# 检查登录状态
if ! gh auth status &> /dev/null; then
  echo "错误: 请先登录 GitHub CLI"
  echo "运行: gh auth login"
  exit 1
fi

echo "正在配置 Secrets..."
echo ""

# 设置每个 secret
for key in "${!SECRETS[@]}"; do
  value="${SECRETS[$key]}"
  
  echo "设置 $key..."
  
  # 使用 gh secret set 命令
  echo "$value" | gh secret set "$key" -R "$REPO" 2>/dev/null || {
    echo "  警告: 可能已存在或设置失败"
  }
done

echo ""
echo "=========================================="
echo "  Secrets 配置完成!"
echo "=========================================="
echo ""
echo "已配置的 Secrets:"
for key in "${!SECRETS[@]}"; do
  echo "  ✓ $key"
done
echo ""
echo "验证命令:"
echo "  gh secret list -R $REPO"
echo ""
echo "现在可以手动触发工作流:"
echo "  gh workflow run auto-deploy.yml -R $REPO"
