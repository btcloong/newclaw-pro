/**
 * 6551 MCP 集成模块
 * 提供 Twitter 和新闻数据获取
 */

const MCP_API_BASE = "https://ai.6551.io";

export interface MCP6551Config {
  twitterToken?: string;
  newsToken?: string;
}

// Twitter 数据接口
export interface TwitterUser {
  userId: string;
  screenName: string;
  name: string;
  description: string;
  followersCount: number;
  friendsCount: number;
  statusesCount: number;
  verified: boolean;
}

export interface Tweet {
  id: string;
  text: string;
  createdAt: string;
  retweetCount: number;
  favoriteCount: number;
  replyCount: number;
  userScreenName: string;
  hashtags: string[];
  urls: { url: string }[];
}

// 新闻数据接口
export interface NewsArticle {
  id: string;
  text: string;
  newsType: string;
  engineType: string;
  link: string;
  coins: { symbol: string; market_type: string; match: string }[];
  aiRating: {
    score: number;
    grade: string;
    signal: "long" | "short" | "neutral";
    status: string;
    summary: string;
    enSummary: string;
  };
  ts: number;
}

// 6551 Twitter MCP 客户端
export class TwitterMCPClient {
  private token: string;
  private baseUrl: string;

  constructor(token: string, baseUrl: string = MCP_API_BASE) {
    this.token = token;
    this.baseUrl = baseUrl;
  }

