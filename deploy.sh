#!/bin/bash

# NewClaw 部署脚本
# 使用方法: 将此脚本上传到服务器并执行: bash deploy.sh

set -e  # 遇到错误立即退出

echo "=========================================="
echo "     NewClaw 自动部署脚本"
echo "=========================================="
echo ""

# 配置
PROJECT_DIR="/home/admin/newclaw-pro"
REPO_URL="https://github.com/btcloong/newclaw-pro.git"
BRANCH="main"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否在正确的目录
check_directory() {
    echo -e "${YELLOW}[1/8] 检查项目目录...${NC}"
    
    if [ ! -d "$PROJECT_DIR" ]; then
        echo -e "${YELLOW}项目目录不存在，正在创建...${NC}"
        mkdir -p "$PROJECT_DIR"
        cd "$PROJECT_DIR"
        git clone "$REPO_URL" .
    else
        cd "$PROJECT_DIR"
        
        # 检查是否是 git 仓库
        if [ ! -d ".git" ]; then
            echo -e "${RED}错误: 目录存在但不是 git 仓库${NC}"
            echo -e "${YELLOW}正在重新克隆...${NC}"
            cd /home/admin
            rm -rf newclaw-pro
            git clone "$REPO_URL" newclaw-pro
            cd newclaw-pro
        fi
    fi
    
    echo -e "${GREEN}✓ 目录检查完成${NC}"
    echo ""
}

# 拉取最新代码
pull_code() {
    echo -e "${YELLOW}[2/8] 拉取最新代码...${NC}"
    
    git fetch origin
    git reset --hard origin/$BRANCH
    
    echo -e "${GREEN}✓ 代码更新完成${NC}"
    echo "当前版本: $(git rev-parse --short HEAD)"
    echo ""
}

# 安装依赖
install_dependencies() {
    echo -e "${YELLOW}[3/8] 安装依赖...${NC}"
    
    # 使用 npm ci 如果存在 package-lock.json，否则使用 npm install
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    echo -e "${GREEN}✓ 依赖安装完成${NC}"
    echo ""
}

# 设置环境变量
setup_env() {
    echo -e "${YELLOW}[4/8] 设置环境变量...${NC}"
    
    # 检查 .env.local 是否存在
    if [ ! -f ".env.local" ]; then
        echo -e "${YELLOW}创建 .env.local 文件...${NC}"
        
        # 提示输入 API Key
        read -p "请输入 GEMINI_API_KEY (直接回车跳过): " gemini_key
        read -p "请输入 API_KEY (直接回车跳过): " api_key
        
        if [ ! -z "$gemini_key" ]; then
            echo "GEMINI_API_KEY=$gemini_key" > .env.local
        fi
        
        if [ ! -z "$api_key" ]; then
            echo "API_KEY=$api_key" >> .env.local
        fi
    else
        echo -e "${GREEN}✓ 环境变量文件已存在${NC}"
    fi
    
    echo ""
}

# 构建应用
build_app() {
    echo -e "${YELLOW}[5/8] 构建应用...${NC}"
    
    npm run build
    
    echo -e "${GREEN}✓ 构建完成${NC}"
    echo ""
}

# 检查 PM2 状态
check_pm2() {
    echo -e "${YELLOW}[6/8] 检查 PM2 状态...${NC}"
    
    if ! command -v pm2 &> /dev/null; then
        echo -e "${YELLOW}PM2 未安装，正在安装...${NC}"
        npm install -g pm2
    fi
    
    echo -e "${GREEN}✓ PM2 检查完成${NC}"
    echo ""
}

# 重启应用
restart_app() {
    echo -e "${YELLOW}[7/8] 重启应用...${NC}"
    
    # 检查应用是否在运行
    if pm2 list | grep -q "newclaw-pro"; then
        echo "应用正在运行，执行重启..."
        pm2 restart newclaw-pro
    else
        echo "应用未运行，启动应用..."
        pm2 start "npm start" --name newclaw-pro
    fi
    
    # 保存 PM2 配置
    pm2 save
    
    echo -e "${GREEN}✓ 应用重启完成${NC}"
    echo ""
}

# 检查部署状态
check_status() {
    echo -e "${YELLOW}[8/8] 检查部署状态...${NC}"
    echo ""
    
    # 等待几秒让应用启动
    sleep 3
    
    # 检查端口是否在监听
    if netstat -tlnp 2>/dev/null | grep -q ":3000"; then
        echo -e "${GREEN}✓ 应用正在端口 3000 上运行${NC}"
    elif ss -tlnp 2>/dev/null | grep -q ":3000"; then
        echo -e "${GREEN}✓ 应用正在端口 3000 上运行${NC}"
    else
        echo -e "${YELLOW}⚠ 无法确认应用状态，请手动检查${NC}"
    fi
    
    echo ""
    echo "PM2 状态:"
    pm2 status
    
    echo ""
    echo "=========================================="
    echo -e "${GREEN}     部署完成!${NC}"
    echo "=========================================="
    echo ""
    echo "网站地址:"
    echo "  - https://newclaw.com"
    echo "  - http://47.236.188.95"
    echo ""
    echo "查看日志:"
    echo "  pm2 logs newclaw-pro"
    echo ""
    echo "管理命令:"
    echo "  pm2 stop newclaw-pro    # 停止"
    echo "  pm2 restart newclaw-pro # 重启"
    echo "  pm2 delete newclaw-pro  # 删除"
    echo ""
}

# 主函数
main() {
    echo "开始部署时间: $(date)"
    echo ""
    
    check_directory
    pull_code
    install_dependencies
    setup_env
    build_app
    check_pm2
    restart_app
    check_status
    
    echo "部署完成时间: $(date)"
}

# 执行主函数
main
