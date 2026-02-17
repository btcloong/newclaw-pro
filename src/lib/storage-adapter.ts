/**
 * 统一存储适配器
 * 支持文件存储（GitHub Actions）和内存存储（Vercel）
 */

import { NewsItem } from "./db";
import * as fileDb from "./file-db";
import { db } from "./db";

// 判断是否在 Vercel 环境
const isVercel = process.env.VERCEL === "1" || process.env.VERCEL_ENV !== undefined;

// 判断是否使用内存存储
const useMemoryStorage = isVercel || process.env.USE_MEMORY_STORAGE === "true";

console.log(`[Storage] Using ${useMemoryStorage ? "memory" : "file"} storage`);

// ============ News 操作 ============
export async function loadNews(): Promise<NewsItem[]> {
  if (useMemoryStorage) {
    return db.news.findAll({ limit: 1000 });
  }
  return fileDb.loadNews();
}

export async function saveNews(news: NewsItem[]): Promise<void> {
  if (useMemoryStorage) {
    // 内存存储不需要显式保存
    return;
  }
  return fileDb.saveNews(news);
}

export async function addNewsItem(item: NewsItem): Promise<void> {
  if (useMemoryStorage) {
    // 检查是否已存在
    const existing = db.news.findById(item.id);
    if (!existing) {
      db.news.add(item);
    }
    return;
  }
  return fileDb.addNewsItem(item);
}

export async function updateNewsItem(id: string, updates: Partial<NewsItem>): Promise<void> {
  if (useMemoryStorage) {
    db.news.updateAIResult(id, {
      processingStatus: updates.aiProcessingStatus || "completed",
      processedAt: updates.aiProcessedAt || new Date().toISOString(),
      scores: updates.aiScores,
      category: updates.aiCategory,
      chineseTitle: updates.chineseTitle,
      summary: updates.aiSummary,
      recommendation: updates.recommendation,
      keywords: updates.aiKeywords,
    });
    return;
  }
  return fileDb.updateNewsItem(id, updates);
}

// ============ Crawl State 操作 ============
interface CrawlState {
  lastCrawlTime: string | null;
  lastAIProcessingTime: string | null;
  lastFullCrawlTime: string | null;
  sourceStates: Record<string, {
    lastCrawled: string;
    lastSuccess: boolean;
    errorCount: number;
  }>;
}

// 内存存储的爬虫状态
let memoryCrawlState: CrawlState = {
  lastCrawlTime: null,
  lastAIProcessingTime: null,
  lastFullCrawlTime: null,
  sourceStates: {},
};

export async function loadCrawlState(): Promise<CrawlState> {
  if (useMemoryStorage) {
    return memoryCrawlState;
  }
  return fileDb.loadCrawlState();
}

export async function saveCrawlState(state: CrawlState): Promise<void> {
  if (useMemoryStorage) {
    memoryCrawlState = state;
    return;
  }
  return fileDb.saveCrawlState(state);
}

export async function updateLastCrawlTime(): Promise<void> {
  if (useMemoryStorage) {
    memoryCrawlState.lastCrawlTime = new Date().toISOString();
    return;
  }
  return fileDb.updateLastCrawlTime();
}

export async function updateSourceState(sourceId: string, success: boolean): Promise<void> {
  if (useMemoryStorage) {
    const existing = memoryCrawlState.sourceStates[sourceId] || { errorCount: 0 };
    memoryCrawlState.sourceStates[sourceId] = {
      lastCrawled: new Date().toISOString(),
      lastSuccess: success,
      errorCount: success ? 0 : (existing.errorCount || 0) + 1,
    };
    return;
  }
  return fileDb.updateSourceState(sourceId, success);
}

// ============ Seen URLs (去重) ============
// 内存存储的已见URL集合
let memorySeenUrls = new Set<string>();

export async function loadSeenUrls(): Promise<Set<string>> {
  if (useMemoryStorage) {
    return memorySeenUrls;
  }
  return fileDb.loadSeenUrls();
}

export async function saveSeenUrls(urls: Set<string>): Promise<void> {
  if (useMemoryStorage) {
    memorySeenUrls = urls;
    return;
  }
  return fileDb.saveSeenUrls(urls);
}

export async function isUrlSeen(url: string): Promise<boolean> {
  if (useMemoryStorage) {
    return memorySeenUrls.has(url);
  }
  return fileDb.isUrlSeen(url);
}

export async function markUrlAsSeen(url: string): Promise<void> {
  if (useMemoryStorage) {
    memorySeenUrls.add(url);
    // 限制大小
    if (memorySeenUrls.size > 10000) {
      const urls = Array.from(memorySeenUrls);
      memorySeenUrls = new Set(urls.slice(urls.length - 10000));
    }
    return;
  }
  return fileDb.markUrlAsSeen(url);
}

// ============ 初始化 ============
export async function initStorage(): Promise<void> {
  if (useMemoryStorage) {
    console.log("[Storage] Memory storage initialized");
    return;
  }
  return fileDb.initFileDb();
}
