#!/bin/bash
# SSH 连接诊断脚本
# 在本地运行此脚本测试连接

echo "=========================================="
echo "  SSH 连接诊断"
echo "=========================================="
echo ""

SERVER_IP="47.236.188.95"
ROOT_PASSWORD="*A5+Vw+2fv6WjdT"

echo "测试服务器: $SERVER_IP"
echo ""

# 测试 1: 检查服务器是否可达
echo "[1/4] 测试网络连通性..."
if ping -c 1 $SERVER_IP > /dev/null 2>&1; then
    echo "✓ 服务器可到达"
else
    echo "✗ 服务器无法 ping 通"
fi
echo ""

# 测试 2: 检查 SSH 端口
echo "[2/4] 测试 SSH 端口..."
if nc -zv $SERVER_IP 22 2>&1 | grep -q "succeeded"; then
    echo "✓ SSH 端口 (22) 开放"
else
    echo "✗ SSH 端口 (22) 无法连接"
fi
echo ""

# 测试 3: 尝试 SSH 连接（使用 sshpass）
echo "[3/4] 测试 SSH 密码登录..."
if command -v sshpass > /dev/null 2>&1; then
    if sshpass -p "$ROOT_PASSWORD" ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 root@$SERVER_IP "echo 'SSH 连接成功'" 2>&1; then
        echo "✓ SSH 密码登录成功"
    else
        echo "✗ SSH 密码登录失败"
        echo "  可能原因:"
        echo "  1. 密码不正确"
        echo "  2. 服务器禁止 root 密码登录"
        echo "  3. SSH 服务未运行"
    fi
else
    echo "⚠ 未安装 sshpass，跳过密码测试"
    echo "  安装: apt-get install sshpass (Ubuntu/Debian)"
    echo "       brew install sshpass (macOS)"
fi
echo ""

# 测试 4: 检查 SSH 配置
echo "[4/4] 检查 SSH 配置建议..."
echo ""
echo "如果连接失败，请检查服务器上的以下配置:"
echo ""
echo "1. 检查 /etc/ssh/sshd_config:"
echo "   - PermitRootLogin yes"
echo "   - PasswordAuthentication yes"
echo ""
echo "2. 重启 SSH 服务:"
echo "   systemctl restart sshd"
echo ""
echo "3. 检查防火墙:"
echo "   iptables -L | grep 22"
echo "   ufw status"
echo ""
echo "=========================================="
