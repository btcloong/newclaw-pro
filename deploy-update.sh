#!/bin/bash

# Deploy script for NewClaw

cd /home/admin/newclaw-pro

echo "=== Pulling latest code ==="
git pull origin main

echo "=== Installing dependencies ==="
npm install

echo "=== Building application ==="
npm run build

echo "=== Restarting PM2 ==="
pm2 restart newclaw-pro

echo "=== Deployment complete ==="
