# GitHub Secrets 配置指南

## 自动配置（推荐）

### 方法 1: 使用脚本（需要 GitHub CLI）

```bash
# 1. 安装 GitHub CLI
# macOS
brew install gh

# Ubuntu/Debian
sudo apt install gh

# 2. 登录 GitHub
gh auth login

# 3. 运行配置脚本
curl -O https://raw.githubusercontent.com/btcloong/newclaw-pro/main/setup-github-secrets.sh
bash setup-github-secrets.sh
```

### 方法 2: 手动配置

1. 打开 GitHub 仓库设置:
   https://github.com/btcloong/newclaw-pro/settings/secrets/actions

2. 点击 "New repository secret" 添加以下 Secrets:

| Secret Name | Value | 说明 |
|------------|-------|------|
| `GEMINI_API_KEY` | `AIzaSyAic3PWhq8eWyEKr_V41FqbJ_0MC_ZImAs` | Gemini AI API 密钥 |
| `API_KEY` | `newclaw_secret_key_2026` | API 认证密钥 |
| `SERVER_HOST` | `47.236.188.95` | 服务器 IP |
| `SERVER_USER` | `admin` | 服务器用户名 |
| `SERVER_PASSWORD` | `*A5+Vw+2fv6WjdT` | 服务器密码 |

3. 添加完成后，工作流将自动启用

## 验证配置

### 检查 Secrets
```bash
gh secret list -R btcloong/newclaw-pro
```

### 手动触发工作流
```bash
# 触发自动部署
gh workflow run auto-deploy.yml -R btcloong/newclaw-pro

# 触发爬虫
gh workflow run crawl.yml -R btcloong/newclaw-pro
```

## 工作流说明

### 1. Auto Deploy (auto-deploy.yml)
- **触发条件**: push 到 main 分支
- **功能**: 自动部署到服务器
- **需要 Secrets**: SERVER_HOST, SERVER_USER, SERVER_PASSWORD

### 2. Auto Crawl (crawl.yml)
- **触发条件**: 
  - 每 30 分钟自动运行
  - 每天凌晨 2 点全量抓取
  - 手动触发
- **功能**: 自动抓取 RSS 源并处理 AI
- **需要 Secrets**: GEMINI_API_KEY, API_KEY

## 爬虫类型

| 类型 | 命令 | 说明 |
|------|------|------|
| auto | `npm run crawl:auto` | 自动根据优先级抓取 |
| full | `npm run crawl:full` | 全量抓取所有源 |
| high | `npm run crawl:high` | 仅高频源 (30分钟) |
| medium | `npm run crawl:medium` | 仅中频源 (2小时) |
| low | `npm run crawl:low` | 仅低频源 (6小时) |
| ai | `npm run crawl:ai` | 仅处理 AI |

## 手动触发爬虫

### 方法 1: 使用脚本
```bash
curl -O https://raw.githubusercontent.com/btcloong/newclaw-pro/main/trigger-crawl.sh
bash trigger-crawl.sh [auto|full|high|medium|low|ai]
```

### 方法 2: 使用 curl
```bash
curl -X POST https://newclaw.com/api/crawl \
  -H "Content-Type: application/json" \
  -H "X-API-Key: newclaw_secret_key_2026" \
  -d '{"type": "auto"}'
```

### 方法 3: GitHub Actions 界面
1. 打开: https://github.com/btcloong/newclaw-pro/actions
2. 选择 "Auto Crawl RSS Feeds"
3. 点击 "Run workflow"
4. 选择爬虫类型
5. 点击 "Run workflow"

## 监控爬虫状态

### API 端点
```bash
# 获取爬虫统计
curl https://newclaw.com/api/crawl \
  -H "X-API-Key: newclaw_secret_key_2026"
```

### 响应示例
```json
{
  "success": true,
  "stats": {
    "lastCrawlTime": "2026-02-16T10:00:00.000Z",
    "lastFullCrawlTime": "2026-02-16T02:00:00.000Z",
    "lastAIProcessingTime": "2026-02-16T10:05:00.000Z",
    "totalNews": 150,
    "aiProcessedNews": 120,
    "pendingAINews": 30
  }
}
```

## 故障排查

### 爬虫没有运行
1. 检查 GitHub Actions 是否启用
2. 检查 Secrets 是否正确配置
3. 查看 Actions 日志: https://github.com/btcloong/newclaw-pro/actions

### API 返回 401
- 检查 API_KEY 是否正确设置
- 检查请求头 `X-API-Key` 是否正确

### 爬虫报错
- 检查 GEMINI_API_KEY 是否有效
- 查看 GitHub Actions 日志获取详细错误信息
