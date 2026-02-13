# Twitter 数据抓取配置指南

## 概述

NewClaw Pro 已集成 Twitter 数据抓取功能，支持以下特性：

- 追踪 AI 领域重要人物和机构的推文
- 热门推文分析（基于互动数据）
- AI 话题趋势追踪
- 情感分析

## 数据源

### 追踪的 Twitter 账号

| 账号 | 名称 | 类别 |
|------|------|------|
| @sama | Sam Altman | OpenAI |
| @karpathy | Andrej Karpathy | AI研究 |
| @ylecun | Yann LeCun | Meta AI |
| @AndrewYNg | 吴恩达 | AI教育 |
| @drfeifei | 李飞飞 | AI研究 |
| @eladgil | Elad Gil | 投资 |
| @OpenAI | OpenAI | 公司 |
| @DeepMind | Google DeepMind | 公司 |
| @AnthropicAI | Anthropic | 公司 |
| @MetaAI | Meta AI | 公司 |

### 追踪的话题标签

- #ArtificialIntelligence
- #MachineLearning
- #ChatGPT
- #ClaudeAI
- #AIAgent
- #GPT5
- #OpenAI

## 配置方式

### 方式一：使用 Twitter API v2（推荐）

1. 申请 Twitter Developer 账号
   - 访问 https://developer.twitter.com
   - 创建项目和应用
   - 获取 API Key 和 Secret

2. 配置环境变量
```bash
# 在服务器上设置
export TWITTER_API_KEY=your_api_key
export TWITTER_API_SECRET=your_api_secret
export TWITTER_BEARER_TOKEN=your_bearer_token
```

3. 修改爬虫代码
编辑 `src/lib/twitter-crawler.ts`，使用真实 API：
```typescript
// 替换 generateMockTweets() 为真实 API 调用
const response = await fetch(
  `https://api.twitter.com/2/tweets/search/recent?query=artificial intelligence`,
  {
    headers: {
      Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
    },
  }
);
```

### 方式二：使用 RSSHub（免费）

1. 自建 RSSHub 实例或使用公共实例
   - 公共实例: https://rsshub.app
   - 自建: https://docs.rsshub.app

2. RSSHub Twitter 路由
```
https://rsshub.app/twitter/user/:username
https://rsshub.app/twitter/keyword/:keyword
```

3. 修改爬虫代码
```typescript
const RSS_SOURCES = {
  accounts: [
    "https://rsshub.app/twitter/user/sama",
    "https://rsshub.app/twitter/user/karpathy",
    // ...
  ],
  topics: [
    "https://rsshub.app/twitter/keyword/artificial intelligence",
    // ...
  ],
};
```

### 方式三：使用 Nitter（镜像站）

1. 使用 Nitter 实例
   - 公共实例列表: https://github.com/zedeus/nitter/wiki/Instances

2. Nitter RSS 路由
```
https://nitter.net/username/rss
```

## 抓取频率

默认配置：
- 推文更新：每 15 分钟
- 趋势更新：每 30 分钟
- 热门推文分析：每 30 分钟

修改定时任务：
```bash
crontab -e

# 每15分钟抓取 Twitter
*/15 * * * * /var/www/newclaw-pro/update-data.sh
```

## 数据字段

### Tweet 对象
```typescript
interface Tweet {
  id: string;
  content: string;
  author: {
    name: string;
    username: string;
    avatar?: string;
    verified?: boolean;
  };
  publishedAt: string;
  likes: number;
  retweets: number;
  replies: number;
  views?: number;
  hashtags: string[];
  mentions: string[];
  urls: string[];
  isHot?: boolean;
  sentiment?: "positive" | "neutral" | "negative";
}
```

### TwitterTrend 对象
```typescript
interface TwitterTrend {
  id: string;
  name: string;
  query: string;
  tweetVolume: number;
  rank: number;
  category?: string;
}
```

## 热门推文算法

推文热度评分公式：
```
热度分 = likes * 1 + retweets * 2 + replies * 3 + views * 0.001

isHot = 热度分 > 10000 且 发布时间 < 24小时
```

## 情感分析

基于关键词的简单情感分析：

正面词汇：amazing, great, excellent, impressive, breakthrough, awesome, fantastic, love, best, incredible...

负面词汇：bad, terrible, awful, disappointing, worst, hate, problem, issue, concern...

## 手动触发抓取

```bash
# 抓取所有数据
npm run crawl

# 仅抓取 Twitter
npm run crawl:twitter

# 查看日志
tail -f /var/log/newclaw/crawl.log
```

## 故障排查

### 抓取失败

1. 检查网络连接
2. 检查 API 配额
3. 查看错误日志

### 数据未更新

1. 检查定时任务: `crontab -l`
2. 手动运行测试: `npm run crawl:twitter`
3. 检查权限: `ls -la /var/www/newclaw-pro/`

## 扩展功能

### 添加更多追踪账号

编辑 `src/lib/twitter-crawler.ts`：
```typescript
const TWITTER_RSS_SOURCES = {
  accounts: [
    // 添加新账号
    { username: "newuser", name: "New User", category: "类别" },
  ],
};
```

### 自定义热门算法

修改 `getHotTweets()` 函数：
```typescript
export function getHotTweets(limit: number = 10) {
  return tweetsStore
    .filter(t => {
      const score = t.likes + t.retweets * 2 + t.replies * 3;
      return score > YOUR_THRESHOLD;
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}
```

## 注意事项

1. **API 限制**: Twitter API v2 有请求频率限制，注意控制抓取频率
2. **隐私合规**: 遵守 Twitter 使用条款和隐私政策
3. **数据存储**: 当前使用内存存储，重启后数据会重置
4. **备用方案**: 建议同时配置多种数据源作为备份

## 相关文件

- `src/lib/twitter-crawler.ts` - 爬虫逻辑
- `src/lib/db.ts` - 数据存储
- `src/app/twitter/page.tsx` - Twitter 页面
- `src/components/tweet-card.tsx` - 推文组件
- `src/components/twitter-trends-list.tsx` - 趋势组件
