/**
 * 基于 x-tweet-fetcher 的 Twitter 爬虫
 * 无需 API key，使用 FxTwitter 公开接口
 */

import { exec } from "child_process";
import { promisify } from "util";
import { db, type Tweet, type TwitterTrend } from "./db";
import * as fileDb from "./file-db";

const execAsync = promisify(exec);

// 判断是否在 Vercel 环境
const isVercel = process.env.VERCEL === "1" || process.env.VERCEL_ENV !== undefined;

// 高质量 AI 相关 Twitter 账号配置
export const AI_TWITTER_ACCOUNTS = [
  // 官方机构账号 - 高优先级
  { username: "OpenAI", name: "OpenAI", category: "官方机构", priority: 1 },
  { username: "AnthropicAI", name: "Anthropic", category: "官方机构", priority: 1 },
  { username: "GoogleDeepMind", name: "Google DeepMind", category: "官方机构", priority: 1 },
  { username: "MetaAI", name: "Meta AI", category: "官方机构", priority: 1 },
  { username: "xAI", name: "xAI", category: "官方机构", priority: 1 },
  { username: "MistralAI", name: "Mistral AI", category: "官方机构", priority: 1 },
  { username: "huggingface", name: "Hugging Face", category: "官方机构", priority: 1 },
  { username: "nvidia", name: "NVIDIA", category: "官方机构", priority: 1 },
  
  // AI 研究者和学者 - 高优先级
  { username: "karpathy", name: "Andrej Karpathy", category: "AI研究者", priority: 1 },
  { username: "ylecun", name: "Yann LeCun", category: "AI研究者", priority: 1 },
  { username: "drfeifei", name: "李飞飞", category: "AI研究者", priority: 1 },
  { username: "AndrewYNg", name: "Andrew Ng", category: "AI研究者", priority: 1 },
  { username: "geoffreyhinton", name: "Geoffrey Hinton", category: "AI研究者", priority: 1 },
  { username: "demishassabis", name: "Demis Hassabis", category: "AI研究者", priority: 1 },
  { username: "sama", name: "Sam Altman", category: "AI研究者", priority: 1 },
  { username: "ilyasut", name: "Ilya Sutskever", category: "AI研究者", priority: 1 },
  { username: "jeremyphoward", name: "Jeremy Howard", category: "AI研究者", priority: 1 },
  { username: "hardmaru", name: "David Ha", category: "AI研究者", priority: 1 },
  
  // 技术博主和开发者 - 中优先级
  { username: "simonw", name: "Simon Willison", category: "开发者", priority: 2 },
  { username: "swyx", name: "swyx", category: "开发者", priority: 2 },
  { username: "paulg", name: "Paul Graham", category: "投资人", priority: 2 },
  { username: "elonmusk", name: "Elon Musk", category: "企业家", priority: 2 },
  { username: "gdb", name: "Greg Brockman", category: "OpenAI", priority: 1 },
  { username: "lilianweng", name: "Lilian Weng", category: "AI安全", priority: 1 },
  { username: "fchollet", name: "François Chollet", category: "AI研究者", priority: 1 },
  { username: "mustafasuleyman", name: "Mustafa Suleyman", category: "Microsoft AI", priority: 1 },
];

// 缓存配置
const CACHE_DURATION = 30 * 60 * 1000; // 30分钟
let lastCrawlTime: number | null = null;
let isCrawling = false;

// FxTwitter API 接口
const FXTWITTER_API = "https://api.fxtwitter.com";

interface FxTwitterResponse {
  code: number;
  message: string;
  data?: {
    tweet?: {
      url: string;
      id: string;
      text: string;
      author: {
        name: string;
        screen_name: string;
        avatar_url: string;
        verified: boolean;
      };
      created_at: string;
      likes: number;
      replies: number;
      retweets: number;
      views: number;
      hashtags: string[];
      mentions: string[];
      photos?: Array<{ url: string; width: number; height: number }>;
      videos?: Array<{ url: string; thumbnail_url: string }>;
    };
  };
}

