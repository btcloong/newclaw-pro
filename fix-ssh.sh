#!/bin/bash
# 一键修复 SSH 和重置密码
# 在服务器上以 root 执行

echo "=== 修复 SSH 配置 ==="

# 允许 root 密码登录
sed -i 's/^#*PermitRootLogin.*/PermitRootLogin yes/' /etc/ssh/sshd_config
sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication yes/' /etc/ssh/sshd_config

# 重启 SSH
systemctl restart sshd || service ssh restart

echo "=== 重置 admin 密码 ==="

# 创建或重置 admin 用户
if id "admin" &>/dev/null; then
    echo "admin 用户存在，重置密码..."
else
    echo "创建 admin 用户..."
    useradd -m -s /bin/bash admin
fi

# 设置新密码
echo "admin:Admin@NewClaw2026" | chpasswd

# 设置权限
chown -R admin:admin /home/admin
mkdir -p /home/admin/newclaw-pro
chown admin:admin /home/admin/newclaw-pro

echo "=== 完成 ==="
echo ""
echo "新密码信息:"
echo "  admin 密码: Admin@NewClaw2026"
echo ""
echo "GitHub Secrets 配置:"
echo "  SERVER_USER: admin"
echo "  SERVER_PASSWORD: Admin@NewClaw2026"
echo ""
