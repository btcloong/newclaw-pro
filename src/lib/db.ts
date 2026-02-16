// 数据库接口定义
// 支持内存存储和文件存储

import { AICategory, ArticleScores } from "./ai-processor";

// 扩展的新闻项接口
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content?: string;
  url: string;
  source: string;
  sourceUrl?: string;
  image?: string;
  category: string;
  tags: string[];
  publishedAt: string;
  isHot?: boolean;
  isFeatured?: boolean;
  viewCount?: number;
  
  // AI 处理字段
  aiProcessed?: boolean;
  aiProcessingStatus?: "pending" | "processing" | "completed" | "failed";
  aiProcessedAt?: string;
  aiError?: string;
  
  // AI 评分
  aiScores?: ArticleScores;
  
  // AI 分类
  aiCategory?: AICategory;
  
  // AI 生成的内容
  chineseTitle?: string;
  aiSummary?: string;
  recommendation?: string;
  aiKeywords?: string[];
  
  // 前世今生背景信息
  background?: string;
  history?: string[];
  relatedNews?: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  fullDescription?: string;
  url: string;
  logo?: string;
  category: string;
  tags: string[];
  source: "github" | "producthunt" | "other";
  stars?: number;
  forks?: number;
  upvotes?: number;
  language?: string;
  license?: string;
  createdAt?: string;
  updatedAt?: string;
  isNew?: boolean;
  isTrending?: boolean;
}

export interface ResearchReport {
  id: string;
  title: string;
  summary: string;
  content?: string;
  category: string;
  tags: string[];
  author?: string;
  readTime?: string;
  publishedAt: string;
  viewCount?: number;
}

export interface HotTopic {
  id: string;
  title: string;
  heat: number;
  change: number;
  category?: string;
  rank: number;
}

export interface Funding {
  id: string;
  companyName: string;
  amount: string;
  round: string;
  date: string;
  investors: string[];
  category?: string;
  description?: string;
}

// Twitter 推文接口
export interface Tweet {
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
  media?: string[];
  hashtags: string[];
  mentions: string[];
  urls: string[];
  isHot?: boolean;
  sentiment?: "positive" | "neutral" | "negative";
  // AI 解读字段
  aiAnalysis?: {
    chineseSummary: string;
    keyPoints: string[];
    importance: "high" | "medium" | "low";
    category: string;
  };
}

// Twitter 话题趋势
export interface TwitterTrend {
  id: string;
  name: string;
  query: string;
  tweetVolume: number;
  rank: number;
  category?: string;
}

// 趋势总结接口
export interface DailyTrendSummary {
  date: string;
  summary: string;
  keyTrends: string[];
  notableArticles: string[];
  categoryDistribution: Record<string, number>;
  topKeywords: Array<{ keyword: string; count: number }>;
  generatedAt: string;
}

// 内存存储（向后兼容）
let newsStore: NewsItem[] = [];
let projectsStore: Project[] = [];
let researchStore: ResearchReport[] = [];
let hotTopicsStore: HotTopic[] = [];
let fundingStore: Funding[] = [];
export let tweetsStore: Tweet[] = [];
export let twitterTrendsStore: TwitterTrend[] = [];
let trendSummaryStore: DailyTrendSummary | null = null;
let lastCrawlTime: string | null = null;
let lastAIProcessingTime: string | null = null;

// 初始化示例数据
export function initSampleData() {
  // 这里可以保留一些默认数据
  // 实际数据将从文件加载
}

// 模拟 Drizzle ORM 接口
export const news = {
  findFirst: async ({ where }: { where: any }) => {
    const id = where?.id?._value || where?.id;
    return newsStore.find(n => n.id === id) || null;
  },
  findMany: async (options?: { where?: any; orderBy?: any; limit?: number }) => {
    let result = [...newsStore];
    if (options?.limit) {
      result = result.slice(0, options.limit);
    }
    return result;
  },
};

export const projects = {
  findFirst: async ({ where }: { where: any }) => {
    const id = where?.id?._value || where?.id;
    return projectsStore.find(p => p.id === id) || null;
  },
  findMany: async () => projectsStore,
};

export const research = {
  findFirst: async ({ where }: { where: any }) => {
    const id = where?.id?._value || where?.id;
    return researchStore.find(r => r.id === id) || null;
  },
  findMany: async () => researchStore,
};

