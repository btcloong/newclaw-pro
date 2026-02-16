# GitHub Personal Access Token 创建指南

## 步骤 1: 创建 Token

1. 登录 GitHub: https://github.com
2. 点击右上角头像 → Settings
3. 左侧菜单最下方 → Developer settings
4. Personal access tokens → Tokens (classic)
5. 点击 "Generate new token (classic)"
6. 填写信息:
   - **Note**: `NewClaw Secrets Management`
   - **Expiration**: 90 days (或选择 No expiration)
   - **Scopes**: 勾选以下权限
     - [x] `repo` (Full control of private repositories)
     - [x] `workflow` (Update GitHub Action workflows)

7. 点击 "Generate token"
8. **立即复制 token** (只显示一次!)

## 步骤 2: 使用 Token 配置 Secrets

### 方法 A: 使用 GitHub CLI (推荐)

```bash
# 1. 安装 GitHub CLI
# macOS:
brew install gh

# Windows:
winget install --id GitHub.cli

# Ubuntu/Debian:
sudo apt install gh

# 2. 登录
gh auth login
# 选择: HTTPS → Y → Paste authentication token → 粘贴你的token

# 3. 验证登录
gh auth status

# 4. 配置 Secrets
gh secret set GEMINI_API_KEY -R btcloong/newclaw-pro
# 输入: AIzaSyAic3PWhq8eWyEKr_V41FqbJ_0MC_ZImAs
# 按 Ctrl+D (macOS) 或 Ctrl+Z (Windows)

gh secret set API_KEY -R btcloong/newclaw-pro
# 输入: newclaw_secret_key_2026
# 按 Ctrl+D 或 Ctrl+Z

gh secret set SERVER_HOST -R btcloong/newclaw-pro
# 输入: 47.236.188.95

gh secret set SERVER_USER -R btcloong/newclaw-pro
# 输入: admin

gh secret set SERVER_PASSWORD -R btcloong/newclaw-pro
# 输入: *A5+Vw+2fv6WjdT

# 5. 验证
gh secret list -R btcloong/newclaw-pro
```

### 方法 B: 使用 API (curl)

```bash
# 设置变量
GITHUB_TOKEN="你的_personal_access_token"
REPO="btcloong/newclaw-pro"

# 配置 GEMINI_API_KEY
curl -X PUT \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/$REPO/actions/secrets/GEMINI_API_KEY \
  -d '{
    "encrypted_value": "'$(echo -n "AIzaSyAic3PWhq8eWyEKr_V41FqbJ_0MC_ZImAs" | base64)'",
    "key_id": "'$(curl -s -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/$REPO/actions/secrets/public-key | jq -r .key_id)'"
  }'

# 其他 Secrets 类似...
```

### 方法 C: 网页界面 (最简单)

1. 打开: https://github.com/btcloong/newclaw-pro/settings/secrets/actions
2. 点击 "New repository secret"
3. 逐个添加:

| Name | Value |
|------|-------|
| GEMINI_API_KEY | AIzaSyAic3PWhq8eWyEKr_V41FqbJ_0MC_ZImAs |
| API_KEY | newclaw_secret_key_2026 |
| SERVER_HOST | 47.236.188.95 |
| SERVER_USER | admin |
| SERVER_PASSWORD | *A5+Vw+2fv6WjdT |

## 步骤 3: 验证配置

### 检查 Secrets 列表
https://github.com/btcloong/newclaw-pro/settings/secrets/actions

应该显示 5 个 Secrets:
- [x] API_KEY
- [x] GEMINI_API_KEY
- [x] SERVER_HOST
- [x] SERVER_PASSWORD
- [x] SERVER_USER

### 触发测试工作流

1. 打开: https://github.com/btcloong/newclaw-pro/actions
2. 选择 "Auto Crawl RSS Feeds"
3. 点击 "Run workflow"
4. 选择 "auto" 类型
5. 点击 "Run workflow"

### 检查日志

工作流运行后，点击进入查看日志:
- 绿色 ✓ 表示成功
- 红色 ✗ 表示失败，查看错误信息

## 常见问题

### Q: 提示 "Permission denied"
A: Token 权限不足，需要勾选 `repo` 和 `workflow`

### Q: Secrets 设置后不生效
A: 需要重新触发工作流，Secrets 只对新运行生效

### Q: 如何更新 Secret?
A: 在 Secrets 页面点击 Secret 名称，然后 "Update"

### Q: 如何删除 Secret?
A: 在 Secrets 页面点击 Secret 名称，然后 "Remove"

## 安全建议

1. **不要** 在代码中硬编码 Secrets
2. **不要** 分享你的 Personal Access Token
3. 定期轮换 Token (建议 90 天)
4. 使用 Fine-grained tokens (更细粒度控制)
5. 启用 2FA 保护 GitHub 账户
