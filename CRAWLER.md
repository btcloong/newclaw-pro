# NewClaw 自动新闻抓取系统

## 概述

NewClaw 现在拥有完整的自动新闻抓取和定时更新机制，支持 100+ RSS 数据源，按优先级智能抓取，数据持久化存储。

## 数据源统计

- **总计**: 100+ 数据源
- **英文源**: 70+ (AI公司官方博客、科技媒体、学术机构)
- **中文源**: 30+ (机器之心、量子位、雷锋网等)
- **优先级分布**:
  - 高频源 (high): 50+ (每30分钟)
  - 中频源 (medium): 30+ (每2小时)
  - 低频源 (low): 20+ (每6小时)

## 数据源分类

### 英文权威源 (50+)
- **AI公司官方博客**: OpenAI, Anthropic, Google AI, DeepMind, Meta AI, xAI, Mistral, Cohere, Hugging Face, Stability AI
- **科技媒体**: TechCrunch AI, The Verge AI, Wired AI, MIT Technology Review, VentureBeat AI
- **学术机构**: Berkeley AI, Stanford HAI, MIT CSAIL, CMU AI, Papers With Code
- **技术博客**: Simon Willison, Paul Graham, Dan Abramov, Gwern 等

### 中文权威源 (30+)
- **AI媒体**: 机器之心, 量子位, 雷锋网 AI, 新智元
- **科技媒体**: 36氪, 虎嗅, 品玩, Solidot
- **技术博客**: 阮一峰, 酷壳, 张鑫旭
- **研究机构**: 腾讯AI Lab, 阿里达摩院, 百度研究院, 智源研究院

### 社交媒体/社区 (20+)
- Reddit r/MachineLearning, r/LocalLLaMA
- Hacker News AI
- GitHub Trending
- Product Hunt AI

## 定时更新机制

### GitHub Actions 工作流

1. **增量抓取** (`.github/workflows/crawl.yml`)
   - 触发频率: 每30分钟
   - 抓取策略: 根据优先级自动判断需要抓取的源
   - 环境变量: `GEMINI_API_KEY`, `VERCEL_URL`

2. **全量抓取** (`.github/workflows/daily-crawl.yml`)
   - 触发频率: 每天凌晨3点
   - 抓取策略: 抓取所有数据源
   - 额外处理: 批量AI处理、趋势总结生成

### API 端点

- `POST /api/crawl` - 触发爬虫
  - 参数: `{ type: 'auto' | 'full' | 'high' | 'medium' | 'low', processAI: boolean, generateTrends: boolean }`
- `GET /api/crawl` - 获取爬虫状态
- `GET /api/sources` - 获取数据源统计

### 数据流

```
GitHub Actions (每30分钟)
    ↓
调用 /api/crawl (type=auto)
    ↓
根据时间间隔判断需要抓取的源
    ↓
抓取 RSS (并发控制)
    ↓
去重检查 (URL哈希)
    ↓
存储到文件 (data/news.json)
    ↓
AI处理 (Gemini API)
    ↓
更新趋势总结
```

## 数据存储

### 文件存储结构
```
data/
├── news.json          # 新闻数据 (保留7天)
├── projects.json      # 项目数据
├── research.json      # 研究报告
├── hot-topics.json    # 热门话题
├── funding.json       # 融资信息
├── tweets.json        # Twitter数据
├── twitter-trends.json # Twitter趋势
├── trend-summary.json # 每日趋势总结
├── crawl-state.json   # 爬虫状态
└── seen-urls.json     # 已抓取URL去重
```

### 数据保留策略
- 新闻数据: 保留最近7天
- 已见URL: 保留最近10000个
- 历史数据: 通过GitHub Artifacts保留30天

## AI 自动解读流程

```
RSS 抓取 → 去重过滤 → AI 评分 → AI 摘要 → AI 分类 → 存储 → 展示
```

### 优先级处理
- **高优先级源**: 立即AI处理 (官方博客)
- **中优先级源**: 批量处理 (每10篇一批)
- **低优先级源**: 延迟处理 (夜间批量)

## 环境变量

```bash
# 必需
GEMINI_API_KEY=your_gemini_api_key
VERCEL_URL=https://your-app.vercel.app

# 可选
DATA_DIR=/path/to/data  # 默认: ./data
```

## 本地开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 手动触发爬虫
curl -X POST http://localhost:3000/api/crawl \
  -H "Content-Type: application/json" \
  -d '{"type":"full","processAI":true}'

# 查看爬虫状态
curl http://localhost:3000/api/crawl
```

## 部署

1. 部署到 Vercel
2. 设置环境变量 `GEMINI_API_KEY` 和 `VERCEL_URL`
3. GitHub Actions 会自动运行定时任务

## 监控

- 爬虫状态: `GET /api/crawl`
- 数据源统计: `GET /api/sources`
- GitHub Actions 运行日志: Actions 标签页
