import Parser from "rss-parser";
import { db, tweetsStore, twitterTrendsStore } from "./db";

const rssParser = new Parser();

// RSSHub Twitter RSS 源配置
const TWITTER_RSS_SOURCES = {
  // AI 领域重要人物和机构
  accounts: [
    { username: "sama", name: "Sam Altman", category: "OpenAI" },
    { username: "karpathy", name: "Andrej Karpathy", category: "AI研究" },
    { username: "ylecun", name: "Yann LeCun", category: "Meta AI" },
    { username: "AndrewYNg", name: "吴恩达", category: "AI教育" },
    { username: "drfeifei", name: "李飞飞", category: "AI研究" },
    { username: "eladgil", name: "Elad Gil", category: "投资" },
    { username: "OpenAI", name: "OpenAI", category: "公司" },
    { username: "DeepMind", name: "Google DeepMind", category: "公司" },
    { username: "AnthropicAI", name: "Anthropic", category: "公司" },
    { username: "MetaAI", name: "Meta AI", category: "公司" },
  ],
  // AI 相关话题搜索
  topics: [
    "artificial intelligence",
    "machine learning",
    "ChatGPT",
    "Claude AI",
    "AI Agent",
  ],
};

// 模拟推文数据生成（实际使用时替换为真实 API 调用）
function generateMockTweets() {
  const mockTweets = [
    {
      id: `tw_${Date.now()}_1`,
      content: "GPT-5 的推理能力简直令人惊叹。刚刚测试了它在复杂数学问题上的表现，准确率比 GPT-4 提升了 40% 以上。AI 的发展速度真的超出了所有人的预期。",
      author: {
        name: "Andrej Karpathy",
        username: "karpathy",
        verified: true,
      },
      publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      likes: 15420 + Math.floor(Math.random() * 1000),
      retweets: 3421 + Math.floor(Math.random() * 500),
      replies: 892 + Math.floor(Math.random() * 200),
      views: 456000 + Math.floor(Math.random() * 50000),
      hashtags: ["AI", "GPT5", "OpenAI"],
      mentions: [],
      urls: [],
      isHot: true,
      sentiment: "positive" as const,
    },
    {
      id: `tw_${Date.now()}_2`,
      content: "刚刚体验了 Claude 3.5 的新功能，代码生成质量有了质的飞跃。特别是对于复杂架构设计，它的理解能力让我印象深刻。",
      author: {
        name: "吴恩达",
        username: "AndrewYNg",
        verified: true,
      },
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      likes: 12300 + Math.floor(Math.random() * 1000),
      retweets: 2800 + Math.floor(Math.random() * 500),
      replies: 650 + Math.floor(Math.random() * 200),
      views: 320000 + Math.floor(Math.random() * 50000),
      hashtags: ["Claude", "AI", "Coding"],
      mentions: [],
      urls: [],
      isHot: true,
      sentiment: "positive" as const,
    },
    {
      id: `tw_${Date.now()}_3`,
      content: "AI Agent 赛道今年融资额已经突破 50 亿美元。从自主浏览器到编程助手，这个领域的创新速度令人瞩目。",
      author: {
        name: "Elad Gil",
        username: "eladgil",
        verified: true,
      },
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      likes: 8900 + Math.floor(Math.random() * 1000),
      retweets: 2100 + Math.floor(Math.random() * 500),
      replies: 420 + Math.floor(Math.random() * 200),
      views: 280000 + Math.floor(Math.random() * 50000),
      hashtags: ["AIAgent", "VentureCapital", "Startup"],
      mentions: [],
      urls: [],
      isHot: false,
      sentiment: "positive" as const,
    },
    {
      id: `tw_${Date.now()}_4`,
      content: "具身智能的突破正在加速。Figure AI 的最新演示显示，他们的机器人已经能够完成复杂的装配任务。这比我们预期的要快得多。",
      author: {
        name: "李飞飞",
        username: "drfeifei",
        verified: true,
      },
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      likes: 15600 + Math.floor(Math.random() * 1000),
      retweets: 3800 + Math.floor(Math.random() * 500),
      replies: 920 + Math.floor(Math.random() * 200),
      views: 520000 + Math.floor(Math.random() * 50000),
      hashtags: ["Robotics", "EmbodiedAI", "FigureAI"],
      mentions: [],
      urls: [],
      isHot: true,
      sentiment: "positive" as const,
    },
    {
      id: `tw_${Date.now()}_5`,
      content: "Midjourney V7 的 3D 场景生成能力让我震惊。输入一段文字描述，几秒钟就能生成可用于游戏开发的 3D 场景。创意产业的变革正在加速。",
      author: {
        name: "Sam Altman",
        username: "sama",
        verified: true,
      },
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      likes: 22100 + Math.floor(Math.random() * 1000),
      retweets: 5600 + Math.floor(Math.random() * 500),
      replies: 1200 + Math.floor(Math.random() * 200),
      views: 780000 + Math.floor(Math.random() * 50000),
      hashtags: ["Midjourney", "AI", "3D"],
      mentions: [],
      urls: [],
      isHot: true,
      sentiment: "positive" as const,
    },
    {
      id: `tw_${Date.now()}_6`,
      content: "开源模型正在迎头赶上。Llama 4 的性能在某些基准测试上已经超过了 GPT-4，这对于整个 AI 生态系统来说是一个巨大的胜利。",
      author: {
        name: "Yann LeCun",
        username: "ylecun",
        verified: true,
      },
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      likes: 18900 + Math.floor(Math.random() * 1000),
      retweets: 4300 + Math.floor(Math.random() * 500),
      replies: 1100 + Math.floor(Math.random() * 200),
      views: 650000 + Math.floor(Math.random() * 50000),
      hashtags: ["Llama", "OpenSource", "AI"],
      mentions: [],
      urls: [],
      isHot: false,
      sentiment: "positive" as const,
    },
  ];

  return mockTweets;
}

