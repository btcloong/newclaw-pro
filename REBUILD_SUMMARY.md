# NewClaw Pro v2.0 - AI Daily Digest 重构版

## 重构总结

本次重构全面融合了 AI Daily Digest 的核心优势，实现了以下功能升级：

### 1. 数据源扩展 ✅
- **添加了 90 个 Hacker News 顶级技术博客 RSS 源**（源自 Andrej Karpathy 推荐）
  - AI/ML 研究：OpenAI、Anthropic、DeepMind、Google AI、Hugging Face、arXiv 等
  - 工程/系统：Netflix、Uber、Meta、Stripe、Airbnb、Spotify、LinkedIn、Cloudflare 等
  - 开发工具/开源：GitHub、GitLab、Rust、Go、React、Vercel、Deno、Kubernetes 等
  - 安全：Google Security、Cloudflare Security、Microsoft Security、AWS Security 等
  - 数据库/基础设施：PostgreSQL、MySQL、MongoDB、Redis、Elastic、Kafka 等
  - 技术媒体：TechCrunch、The Verge、Wired、Hacker News、Slashdot 等
  - 开发者博客：Martin Fowler、Paul Graham、Dan Luu、Julia Evans 等
- **保留了现有的中文科技媒体源**：36氪、品玩、Solidot、爱范儿、极客公园、机器之心、量子位等 20 个
- **实现中英文双语内容聚合**

### 2. AI 智能处理系统 ✅
- **接入 Gemini API** 进行文章评分（相关性、质量、时效性三维度 1-10 分）
- **AI 自动分类**：AI/ML、安全、工程、工具、开源、观点、其他
- **生成中文标题翻译**
- **生成 4-6 句结构化摘要**
- **生成推荐理由**（为什么值得读）
- **提取 2-4 个关键词**
- **生成"今日看点"宏观趋势总结**

### 3. 数据库扩展 ✅
- 扩展 NewsItem 接口，添加 AI 处理字段
- 添加评分、分类、摘要、推荐理由、关键词等字段
- 实现 AI 处理状态追踪（pending/processing/completed/failed）

### 4. 爬虫系统优化 ✅
- **并发控制**：10路并发，15秒超时
- **RSS 2.0 和 Atom 双格式解析**
- **错误处理和重试机制**：最大重试 3 次，带指数退避
- 自定义 RSS 解析器，支持多种媒体字段

### 5. 前端界面升级 ✅
- **新增"今日必读"专区**：展示 AI 评分 Top 3 的文章
- **添加"今日看点"趋势总结板块**：AI 生成的宏观趋势分析
- **显示 AI 评分**：三维度展示（相关性、质量、时效性）
- **显示分类标签和关键词**
- **显示推荐理由**
- **添加数据可视化**：分类分布、关键词云
- **优化新闻卡片设计**：更丰富的信息展示

### 6. API 扩展 ✅
- **新增 `/api/ai-process`**：用于 AI 处理文章
  - POST：处理单篇或批量处理
  - GET：获取处理状态、待处理文章列表
- **扩展 `/api/crawl`**：集成 AI 处理流程
  - POST：触发抓取并可选进行 AI 处理
- **新增 `/api/trends`**：返回趋势总结
  - GET：获取当前趋势总结
  - POST：重新生成趋势总结

### 7. 配置和部署 ✅
- **添加 `GEMINI_API_KEY` 环境变量配置**
- **更新 GitHub Actions 工作流**：
  - 添加环境变量传递
  - 更新部署脚本
- **确保构建和部署正常**：构建成功，所有页面正常工作

## 文件变更列表

### 新增文件
- `src/lib/rss-sources.ts` - 90+ RSS 源配置
- `src/lib/ai-processor.ts` - AI 处理系统
- `src/app/api/ai-process/route.ts` - AI 处理 API
- `src/app/api/trends/route.ts` - 趋势总结 API
- `src/components/ai-news-card.tsx` - AI 新闻卡片组件
- `src/components/trend-summary.tsx` - 趋势总结组件
- `src/components/today-must-read.tsx` - 今日必读组件
- `src/components/ui/progress.tsx` - 进度条组件
- `src/components/ui/skeleton.tsx` - 骨架屏组件
- `scripts/ai-process.ts` - AI 处理脚本

### 修改文件
- `src/lib/db.ts` - 扩展数据库接口，添加 AI 字段
- `src/lib/crawler.ts` - 优化爬虫系统，添加并发控制
- `src/app/page.tsx` - 升级首页，添加 AI 功能展示
- `src/app/api/crawl/route.ts` - 扩展 API，集成 AI 处理
- `src/app/api/news/route.ts` - 更新新闻 API
- `src/app/news/[id]/page.tsx` - 升级新闻详情页
- `src/app/hot/page.tsx` - 升级热点页面
- `package.json` - 添加依赖（@google/generative-ai、@radix-ui/react-progress）
- `.github/workflows/deploy.yml` - 更新部署配置
- `next.config.mjs` - 更新构建配置

## 环境变量配置

```bash
# Gemini API Key（必需）
GEMINI_API_KEY=your_gemini_api_key

# API Key（可选，用于保护 API 端点）
API_KEY=your_api_key
```

## API 端点

### 抓取 API
```bash
POST /api/crawl
Body: { "processAI": true, "generateTrends": true }
```

### AI 处理 API
```bash
# 获取状态
GET /api/ai-process

# 获取待处理文章
GET /api/ai-process?action=pending&limit=10

# 处理单篇文章
POST /api/ai-process
Body: { "articleId": "xxx" }

# 批量处理
POST /api/ai-process
Body: { "processAll": true, "limit": 10 }
```

### 趋势 API
```bash
# 获取趋势总结
GET /api/trends

# 重新生成趋势
POST /api/trends
```

### 新闻 API
```bash
# 获取新闻列表
GET /api/news?limit=50&category=AI/ML&aiProcessed=true
```

## 构建和部署

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 启动
npm start
```

## 版本
- 版本号：2.0.0
- 更新日期：2026-02-15