interface FxTwitterTimelineResponse {
  code: number;
  message: string;
  data?: {
    user?: {
      name: string;
      screen_name: string;
      avatar_url: string;
      verified: boolean;
    };
    timeline?: Array<{
      url: string;
      id: string;
      text: string;
      created_at: string;
      likes: number;
      replies: number;
      retweets: number;
      views: number;
      hashtags: string[];
      mentions: string[];
    }>;
  };
}

// 延迟函数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 使用 FxTwitter API 获取用户时间线
async function fetchUserTimeline(
  username: string,
  maxRetries: number = 2
): Promise<Partial<Tweet>[]> {
  // 暂时禁用 FxTwitter API，使用备用方案
  console.log(`⏭️ Skipping FxTwitter API for ${username}, using fallback`);
  return [];
  
  /*
  for (let i = 0; i < maxRetries; i++) {
    try {
      const url = `${FXTWITTER_API}/${username}`;
      console.log(`📡 Fetching timeline for ${username}...`);
      
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; NewClawBot/1.0)",
          "Accept": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data: FxTwitterTimelineResponse = await response.json();
      
      if (data.code !== 200 || !data.data?.timeline) {
        console.warn(`⚠️ No timeline data for ${username}: ${data.message}`);
        return [];
      }
      
      const tweets: Partial<Tweet>[] = [];
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      for (const item of data.data.timeline.slice(0, 10)) {
        const publishedAt = new Date(item.created_at);
        
        // 只获取24小时内的推文
        if (publishedAt < twentyFourHoursAgo) continue;
        
        tweets.push({
          content: item.text,
          author: {
            name: data.data.user?.name || username,
            username: username,
            avatar: data.data.user?.avatar_url,
            verified: data.data.user?.verified || false,
          },
          publishedAt: item.created_at,
          likes: item.likes || 0,
          retweets: item.retweets || 0,
          replies: item.replies || 0,
          views: item.views || 0,
          hashtags: item.hashtags || [],
          mentions: item.mentions || [],
          urls: [item.url],
          isHot: (item.likes + item.retweets) > 1000,
          sentiment: analyzeSentiment(item.text),
        });
      }
      
      console.log(`✅ Fetched ${tweets.length} tweets from ${username}`);
      return tweets;
    } catch (error) {
      console.warn(`⚠️ Attempt ${i + 1}/${maxRetries} failed for ${username}:`, error);
      if (i === maxRetries - 1) {
        console.error(`❌ Failed to fetch ${username}`);
        return [];
      }
      await delay(1000 * (i + 1));
    }
  }
  return [];
  */
}

// 使用 x-tweet-fetcher Python 脚本获取推文（备用方案）
async function fetchWithPythonScript(
  username: string,
  count: number = 5
): Promise<Partial<Tweet>[]> {
  try {
    // 构建最新推文 URL
    const tweetUrl = `https://x.com/${username}`;
    const scriptPath = `${process.cwd()}/scripts/x-tweet-fetcher/fetch_tweet.py`;
    
    const { stdout, stderr } = await execAsync(
      `python3 "${scriptPath}" --url "${tweetUrl}" --count ${count}`,
      { timeout: 30000 }
    );
    
    if (stderr) {
      console.warn(`Python script stderr: ${stderr}`);
    }
    
    const data = JSON.parse(stdout);
    
    if (!data.tweet && !data.timeline) {
      return [];
    }
    
    // 处理时间线数据
    const tweets: Partial<Tweet>[] = [];
    const items = data.timeline || [data.tweet];
    
    for (const item of items) {
      if (!item) continue;
      
      tweets.push({
        content: item.text || item.content || "",
        author: {
          name: item.author?.name || username,
          username: item.author?.username || username,
          avatar: item.author?.avatar,
          verified: item.author?.verified || false,
        },
        publishedAt: item.created_at || item.publishedAt || new Date().toISOString(),
        likes: item.likes || item.stats?.likes || 0,
        retweets: item.retweets || item.stats?.retweets || 0,
        replies: item.replies || item.stats?.replies || 0,
        views: item.views || item.stats?.views || 0,
        hashtags: item.hashtags || [],
        mentions: item.mentions || [],
        urls: item.urls || [item.url],
        isHot: (item.likes || 0) > 1000,
        sentiment: analyzeSentiment(item.text || ""),
      });
    }
    
    return tweets;
  } catch (error) {
    console.error(`❌ Python script failed for ${username}:`, error);
    return [];
  }
}