// 导出数据操作函数（内存版本，向后兼容）
export const db = {
  news: {
    findAll: (options?: { limit?: number; offset?: number; category?: string; aiProcessed?: boolean }) => {
      let result = [...newsStore];
      
      if (options?.category) {
        result = result.filter(n => n.aiCategory === options.category || n.category === options.category);
      }
      
      if (options?.aiProcessed !== undefined) {
        result = result.filter(n => n.aiProcessed === options.aiProcessed);
      }
      
      result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      
      const offset = options?.offset || 0;
      const limit = options?.limit || result.length;
      
      return result.slice(offset, offset + limit);
    },
    findById: (id: string) => newsStore.find(n => n.id === id),
    findTopRated: (limit: number = 3) => {
      return newsStore
        .filter(n => n.aiProcessed && n.aiScores)
        .sort((a, b) => (b.aiScores?.overall || 0) - (a.aiScores?.overall || 0))
        .slice(0, limit);
    },
    findPendingAIProcessing: (limit: number = 10) => {
      return newsStore
        .filter(n => !n.aiProcessed || n.aiProcessingStatus === "pending")
        .slice(0, limit);
    },
    updateAIResult: (id: string, result: any) => {
      const index = newsStore.findIndex(n => n.id === id);
      if (index !== -1) {
        newsStore[index] = {
          ...newsStore[index],
          aiProcessed: true,
          aiProcessingStatus: result.processingStatus,
          aiProcessedAt: result.processedAt,
          aiError: result.error,
          aiScores: result.scores,
          aiCategory: result.category,
          chineseTitle: result.chineseTitle,
          aiSummary: result.summary,
          recommendation: result.recommendation,
          aiKeywords: result.keywords,
        };
        return true;
      }
      return false;
    },
    add: (item: any) => {
      newsStore.unshift(item);
    },
    count: () => newsStore.length,
  },
  projects: {
    findAll: (options?: { limit?: number; source?: string }) => {
      let result = [...projectsStore];
      
      if (options?.source) {
        result = result.filter(p => p.source === options.source);
      }
      
      result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      
      const limit = options?.limit || result.length;
      return result.slice(0, limit);
    },
    findById: (id: string) => projectsStore.find(p => p.id === id),
    count: () => projectsStore.length,
  },
  research: {
    findAll: () => researchStore,
    findById: (id: string) => researchStore.find(r => r.id === id),
  },
  hotTopics: {
    findAll: () => hotTopicsStore.sort((a, b) => a.rank - b.rank),
  },
  funding: {
    findAll: () => fundingStore,
  },
  tweets: {
    findAll: (options?: { 
      limit?: number; 
      isHot?: boolean; 
      sortBy?: "time" | "popularity";
      category?: string;
    }) => {
      let result = [...tweetsStore];
      
      if (options?.isHot !== undefined) {
        result = result.filter(t => t.isHot === options.isHot);
      }
      
      if (options?.category) {
        result = result.filter(t => 
          t.aiAnalysis?.category === options.category ||
          t.hashtags.some(h => h.toLowerCase() === options.category?.toLowerCase())
        );
      }
      
      // 排序
      if (options?.sortBy === "popularity") {
        result.sort((a, b) => (b.likes + b.retweets) - (a.likes + a.retweets));
      } else {
        result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      }
      
      const limit = options?.limit || result.length;
      return result.slice(0, limit);
    },
    findById: (id: string) => tweetsStore.find(t => t.id === id),
    findByUsername: (username: string) => {
      return tweetsStore.filter(t => t.author.username.toLowerCase() === username.toLowerCase())
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    },
    findByImportance: (importance: "high" | "medium" | "low") => {
      return tweetsStore.filter(t => t.aiAnalysis?.importance === importance)
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    },
    count: () => tweetsStore.length,
    getStats: () => {
      const total = tweetsStore.length;
      const hot = tweetsStore.filter(t => t.isHot).length;
      const highImportance = tweetsStore.filter(t => t.aiAnalysis?.importance === "high").length;
      const withAIAnalysis = tweetsStore.filter(t => t.aiAnalysis && t.aiAnalysis.chineseSummary !== "AI 解读生成中...").length;
      return { total, hot, highImportance, withAIAnalysis };
    },
  },
  twitterTrends: {
    findAll: () => twitterTrendsStore.sort((a, b) => a.rank - b.rank),
  },
  trendSummary: {
    get: () => trendSummaryStore,
    set: (summary: any) => {
      trendSummaryStore = summary;
    },
  },
  getStats: () => ({
    newsCount: newsStore.length,
    projectsCount: projectsStore.length,
    tweetsCount: tweetsStore.length,
    aiProcessedCount: newsStore.filter(n => n.aiProcessed).length,
    lastCrawlTime,
    lastAIProcessingTime,
  }),
  recrawl: () => {
    initSampleData();
    return { success: true, timestamp: lastCrawlTime };
  },
  addNews: (items: any[]) => {
    newsStore = [...items, ...newsStore];
  },
};

// 确保数据已初始化
if (newsStore.length === 0) {
  initSampleData();
}

export const eq = (field: any, value: any) => ({ _field: field, _value: value });
export const desc = (field: any) => ({ _field: field, _order: 'desc' });
export const sql = (strings: TemplateStringsArray, ...values: any[]) => ({
  toString: () => strings.reduce((acc, str, i) => acc + str + (values[i] || ''), ''),
});
