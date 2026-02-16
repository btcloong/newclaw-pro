# NewClaw 服务器部署命令
# 复制以下命令到服务器执行

cd /home/admin/newclaw-pro && \
git fetch origin && \
git reset --hard origin/main && \
npm install && \
echo 'GEMINI_API_KEY=AIzaSyAic3PWhq8eWyEKr_V41FqbJ_0MC_ZImAs' > .env.local && \
echo 'API_KEY=newclaw_secret_key_2026' >> .env.local && \
npm run build && \
pm2 delete newclaw-pro 2>/dev/null || true && \
pm2 start "npm start" --name newclaw-pro && \
pm2 save && \
pm2 status

# 或者下载并执行脚本:
# curl -O https://raw.githubusercontent.com/btcloong/newclaw-pro/main/server-deploy.sh
# bash server-deploy.sh
