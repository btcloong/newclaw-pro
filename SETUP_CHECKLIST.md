# ✅ GitHub Secrets 配置检查清单

## 配置前准备

- [ ] 可以访问 GitHub: https://github.com
- [ ] 已登录 GitHub 账户
- [ ] 有 btcloong/newclaw-pro 仓库的写权限

## 配置步骤

### 方法 1: 网页界面（推荐，5分钟）

1. [ ] 打开 https://github.com/btcloong/newclaw-pro/settings/secrets/actions
2. [ ] 点击 "New repository secret"
3. [ ] 添加 Secret: `GEMINI_API_KEY` = `AIzaSyAic3PWhq8eWyEKr_V41FqbJ_0MC_ZImAs`
4. [ ] 添加 Secret: `API_KEY` = `newclaw_secret_key_2026`
5. [ ] 添加 Secret: `SERVER_HOST` = `47.236.188.95`
6. [ ] 添加 Secret: `SERVER_USER` = `root` ⚠️ **重要：是 root，不是 admin**
7. [ ] 添加 Secret: `SERVER_PASSWORD` = `*A5+Vw+2fv6WjdT`
8. [ ] 页面显示 5 个 Secrets

### 方法 2: GitHub CLI

1. [ ] 安装 `gh`: https://cli.github.com
2. [ ] 运行 `gh auth login`
3. [ ] 运行以下命令:
```bash
echo "AIzaSyAic3PWhq8eWyEKr_V41FqbJ_0MC_ZImAs" | gh secret set GEMINI_API_KEY -R btcloong/newclaw-pro
echo "newclaw_secret_key_2026" | gh secret set API_KEY -R btcloong/newclaw-pro
echo "47.236.188.95" | gh secret set SERVER_HOST -R btcloong/newclaw-pro
echo "root" | gh secret set SERVER_USER -R btcloong/newclaw-pro  # ⚠️ root 用户
echo "*A5+Vw+2fv6WjdT" | gh secret set SERVER_PASSWORD -R btcloong/newclaw-pro
```
4. [ ] 验证: `gh secret list -R btcloong/newclaw-pro`

## 配置后验证

### 验证 Secrets 已配置
- [ ] 访问 https://github.com/btcloong/newclaw-pro/settings/secrets/actions
- [ ] 确认显示 5 个 Secrets

### 测试自动部署
1. [ ] 访问 https://github.com/btcloong/newclaw-pro/actions
2. [ ] 选择 "Auto Deploy to Server"
3. [ ] 点击 "Run workflow"
4. [ ] 等待运行完成（绿色 ✓）
5. [ ] 访问 https://newclaw.com 确认更新

### 测试自动采集
1. [ ] 访问 https://github.com/btcloong/newclaw-pro/actions
2. [ ] 选择 "Auto Crawl RSS Feeds"
3. [ ] 点击 "Run workflow"
4. [ ] 选择类型: "auto"
5. [ ] 点击 "Run workflow"
6. [ ] 等待运行完成（绿色 ✓）
7. [ ] 查看日志确认抓取成功

### 验证 API 端点
- [ ] 访问 https://newclaw.com/api/crawl
- [ ] 应返回爬虫统计信息

## 预期结果

### 自动部署
- 每次 push 到 main 分支自动部署到服务器
- 部署完成后网站自动更新

### 自动采集
- 每30分钟抓取高频 RSS 源
- 每2小时抓取中频 RSS 源
- 每6小时抓取低频 RSS 源
- 每天凌晨2点全量抓取
- 抓取后自动进行 AI 处理

### 手动触发
- 可以随时手动触发爬虫
- 可以选择不同类型: auto/full/high/medium/low/ai

## 故障排查

如果配置失败，检查:

1. **Secrets 名称是否正确** (区分大小写)
2. **Token 是否有足够权限** (需要 repo 和 workflow)
3. **服务器是否可访问** (47.236.188.95:22)
4. **GEMINI_API_KEY 是否有效**

## 完成标记

配置完成后，在此打勾:
- [ ] 所有 Secrets 已配置
- [ ] 自动部署测试成功
- [ ] 自动采集测试成功
- [ ] 网站正常运行

**配置完成时间**: ___年___月___日 ___:___
**配置人员**: _______________
