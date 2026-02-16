#!/bin/bash
# 服务器密码重置和 SSH 配置脚本
# 使用方法: 将此脚本上传到服务器并以 root 执行

set -e

echo "=========================================="
echo "  NewClaw 服务器配置脚本"
echo "=========================================="
echo ""

# 颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 配置
ADMIN_USER="admin"
ADMIN_PASSWORD="NewClaw@2026"  # 新密码
ROOT_PASSWORD="*A5+Vw+2fv6WjdT"  # 当前 root 密码

echo -e "${YELLOW}[1/6] 检查 root 权限...${NC}"
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}错误: 请使用 root 用户运行此脚本${NC}"
    exit 1
fi
echo -e "${GREEN}✓ 权限检查通过${NC}"
echo ""

# 1. 配置 SSH 允许 root 密码登录
echo -e "${YELLOW}[2/6] 配置 SSH...${NC}"

SSH_CONFIG="/etc/ssh/sshd_config"

# 备份原配置
cp $SSH_CONFIG ${SSH_CONFIG}.backup.$(date +%Y%m%d_%H%M%S)

# 修改 SSH 配置
sed -i 's/^#*PermitRootLogin.*/PermitRootLogin yes/' $SSH_CONFIG
sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication yes/' $SSH_CONFIG
sed -i 's/^#*ChallengeResponseAuthentication.*/ChallengeResponseAuthentication yes/' $SSH_CONFIG

# 确保配置存在
if ! grep -q "^PermitRootLogin yes" $SSH_CONFIG; then
    echo "PermitRootLogin yes" >> $SSH_CONFIG
fi

if ! grep -q "^PasswordAuthentication yes" $SSH_CONFIG; then
    echo "PasswordAuthentication yes" >> $SSH_CONFIG
fi

echo -e "${GREEN}✓ SSH 配置已更新${NC}"
echo ""

# 2. 重启 SSH 服务
echo -e "${YELLOW}[3/6] 重启 SSH 服务...${NC}"
if systemctl restart sshd 2>/dev/null || service ssh restart 2>/dev/null; then
    echo -e "${GREEN}✓ SSH 服务已重启${NC}"
else
    echo -e "${YELLOW}⚠ SSH 服务重启可能失败，请手动检查${NC}"
fi
echo ""

# 3. 创建/重置 admin 用户
echo -e "${YELLOW}[4/6] 配置 admin 用户...${NC}"

if id "$ADMIN_USER" &>/dev/null; then
    echo "用户 $ADMIN_USER 已存在，重置密码..."
    echo "$ADMIN_USER:$ADMIN_PASSWORD" | chpasswd
else
    echo "创建用户 $ADMIN_USER..."
    useradd -m -s /bin/bash $ADMIN_USER
    echo "$ADMIN_USER:$ADMIN_PASSWORD" | chpasswd
    
    # 添加到 sudo 组
    usermod -aG sudo $ADMIN_USER 2>/dev/null || usermod -aG wheel $ADMIN_USER 2>/dev/null || true
fi

# 设置目录权限
chown -R $ADMIN_USER:$ADMIN_USER /home/$ADMIN_USER
echo -e "${GREEN}✓ admin 用户配置完成${NC}"
echo ""

# 4. 创建项目目录
echo -e "${YELLOW}[5/6] 创建项目目录...${NC}"

PROJECT_DIR="/home/$ADMIN_USER/newclaw-pro"

if [ ! -d "$PROJECT_DIR" ]; then
    mkdir -p $PROJECT_DIR
    chown $ADMIN_USER:$ADMIN_USER $PROJECT_DIR
    echo -e "${GREEN}✓ 项目目录已创建: $PROJECT_DIR${NC}"
else
    echo -e "${GREEN}✓ 项目目录已存在: $PROJECT_DIR${NC}"
fi
echo ""

# 5. 安装 Node.js 和 PM2（如果不存在）
echo -e "${YELLOW}[6/6] 检查 Node.js 和 PM2...${NC}"

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "安装 Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

# 检查 PM2
if ! command -v pm2 &> /dev/null; then
    echo "安装 PM2..."
    npm install -g pm2
fi

# 确保 admin 用户可以使用 pm2
sudo -u $ADMIN_USER bash -c "export PATH=\"/usr/local/bin:\$PATH\" && pm2 --version" > /dev/null 2>&1 || {
    echo "为 admin 用户配置 PM2..."
    sudo -u $ADMIN_USER bash -c "npm install -g pm2"
}

echo -e "${GREEN}✓ Node.js 和 PM2 检查完成${NC}"
echo ""

# 6. 输出配置信息
echo "=========================================="
echo -e "${GREEN}  配置完成!${NC}"
echo "=========================================="
echo ""
echo "配置信息:"
echo "  服务器 IP: 47.236.188.95"
echo "  root 密码: $ROOT_PASSWORD"
echo "  admin 密码: $ADMIN_PASSWORD"
echo "  项目目录: $PROJECT_DIR"
echo ""
echo "GitHub Secrets 配置:"
echo "  SERVER_HOST: 47.236.188.95"
echo "  SERVER_USER: root"
echo "  SERVER_PASSWORD: $ROOT_PASSWORD"
echo ""
echo "测试连接:"
echo "  ssh root@47.236.188.95"
echo "  密码: $ROOT_PASSWORD"
echo ""
echo "=========================================="
echo ""
echo -e "${YELLOW}重要提示:${NC}"
echo "1. 请记录 admin 密码: $ADMIN_PASSWORD"
echo "2. 建议修改默认密码"
echo "3. 考虑使用 SSH 密钥替代密码登录"
echo ""
