# ⚡ 快速配置 GitHub Secrets

## 推荐方法：网页界面（5分钟完成）

### 步骤 1: 打开 Secrets 页面
访问: https://github.com/btcloong/newclaw-pro/settings/secrets/actions

### 步骤 2: 点击 "New repository secret"

### 步骤 3: 逐个添加以下 Secrets

#### Secret 1: GEMINI_API_KEY
- **Name**: `GEMINI_API_KEY`
- **Value**: `AIzaSyAic3PWhq8eWyEKr_V41FqbJ_0MC_ZImAs`
- 点击 "Add secret"

#### Secret 2: API_KEY
- **Name**: `API_KEY`
- **Value**: `newclaw_secret_key_2026`
- 点击 "Add secret"

#### Secret 3: SERVER_HOST
- **Name**: `SERVER_HOST`
- **Value**: `47.236.188.95`
- 点击 "Add secret"

#### Secret 4: SERVER_USER
- **Name**: `SERVER_USER`
- **Value**: `admin`
- 点击 "Add secret"

#### Secret 5: SERVER_PASSWORD
- **Name**: `SERVER_PASSWORD`
- **Value**: `*A5+Vw+2fv6WjdT`
- 点击 "Add secret"

### 步骤 4: 验证
页面应显示 5 个 Secrets:
- [x] API_KEY
- [x] GEMINI_API_KEY
- [x] SERVER_HOST
- [x] SERVER_PASSWORD
- [x] SERVER_USER

### 步骤 5: 测试自动采集
1. 访问: https://github.com/btcloong/newclaw-pro/actions
2. 点击 "Auto Crawl RSS Feeds"
3. 点击右侧 "Run workflow" → "Run workflow"
4. 等待运行完成（约 2-5 分钟）
5. 查看日志确认成功

---

## 备选方法：使用 GitHub CLI

如果你已经安装了 `gh`:

```bash
# 登录
gh auth login

# 快速设置所有 Secrets
echo "AIzaSyAic3PWhq8eWyEKr_V41FqbJ_0MC_ZImAs" | gh secret set GEMINI_API_KEY -R btcloong/newclaw-pro
echo "newclaw_secret_key_2026" | gh secret set API_KEY -R btcloong/newclaw-pro
echo "47.236.188.95" | gh secret set SERVER_HOST -R btcloong/newclaw-pro
echo "admin" | gh secret set SERVER_USER -R btcloong/newclaw-pro
echo "*A5+Vw+2fv6WjdT" | gh secret set SERVER_PASSWORD -R btcloong/newclaw-pro

# 验证
gh secret list -R btcloong/newclaw-pro
```

---

## 配置完成后

### 自动采集将按计划运行：
- **每30分钟**: 抓取高频 RSS 源
- **每2小时**: 抓取中频 RSS 源
- **每6小时**: 抓取低频 RSS 源
- **每天凌晨2点**: 全量抓取

### 查看运行状态：
https://github.com/btcloong/newclaw-pro/actions

### 手动触发：
1. 进入 Actions 页面
2. 选择 "Auto Crawl RSS Feeds"
3. 点击 "Run workflow"
4. 选择类型: auto/full/high/medium/low/ai
5. 点击运行

---

## 故障排查

### 问题：工作流显示 "This workflow has no runs yet"
**解决**: 等待定时触发，或手动点击 "Run workflow"

### 问题：运行失败，提示 "Secret not found"
**解决**: 检查 Secrets 名称是否完全匹配（区分大小写）

### 问题：爬虫运行但无新数据
**解决**: 
1. 检查 GEMINI_API_KEY 是否有效
2. 查看 Actions 日志中的详细错误
3. 确认 RSS 源是否可访问

### 问题：部署失败
**解决**: 
1. 检查 SERVER_HOST, SERVER_USER, SERVER_PASSWORD 是否正确
2. 确认服务器 SSH 服务正常运行
3. 检查服务器磁盘空间

---

## 需要帮助？

查看详细指南: [GITHUB_SECRETS_GUIDE.md](./GITHUB_SECRETS_GUIDE.md)
