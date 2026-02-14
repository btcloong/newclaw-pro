module.exports = {
  apps: [{
    name: 'newclaw-pro',
    script: './node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/root/newclaw-pro',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    // 日志配置
    log_file: '/var/log/newclaw/combined.log',
    out_file: '/var/log/newclaw/out.log',
    error_file: '/var/log/newclaw/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    // 内存限制和自动重启
    max_memory_restart: '1G',
    min_uptime: '10s',
    max_restarts: 5,
    // 优雅重启
    kill_timeout: 5000,
    listen_timeout: 10000,
    // 自动重启策略
    autorestart: true,
    restart_delay: 3000,
  }]
};
