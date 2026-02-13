#!/bin/bash
# SSL 证书配置脚本

set -e

DOMAIN="${1:-}"
EMAIL="${2:-}"

if [ -z "$DOMAIN" ]; then
    echo "用法: ./setup-ssl.sh your-domain.com your-email@example.com"
    echo ""
    echo "示例:"
    echo "  ./setup-ssl.sh newclaw.example.com admin@example.com"
    exit 1
fi

if [ -z "$EMAIL" ]; then
    echo "请提供邮箱地址用于 SSL 证书通知"
    exit 1
fi

echo "=========================================="
echo "  SSL 证书配置"
echo "=========================================="
echo "域名: $DOMAIN"
echo "邮箱: $EMAIL"
echo ""

# 更新 Nginx 配置中的域名
sed -i "s/server_name _;/server_name $DOMAIN;/" /etc/nginx/sites-available/newclaw-pro
nginx -t && systemctl reload nginx

# 申请证书
certbot --nginx -d $DOMAIN --email $EMAIL --agree-tos --non-interactive

# 设置自动续期
echo "0 0,12 * * * root certbot renew --quiet" | tee /etc/cron.d/certbot-renew > /dev/null

echo ""
echo "SSL 证书配置完成!"
echo "访问地址: https://$DOMAIN"
