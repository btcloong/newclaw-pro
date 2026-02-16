#!/bin/bash
# 健壮的启动脚本

cd /home/admin/newclaw-pro

# 加载环境变量
export PATH="/home/admin/.nvm/versions/node/v20.0.0/bin:/usr/local/bin:$PATH"

# 检查 node_modules
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# 检查 .env.local
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local..."
    echo 'GEMINI_API_KEY=AIzaSyAic3PWhq8eWyEKr_V41FqbJ_0MC_ZImAs' > .env.local
    echo 'API_KEY=newclaw_secret_key_2026' >> .env.local
fi

# 检查构建
if [ ! -d ".next" ]; then
    echo "Building application..."
    npm run build
fi

# 停止旧进程
pm2 delete newclaw-pro 2>/dev/null || true

# 等待端口释放
sleep 2

# 启动应用
echo "Starting application..."
pm2 start npm --name newclaw-pro -- start

# 保存配置
pm2 save

# 显示状态
echo "Application status:"
pm2 status

# 等待应用启动
sleep 3

# 测试本地连接
if curl -s http://localhost:3000 > /dev/null; then
    echo "✓ Application is running on port 3000"
else
    echo "✗ Application failed to start"
    echo "Checking logs..."
    pm2 logs newclaw-pro --lines 20
fi