// 生成 Twitter 趋势
function generateTwitterTrends() {
  return [
    { id: `tt_${Date.now()}_1`, name: "GPT-5", query: "GPT-5", tweetVolume: 985000 + Math.floor(Math.random() * 50000), rank: 1, category: "AI模型" },
    { id: `tt_${Date.now()}_2`, name: "AI Agent", query: "AIAgent", tweetVolume: 756000 + Math.floor(Math.random() * 50000), rank: 2, category: "应用" },
    { id: `tt_${Date.now()}_3`, name: "Claude 3.5", query: "Claude", tweetVolume: 642000 + Math.floor(Math.random() * 50000), rank: 3, category: "AI模型" },
    { id: `tt_${Date.now()}_4`, name: "具身智能", query: "EmbodiedAI", tweetVolume: 534000 + Math.floor(Math.random() * 50000), rank: 4, category: "机器人" },
    { id: `tt_${Date.now()}_5`, name: "Midjourney V7", query: "Midjourney", tweetVolume: 423000 + Math.floor(Math.random() * 50000), rank: 5, category: "图像生成" },
    { id: `tt_${Date.now()}_6`, name: "Sora", query: "Sora", tweetVolume: 389000 + Math.floor(Math.random() * 50000), rank: 6, category: "视频生成" },
    { id: `tt_${Date.now()}_7`, name: "Llama 4", query: "Llama4", tweetVolume: 312000 + Math.floor(Math.random() * 50000), rank: 7, category: "开源" },
    { id: `tt_${Date.now()}_8`, name: "AI编程", query: "AICoding", tweetVolume: 298000 + Math.floor(Math.random() * 50000), rank: 8, category: "开发工具" },
  ];
}

// 抓取 Twitter 数据
export async function crawlTwitter() {
  const startTime = new Date();
  
  try {
    // 实际使用时，可以通过以下方式获取真实数据：
    // 1. Twitter API v2 (需要申请开发者账号)
    // 2. RSSHub (自建或公共实例)
    // 3. Nitter (Twitter 镜像)
    
    // 这里使用模拟数据
    const newTweets = generateMockTweets();
    const newTrends = generateTwitterTrends();
    
    // 更新推文存储
    tweetsStore.length = 0;
    tweetsStore.push(...newTweets);
    
    // 更新趋势存储
    twitterTrendsStore.length = 0;
    twitterTrendsStore.push(...newTrends);
    
    console.log(`✅ Twitter 数据更新完成: ${newTweets.length} 条推文, ${newTrends.length} 个趋势`);
    
    return { 
      success: true, 
      tweetsCount: newTweets.length,
      trendsCount: newTrends.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("❌ Twitter 抓取失败:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

// 分析推文情感
export function analyzeSentiment(content: string): "positive" | "neutral" | "negative" {
  const positiveWords = ["amazing", "great", "excellent", "impressive", "breakthrough", "awesome", "fantastic", "love", "best", "incredible", "令人惊叹", "优秀", "突破", "震惊", "印象深刻"];
  const negativeWords = ["bad", "terrible", "awful", "disappointing", "worst", "hate", "problem", "issue", "concern", "糟糕", "失望", "问题", "担忧"];
  
  const lowerContent = content.toLowerCase();
  let positiveScore = 0;
  let negativeScore = 0;
  
  positiveWords.forEach(word => {
    if (lowerContent.includes(word.toLowerCase())) positiveScore++;
  });
  
  negativeWords.forEach(word => {
    if (lowerContent.includes(word.toLowerCase())) negativeScore++;
  });
  
  if (positiveScore > negativeScore) return "positive";
  if (negativeScore > positiveScore) return "negative";
  return "neutral";
}

// 提取热门推文
export function getHotTweets(limit: number = 10) {
  return tweetsStore
    .filter(t => t.isHot || (t.likes > 10000 && t.retweets > 2000))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

// 提取话题标签
export function extractHashtags(content: string): string[] {
  const hashtagRegex = /#(\w+)/g;
  const matches = content.match(hashtagRegex);
  return matches ? matches.map(tag => tag.slice(1)) : [];
}

// 提取提及
export function extractMentions(content: string): string[] {
  const mentionRegex = /@(\w+)/g;
  const matches = content.match(mentionRegex);
  return matches ? matches.map(mention => mention.slice(1)) : [];
}