  private async request(endpoint: string, params: Record<string, any> = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.append(key, String(value));
    });

    const response = await fetch(url.toString(), {
      headers: {
        "Authorization": `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`6551 API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // 获取用户信息
  async getUser(username: string): Promise<TwitterUser> {
    return this.request("/open/twitter/user", { username });
  }

  // 获取用户推文
  async getUserTweets(username: string, maxResults: number = 20): Promise<Tweet[]> {
    return this.request("/open/twitter/user/tweets", { username, max_results: maxResults });
  }

  // 搜索推文
  async searchTweets(query: string, maxResults: number = 20): Promise<Tweet[]> {
    return this.request("/open/twitter/search", { q: query, max_results: maxResults });
  }

  // 高级搜索
  async searchTweetsAdvanced(
    query: string,
    options: {
      minLikes?: number;
      minRetweets?: number;
      startTime?: string;
      endTime?: string;
      maxResults?: number;
    } = {}
  ): Promise<Tweet[]> {
    return this.request("/open/twitter/search/advanced", {
      q: query,
      min_likes: options.minLikes,
      min_retweets: options.minRetweets,
      start_time: options.startTime,
      end_time: options.endTime,
      max_results: options.maxResults || 20,
    });
  }
}

// 6551 News MCP 客户端
export class NewsMCPClient {
  private token: string;
  private baseUrl: string;

  constructor(token: string, baseUrl: string = MCP_API_BASE) {
    this.token = token;
    this.baseUrl = baseUrl;
  }

  private async request(endpoint: string, params: Record<string, any> = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.append(key, String(value));
    });

    const response = await fetch(url.toString(), {
      headers: {
        "Authorization": `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`6551 API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // 获取新闻源分类树
  async getSources(): Promise<any> {
    return this.request("/open/news_type");
  }

  // 搜索新闻（主要接口）
  async searchNews(
    options: {
      query?: string;
      coins?: string[];
      engineTypes?: Record<string, string[]>;
      hasCoin?: boolean;
      limit?: number;
      page?: number;
    } = {}
  ): Promise<any> {
    const body: any = {
      limit: options.limit || 20,
      page: options.page || 1,
    };
    if (options.query) body.q = options.query;
    if (options.coins) body.coins = options.coins;
    if (options.engineTypes) body.engineTypes = options.engineTypes;
    if (options.hasCoin) body.hasCoin = options.hasCoin;

    const response = await fetch(`${this.baseUrl}/open/news_search`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`6551 API error: ${response.status}`);
    }

    return response.json();
  }

  // 获取最新新闻（使用搜索接口）
  async getLatestNews(maxResults: number = 20): Promise<any> {
    return this.searchNews({ limit: maxResults });
  }

  // 按币种搜索
  async searchByCoin(coin: string, maxResults: number = 20): Promise<any> {
    return this.searchNews({ coins: [coin], limit: maxResults });
  }

  // 高评分新闻（需要在结果中筛选）
  async getHighScoreNews(minScore: number = 80, maxResults: number = 20): Promise<any> {
    const result = await this.searchNews({ limit: maxResults * 2 });
    if (result?.data) {
      result.data = result.data.filter((article: NewsArticle) => 
        (article.aiRating?.score || 0) >= minScore
      ).slice(0, maxResults);
    }
    return result;
  }

  // 按交易信号筛选（需要在结果中筛选）
  async getBySignal(signal: "long" | "short" | "neutral", maxResults: number = 20): Promise<any> {
    const result = await this.searchNews({ limit: maxResults * 2 });
    if (result?.data) {
      result.data = result.data.filter((article: NewsArticle) => 
        article.aiRating?.signal === signal
      ).slice(0, maxResults);
    }
    return result;
  }
}

// 转换 6551 新闻为 NewClaw 格式
export function convert6551NewsToNewClaw(article: NewsArticle) {
  return {
    id: `6551_${article.id}`,
    title: article.text.split("\n")[0] || article.text.slice(0, 100),
    summary: article.aiRating?.summary || article.text.slice(0, 200),
    content: article.text,
    url: article.link,
    source: article.newsType,
    sourceUrl: article.link,
    category: article.engineType,
    tags: article.coins?.map((c) => c.symbol) || [],
    publishedAt: new Date(article.ts).toISOString(),
    isHot: article.aiRating?.score >= 80,
    isFeatured: article.aiRating?.score >= 90,
    aiProcessed: true,
    aiProcessingStatus: "completed",
    aiScores: {
      relevance: article.aiRating?.score || 50,
      quality: article.aiRating?.score || 50,
      timeliness: 80,
      overall: article.aiRating?.score || 50,
    },
    aiCategory: article.engineType,
    chineseTitle: article.text.split("\n")[0] || article.text.slice(0, 100),
    aiSummary: article.aiRating?.summary || "",
    recommendation: article.aiRating?.signal === "long" 
      ? "📈 AI 建议：做多信号" 
      : article.aiRating?.signal === "short"
      ? "📉 AI 建议：做空信号"
      : "➡️ AI 建议：中性",
    aiKeywords: article.coins?.map((c) => c.symbol) || [],
  };
}

// 转换 6551 推文为 NewClaw 格式
export function convert6551TweetToNewClaw(tweet: Tweet) {
  return {
    id: `6551_tweet_${tweet.id}`,
    title: tweet.text.slice(0, 100),
    summary: tweet.text.slice(0, 200),
    content: tweet.text,
    url: `https://twitter.com/${tweet.userScreenName}/status/${tweet.id}`,
    source: "Twitter",
    sourceUrl: `https://twitter.com/${tweet.userScreenName}`,
    category: "社交媒体",
    tags: tweet.hashtags || [],
    publishedAt: tweet.createdAt,
    isHot: tweet.favoriteCount > 1000 || tweet.retweetCount > 500,
    isFeatured: tweet.favoriteCount > 5000,
    viewCount: (tweet.favoriteCount + tweet.retweetCount) * 10,
    aiProcessed: false,
    aiProcessingStatus: "pending",
  };
}

// 测试连接
export async function test6551Connection(config: MCP6551Config): Promise<{ twitter: boolean; news: boolean }> {
  const results = { twitter: false, news: false };

  if (config.twitterToken) {
    try {
      const client = new TwitterMCPClient(config.twitterToken);
      await client.getUser("elonmusk");
      results.twitter = true;
    } catch (e) {
      console.error("Twitter MCP test failed:", e);
    }
  }

  if (config.newsToken) {
    try {
      const client = new NewsMCPClient(config.newsToken);
      await client.getLatestNews(1);
      results.news = true;
    } catch (e) {
      console.error("News MCP test failed:", e);
    }
  }

  return results;
}
