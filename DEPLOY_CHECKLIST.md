# NewClaw Pro - 部署检查清单

## 部署前准备

- [ ] 购买阿里云 ECS 服务器 (2核2G, Ubuntu 22.04)
- [ ] 配置安全组 (开放 22, 80, 443 端口)
- [ ] 准备域名 (可选，用于 HTTPS)
- [ ] 准备邮箱 (用于 SSL 证书)

## 服务器部署步骤

### 1. 连接服务器
```bash
ssh root@your-server-ip
```

### 2. 上传项目
```bash
# 本地执行
rsync -avz --exclude 'node_modules' --exclude '.git' \
  ./ root@your-server-ip:/var/www/newclaw-pro/
```

### 3. 配置环境
```bash
# 服务器上执行
cd /var/www/newclaw-pro
chmod +x deploy/*.sh
./deploy/setup-server.sh
```

### 4. 部署应用
```bash
./deploy/deploy-app.sh
```

### 5. 配置 SSL (如有域名)
```bash
./deploy/setup-ssl.sh your-domain.com your-email@example.com
```

## 部署验证

- [ ] 访问 http://your-server-ip 能打开首页
- [ ] 热点页正常显示
- [ ] 投研页正常显示
- [ ] 孵化页正常显示
- [ ] 新闻详情页正常显示
- [ ] 项目详情页正常显示
- [ ] 研究报告详情页正常显示

## 功能验证

- [ ] 首页统计数据展示
- [ ] 热点新闻列表
- [ ] 热搜榜单
- [ ] 项目发现
- [ ] 24h/7天/30天热门切换
- [ ] 融资动态展示
- [ ] 赛道趋势展示
- [ ] 研究报告列表
- [ ] 创意库展示
- [ ] 工具推荐展示
- [ ] 案例展示

## 监控检查

- [ ] PM2 状态正常: `pm2 status`
- [ ] Nginx 运行正常: `systemctl status nginx`
- [ ] 定时任务配置: `crontab -l`
- [ ] 日志文件生成: `ls -la /var/log/newclaw/`

## 安全设置 (建议)

- [ ] 修改 SSH 端口
- [ ] 创建普通用户
- [ ] 禁用 root 登录
- [ ] 配置 SSH 密钥登录
- [ ] 禁用密码登录

## 访问地址

- HTTP: http://your-server-ip
- HTTPS: https://your-domain.com (配置 SSL 后)

## 紧急恢复

如果部署失败：

```bash
# 查看错误日志
pm2 logs

# 重启应用
pm2 restart newclaw-pro

# 重新部署
./deploy/deploy-app.sh

# 重启 Nginx
systemctl restart nginx
```