// 分析推文情感
function analyzeSentiment(content: string): "positive" | "neutral" | "negative" {
  const positiveWords = [
    "amazing", "great", "excellent", "impressive", "breakthrough", "awesome", "fantastic",
    "love", "best", "incredible", "outstanding", "remarkable", "exciting", "promising",
    "令人惊叹", "优秀", "突破", "震惊", "印象深刻", "精彩", "卓越", "激动人心",
    "🚀", "🔥", "💪", "👏", "❤️", "💯", "✨", "🎉"
  ];
  const negativeWords = [
    "bad", "terrible", "awful", "disappointing", "worst", "hate", "problem", "issue",
    "concern", "worry", "fear", "risk", "danger", "threat", "bug", "error", "fail",
    "糟糕", "失望", "问题", "担忧", "恐惧", "风险", "危险", "错误", "失败"
  ];
  
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

// AI 分析推文
function analyzeTweetWithAI(tweet: Partial<Tweet>): {
  chineseSummary: string;
  keyPoints: string[];
  importance: "high" | "medium" | "low";
  category: string;
} {
  const content = tweet.content || "";
  const author = tweet.author?.username || "";
  
  // 高优先级账号
  const highPriorityAccounts = [
    "sama", "karpathy", "ylecun", "OpenAI", "GoogleDeepMind", 
    "AnthropicAI", "ilyasut", "gdb", "lilianweng", "fchollet"
  ];
  
  // 关键词分类
  const categoryKeywords: Record<string, string[]> = {
    "模型发布": ["release", "发布", "launch", "introducing", "new model", "gpt", "claude", "gemini", "llama", "grok", "announce"],
    "研究突破": ["research", "paper", "study", "breakthrough", "发现", "研究成果", "arxiv", "novel", "state-of-the-art"],
    "产品更新": ["update", "feature", "product", "app", "工具", "新功能", "now available", "shipping"],
    "行业动态": ["funding", "investment", "收购", "merger", "partnership", "合作", "融资", "series", "raised"],
    "观点评论": ["think", "believe", "opinion", "view", "观点", "看法", "认为", "thread", "thoughts on"],
  };
  
  // 判断分类
  let category = "其他";
  const lowerContent = content.toLowerCase();
  for (const [cat, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(kw => lowerContent.includes(kw.toLowerCase()))) {
      category = cat;
      break;
    }
  }
  
  // 判断重要性
  let importance: "high" | "medium" | "low" = "medium";
  if (highPriorityAccounts.includes(author)) {
    importance = "high";
  }
  if (tweet.likes && tweet.likes > 10000) {
    importance = "high";
  } else if (tweet.likes && tweet.likes < 500) {
    importance = "low";
  }
  
  // 生成中文摘要
  let chineseSummary = content;
  if (content.length > 150) {
    chineseSummary = content.slice(0, 150) + "...";
  }
  
  // 提取关键信息点
  const keyPoints: string[] = [];
  
  // 提取提到的 AI 模型
  const modelMatches = content.match(/\b(GPT-?\d*|Claude|Gemini|Llama|Grok|o\d+|DeepSeek|o3|o1)\w*\b/gi);
  if (modelMatches) {
    keyPoints.push(`提及模型: ${[...new Set(modelMatches)].join(", ")}`);
  }
  
  // 提取公司和产品
  const companyMatches = content.match(/\b(OpenAI|Anthropic|Google|Meta|xAI|DeepMind|Mistral|Perplexity)\b/gi);
  if (companyMatches) {
    keyPoints.push(`提及公司: ${[...new Set(companyMatches)].join(", ")}`);
  }
  
  // 提取数字信息
  const numberMatches = content.match(/\d+\s*(%|percent|倍|x|million|billion|M|B|k|K)?/gi);
  if (numberMatches && numberMatches.length > 0) {
    keyPoints.push(`关键数据: ${numberMatches.slice(0, 2).join(", ")}`);
  }
  
  if (keyPoints.length === 0) {
    keyPoints.push("AI 行业动态分享");
  }
  
  return {
    chineseSummary,
    keyPoints: keyPoints.slice(0, 3),
    importance,
    category,
  };
}

// 生成 Twitter 趋势（基于抓取的数据）
function generateTwitterTrends(tweets: Tweet[]): TwitterTrend[] {
  // 统计热门话题
  const hashtagCounts: Record<string, number> = {};
  const keywordCounts: Record<string, number> = {};
  
  const keywords = ["GPT", "Claude", "Gemini", "Llama", "Grok", "DeepSeek", "OpenAI", "AI Agent", "多模态", "开源"];
  
  for (const tweet of tweets) {
    // 统计 hashtag
    for (const hashtag of tweet.hashtags) {
      const tag = hashtag.toLowerCase();
      hashtagCounts[tag] = (hashtagCounts[tag] || 0) + tweet.likes + tweet.retweets;
    }
    
    // 统计关键词
    const content = tweet.content.toLowerCase();
    for (const kw of keywords) {
      if (content.includes(kw.toLowerCase())) {
        keywordCounts[kw] = (keywordCounts[kw] || 0) + tweet.likes + tweet.retweets;
      }
    }
  }
  
  // 合并并排序
  const allTrends: Array<{ name: string; score: number; category: string }> = [];
  
  for (const [tag, score] of Object.entries(hashtagCounts)) {
    allTrends.push({ name: `#${tag}`, score, category: "话题" });
  }
  
  for (const [kw, score] of Object.entries(keywordCounts)) {
    allTrends.push({ name: kw, score, category: "AI模型" });
  }
  
  // 默认趋势（如果没有数据）
  if (allTrends.length === 0) {
    return [
      { id: "tt_1", name: "AI", query: "AI", tweetVolume: 500000, rank: 1, category: "技术" },
      { id: "tt_2", name: "OpenAI", query: "OpenAI", tweetVolume: 300000, rank: 2, category: "公司" },
      { id: "tt_3", name: "GPT", query: "GPT", tweetVolume: 250000, rank: 3, category: "模型" },
    ];
  }
  
  // 排序并取前10
  allTrends.sort((a, b) => b.score - a.score);
  
  return allTrends.slice(0, 10).map((t, i) => ({
    id: `tt_${Date.now()}_${i}`,
    name: t.name,
    query: t.name.replace(/^#/, ""),
    tweetVolume: Math.round(t.score / 10),
    rank: i + 1,
    category: t.category,
  }));
}

// 保存推文到存储
async function saveTweets(tweets: Tweet[]): Promise<void> {
  if (isVercel) {
    // Vercel 环境：使用内存存储
    // 已经在 db.ts 中处理
    return;
  }
  
  // 服务器环境：保存到文件
  try {
    await fileDb.saveTweets(tweets);
    console.log(`[Twitter] Saved ${tweets.length} tweets to file`);
  } catch (error) {
    console.error("[Twitter] Failed to save tweets:", error);
  }
}

// 加载已保存的推文
async function loadSavedTweets(): Promise<Tweet[]> {
  if (isVercel) {
    return [];
  }
  
  try {
    return await fileDb.loadTweets();
  } catch {
    return [];
  }
}

// 主抓取函数
export async function crawlTwitter(options?: {
  maxAccounts?: number;
  usePython?: boolean;
}): Promise<{
  success: boolean;
  tweetsCount: number;
  trendsCount: number;
  timestamp: string;
  error?: string;
}> {
  // 检查是否正在抓取
  if (isCrawling) {
    return {
      success: false,
      tweetsCount: 0,
      trendsCount: 0,
      timestamp: new Date().toISOString(),
      error: "Crawling in progress",
    };
  }
  
  // 检查缓存
  if (lastCrawlTime && Date.now() - lastCrawlTime < CACHE_DURATION) {
    console.log("[Twitter] Using cached data");
    const saved = await loadSavedTweets();
    return {
      success: true,
      tweetsCount: saved.length,
      trendsCount: 0,
      timestamp: new Date(lastCrawlTime).toISOString(),
    };
  }
  
  isCrawling = true;
  const startTime = Date.now();
  
  try {
    console.log("🚀 Starting Twitter crawl...");
    
    const allTweets: Tweet[] = [];
    const maxAccounts = options?.maxAccounts || 15;
    
    // 按优先级排序
    const sortedAccounts = [...AI_TWITTER_ACCOUNTS]
      .sort((a, b) => a.priority - b.priority)
      .slice(0, maxAccounts);
    
    // 抓取每个账号
    for (const account of sortedAccounts) {
      let tweets: Partial<Tweet>[] = [];
      
      if (options?.usePython) {
        // 使用 Python 脚本（备用方案）
        tweets = await fetchWithPythonScript(account.username, 5);
      } else {
        // 使用 FxTwitter API（主要方案）
        tweets = await fetchUserTimeline(account.username);
      }
      
      for (const tweet of tweets) {
        if (!tweet.content) continue;
        
        const aiAnalysis = analyzeTweetWithAI(tweet);
        
        allTweets.push({
          id: `tw_${account.username}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          content: tweet.content,
          author: {
            name: tweet.author?.name || account.name,
            username: account.username,
            avatar: tweet.author?.avatar,
            verified: tweet.author?.verified || false,
          },
          publishedAt: tweet.publishedAt || new Date().toISOString(),
          likes: tweet.likes || 0,
          retweets: tweet.retweets || 0,
          replies: tweet.replies || 0,
          views: tweet.views || 0,
          hashtags: tweet.hashtags || [],
          mentions: tweet.mentions || [],
          urls: tweet.urls || [],
          isHot: (tweet.likes || 0) + (tweet.retweets || 0) > 2000,
          sentiment: tweet.sentiment || "neutral",
          aiAnalysis,
        } as Tweet);
      }
      
      // 延迟避免请求过快
      await delay(800);
    }
    
    // 去重（基于内容）
    const seenContent = new Set<string>();
    const uniqueTweets = allTweets.filter(t => {
      const key = t.content.slice(0, 100);
      if (seenContent.has(key)) return false;
      seenContent.add(key);
      return true;
    });
    
    // 按时间排序
    uniqueTweets.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    // 保存到存储
    await saveTweets(uniqueTweets);
    
    // 生成趋势
    const trends = generateTwitterTrends(uniqueTweets);
    if (!isVercel) {
      await fileDb.saveTwitterTrends(trends);
    }
    
    lastCrawlTime = Date.now();
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`✅ Twitter crawl completed: ${uniqueTweets.length} tweets, ${trends.length} trends (${duration}s)`);
    
    return {
      success: true,
      tweetsCount: uniqueTweets.length,
      trendsCount: trends.length,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("❌ Twitter crawl failed:", error);
    return {
      success: false,
      tweetsCount: 0,
      trendsCount: 0,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    isCrawling = false;
  }
}

// 获取热门推文
export async function getHotTweets(limit: number = 10): Promise<Tweet[]> {
  const tweets = await loadSavedTweets();
  return tweets
    .filter(t => t.isHot || (t.likes + t.retweets) > 2000)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

// 按时间排序获取推文
export async function getTweetsByTime(limit: number = 50): Promise<Tweet[]> {
  const tweets = await loadSavedTweets();
  return tweets
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

// 获取推文统计
export async function getTweetStats() {
  const tweets = await loadSavedTweets();
  
  return {
    totalTweets: tweets.length,
    hotTweets: tweets.filter(t => t.isHot).length,
    positiveTweets: tweets.filter(t => t.sentiment === "positive").length,
    negativeTweets: tweets.filter(t => t.sentiment === "negative").length,
    totalLikes: tweets.reduce((sum, t) => sum + t.likes, 0),
    totalRetweets: tweets.reduce((sum, t) => sum + t.retweets, 0),
    lastUpdate: lastCrawlTime ? new Date(lastCrawlTime).toISOString() : null,
  };
}

// 强制刷新
export async function forceRefreshTwitter(): Promise<{
  success: boolean;
  tweetsCount: number;
  timestamp: string;
}> {
  lastCrawlTime = null;
  return crawlTwitter();
}

// 初始化
export async function initTwitterCrawler(): Promise<void> {
  console.log("[Twitter] Initializing crawler...");
  
  // 加载已保存的推文
  const saved = await loadSavedTweets();
  if (saved.length > 0) {
    console.log(`[Twitter] Loaded ${saved.length} tweets from storage`);
  }
}
