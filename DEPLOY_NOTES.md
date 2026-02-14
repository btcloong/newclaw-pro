# NewClaw Pro 部署问题记录

## 服务器信息
- **IP**: 47.236.188.95
- **用户**: admin (也用过 root)
- **密码**: `*A5+Vw+2fv6WjdT`
- **部署目录**: `/home/admin/newclaw-pro`

## 遇到的问题及解决方案

### 1. 权限问题
**问题**: 无法创建 `/var/www` 目录  
**解决**: 改用用户主目录 `/home/admin/newclaw-pro`

### 2. 原生模块编译错误
**问题**: `better-sqlite3` 原生模块无法加载  
**解决**: 移除 `@libsql/client` 依赖，改用纯内存存储

### 3. Node.js 版本问题
**问题**: 服务器上 Node 版本过低或 npm 命令找不到  
**解决**: 重新安装 Node.js 20.x
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 4. 防火墙/端口问题
**问题**: 端口 3000 无法外部访问  
**解决**: 
- 使用 Nginx 反向代理到 80 端口
- 配置阿里云安全组开放端口

### 5. 应用绑定地址问题
**问题**: 应用只在 IPv6 (`:::3000`) 监听，不在 IPv4  
**解决**: 修改 `package.json` 启动脚本
```json
"start": "next start -H 0.0.0.0"
```

### 6. Git 仓库问题
**问题**: 服务器目录不是 git 仓库，`git pull` 失败  
**解决**: 重新克隆项目
```bash
rm -rf /home/admin/newclaw-pro
git clone https://github.com/btcloong/newclaw-pro.git
```

### 7. 中文引号语法错误
**问题**: `"地球上最聪明的AI"` 中文引号导致 JavaScript 语法错误  
**解决**: 改为英文单引号 `'地球上最聪明的AI'`

### 8. PM2 工作目录问题
**问题**: PM2 在错误的目录运行，找不到 `package.json`  
**解决**: 删除所有 PM2 进程，在正确目录重新启动
```bash
pm2 delete all
cd /home/admin/newclaw-pro
pm2 start "npm start" --name newclaw-pro
```

### 9. 缺少构建文件
**问题**: 没有 `.next` 目录，提示 "Could not find a production build"  
**解决**: 执行构建命令
```bash
npm run build
```

## 标准部署流程

```bash
# 1. 登录服务器
ssh admin@47.236.188.95

# 2. 进入项目目录
cd /home/admin/newclaw-pro

# 3. 拉取最新代码
git pull

# 4. 安装依赖
npm install

# 5. 构建项目
npm run build

# 6. 重启应用
pm2 restart newclaw-pro

# 7. 保存配置
pm2 save

# 8. 检查状态
pm2 status
```

## 一键部署脚本

```bash
ssh admin@47.236.188.95 'bash -s' < <(curl -fsSL https://raw.githubusercontent.com/btcloong/newclaw-pro/main/deploy.sh)
```

## 检查命令

```bash
# 检查应用状态
pm2 status

# 查看日志
pm2 logs newclaw-pro --lines 50

# 检查端口监听
ss -tlnp | grep 3000

# 本地测试
curl http://127.0.0.1:3000

# Nginx 错误日志
sudo tail -20 /var/log/nginx/error.log
```

## GitHub Secrets 配置

| Name | Value |
|------|-------|
| `SERVER_HOST` | `47.236.188.95` |
| `SERVER_USER` | `admin` |
| `SERVER_PASSWORD` | `*A5+Vw+2fv6WjdT` |

## 注意事项

1. **必须先执行 `npm run build`** 才能启动生产服务器
2. **PM2 必须在项目目录内启动**，否则找不到文件
3. **中文引号要避免**，使用英文引号或单引号
4. **构建可能需要几分钟**，耐心等待
5. **每次更新代码后都要重新构建**
