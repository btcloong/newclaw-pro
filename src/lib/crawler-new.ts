/**
 * 优化的爬虫系统
 * 支持定时更新、优先级处理、文件存储、去重机制
 */

import Parser from "rss-parser";
import { RSSSource, ALL_RSS_SOURCES, SourcePriority, getSourcesByPriority } from "./rss-sources";
import { NewsItem } from "./db";
import { batchProcessArticles } from "./ai-processor";
import {
  loadNews,
  saveNews,
  addNewsItem,
  updateNewsItem,
  loadCrawlState,
  saveCrawlState,
  updateLastCrawlTime,
  updateSourceState,
  isUrlSeen,
  markUrlAsSeen,
  initStorage,
} from "./storage-adapter";

// 爬虫配置
const CRAWLER_CONFIG = {
  CONCURRENCY: 5, // 并发数
  TIMEOUT: 20000, // 超时时间（毫秒）
  MAX_RETRIES: 3, // 最大重试次数
  RETRY_DELAY: 3000, // 重试延迟（毫秒）
  MAX_ITEMS_PER_SOURCE: 10, // 每个源最大抓取数量
  HIGH_PRIORITY_INTERVAL: 30 * 60 * 1000, // 高频源：30分钟
  MEDIUM_PRIORITY_INTERVAL: 2 * 60 * 60 * 1000, // 中频源：2小时
  LOW_PRIORITY_INTERVAL: 6 * 60 * 60 * 1000, // 低频源：6小时
};

// 自定义 RSS 解析器
const rssParser = new Parser({
  timeout: CRAWLER_CONFIG.TIMEOUT,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; NewClawBot/1.0; +https://newclaw.pro)',
    'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
  },
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
      ['content:encoded', 'contentEncoded'],
      ['dc:creator', 'creator'],
      ['dc:date', 'dcDate'],
    ],
  },
});

// 并发控制队列
class ConcurrencyQueue {
  private concurrency: number;
  private running: number = 0;
  private queue: Array<() => Promise<void>> = [];

  constructor(concurrency: number) {
    this.concurrency = concurrency;
  }

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const task = async () => {
        try {
          this.running++;
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.running--;
          this.processQueue();
        }
      };

      if (this.running < this.concurrency) {
        task();
      } else {
        this.queue.push(task);
      }
    });
  }

  private processQueue() {
    if (this.queue.length > 0 && this.running < this.concurrency) {
      const task = this.queue.shift();
      if (task) task();
    }
  }
}

const crawlQueue = new ConcurrencyQueue(CRAWLER_CONFIG.CONCURRENCY);

// 延迟函数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 生成唯一 ID
function generateId(source: string, title: string, pubDate: string): string {
  const hash = `${source}-${title}-${pubDate}`.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  return `rss_${Math.abs(hash).toString(36)}_${Date.now().toString(36).slice(-4)}`;
}

// 提取图片
function extractImage(item: any): string | null {
  if (item.mediaContent?.$?.url) return item.mediaContent.$.url;
  if (item.mediaThumbnail?.$?.url) return item.mediaThumbnail.$.url;
  if (item.enclosure?.url) return item.enclosure.url;
  
  const content = item.contentEncoded || item.content || item.summary || '';
  const imgMatch = content.match(/<img[^\u003e]+src=["']([^"']+)["']/i);
  if (imgMatch) return imgMatch[1];
  
  return null;
}

// 提取标签
function extractTags(item: any, sourceCategory: string): string[] {
  const tags: string[] = [];
  
  if (item.categories && Array.isArray(item.categories)) {
    tags.push(...item.categories.slice(0, 3));
  }
  
  const title = item.title || '';
  const titleLower = title.toLowerCase();
  
  const keywordMap: Record<string, string[]> = {
    'openai': ['OpenAI'],
    'gpt': ['GPT', 'OpenAI'],
    'claude': ['Claude', 'Anthropic'],
    'anthropic': ['Anthropic'],
    'gemini': ['Gemini', 'Google'],
    'google': ['Google'],
    'deepseek': ['DeepSeek'],
    'llama': ['Llama', 'Meta'],
    'meta': ['Meta'],
    'mistral': ['Mistral'],
    'xai': ['xAI'],
    'grok': ['Grok', 'xAI'],
    'ai agent': ['AI Agent'],
    'agent': ['AI Agent'],
    'multimodal': ['多模态'],
    'reasoning': ['推理模型'],
    'llm': ['LLM'],
    'machine learning': ['机器学习'],
    'security': ['安全'],
    'kubernetes': ['K8s'],
    'docker': ['Docker'],
    'github': ['GitHub'],
  };
  
  for (const [keyword, tagList] of Object.entries(keywordMap)) {
    if (titleLower.includes(keyword)) {
      tags.push(...tagList);
    }
  }
  
  if (sourceCategory) {
    tags.push(sourceCategory);
  }
  
  return [...new Set(tags)].slice(0, 5);
}

// 带重试的 RSS 抓取
async function fetchRSSWithRetry(source: RSSSource, retries: number = 0): Promise<any> {
  try {
    const feed = await rssParser.parseURL(source.xmlUrl);
    return feed;
  } catch (error) {
    if (retries < CRAWLER_CONFIG.MAX_RETRIES) {
      console.log(`[RSS] Retrying ${source.name} (${retries + 1}/${CRAWLER_CONFIG.MAX_RETRIES})...`);
      await delay(CRAWLER_CONFIG.RETRY_DELAY * (retries + 1));
      return fetchRSSWithRetry(source, retries + 1);
    }
    throw error;
  }
}

// 抓取单个 RSS 源
async function crawlSingleSource(source: RSSSource): Promise<{ success: boolean; count: number; error?: string }> {
  return crawlQueue.add(async () => {
    try {
      console.log(`[RSS] Crawling ${source.name}...`);
      
      const feed = await fetchRSSWithRetry(source);
      let newItemsCount = 0;
      
      for (const item of feed.items.slice(0, CRAWLER_CONFIG.MAX_ITEMS_PER_SOURCE)) {
        const url = item.link || item.guid || '';
        
        // 去重检查
        const alreadySeen = await isUrlSeen(url);
        if (alreadySeen) {
          continue;
        }
        
        const pubDate = item.pubDate || item.dcDate || item.isoDate || new Date().toISOString();
        
        const newsItem: NewsItem = {
          id: generateId(source.id, item.title || '', pubDate),
          title: item.title?.slice(0, 200) || 'Untitled',
          summary: item.contentSnippet?.slice(0, 500) || item.summary?.slice(0, 500) || '',
          content: item.contentEncoded || item.content || undefined,
          url: url,
          source: source.name,
          sourceUrl: item.link || undefined,
          image: extractImage(item) || undefined,
          category: source.category,
          tags: extractTags(item, source.category),
          publishedAt: new Date(pubDate).toISOString(),
          isHot: false,
          isFeatured: false,
          viewCount: 0,
          aiProcessed: false,
          aiProcessingStatus: 'pending',
        };
        
        await addNewsItem(newsItem);
        await markUrlAsSeen(url);
        newItemsCount++;
      }
      
      await updateSourceState(source.id, true);
      console.log(`[RSS] ${source.name}: ${newItemsCount} new items`);
      return { success: true, count: newItemsCount };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`[RSS] Error crawling ${source.name}:`, errorMsg);
      await updateSourceState(source.id, false);
      return { success: false, count: 0, error: errorMsg };
    }
  });
}

// 按优先级抓取
export async function crawlByPriority(priority: SourcePriority): Promise<{
  success: boolean;
  totalCount: number;
  successCount: number;
  errorCount: number;
  errors: Array<{ source: string; error: string }>;
}> {
  const sources = getSourcesByPriority(priority);
  console.log(`\n🚀 Starting ${priority} priority crawl at`, new Date().toISOString());
  console.log(`   Sources: ${sources.length}`);
  console.log('='.repeat(50));
  
  const results = await Promise.allSettled(
    sources.map(source => crawlSingleSource(source))
  );
  
  let totalCount = 0;
  let successCount = 0;
  let errorCount = 0;
  const errors: Array<{ source: string; error: string }> = [];
  
  results.forEach((result, index) => {
    const source = sources[index];
    if (result.status === 'fulfilled') {
      if (result.value.success) {
        successCount++;
        totalCount += result.value.count;
      } else {
        errorCount++;
        errors.push({ source: source.name, error: result.value.error || 'Unknown error' });
      }
    } else {
      errorCount++;
      errors.push({ source: source.name, error: String(result.reason) });
    }
  });
  
  console.log('='.repeat(50));
  console.log('✅ Crawl completed');
  console.log(`   Total sources: ${sources.length}`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Errors: ${errorCount}`);
  console.log(`   New items: ${totalCount}`);
  
  await updateLastCrawlTime();
  
  return {
    success: errorCount === 0,
    totalCount,
    successCount,
    errorCount,
    errors,
  };
}

// 全量抓取
export async function crawlAllRSS(): Promise<{
  success: boolean;
  totalCount: number;
  successCount: number;
  errorCount: number;
  errors: Array<{ source: string; error: string }>;
}> {
  console.log('\n🚀 Starting FULL RSS crawl at', new Date().toISOString());
  console.log('='.repeat(50));
  
  const highResult = await crawlByPriority('high');
  const mediumResult = await crawlByPriority('medium');
  const lowResult = await crawlByPriority('low');
  
  const totalCount = highResult.totalCount + mediumResult.totalCount + lowResult.totalCount;
  const successCount = highResult.successCount + mediumResult.successCount + lowResult.successCount;
  const errorCount = highResult.errorCount + mediumResult.errorCount + lowResult.errorCount;
  const errors = [...highResult.errors, ...mediumResult.errors, ...lowResult.errors];
  
  // 更新全量抓取时间
  const state = await loadCrawlState();
  state.lastFullCrawlTime = new Date().toISOString();
  await saveCrawlState(state);
  
  console.log('='.repeat(50));
  console.log('✅ Full crawl completed');
  console.log(`   Total new items: ${totalCount}`);
  
  return {
    success: errorCount === 0,
    totalCount,
    successCount,
    errorCount,
    errors,
  };
}

// 自动增量抓取（根据优先级）
export async function crawlAuto(): Promise<{
  high: { crawled: boolean; result?: any };
  medium: { crawled: boolean; result?: any };
  low: { crawled: boolean; result?: any };
}> {
  const state = await loadCrawlState();
  const now = Date.now();
  
  const result = {
    high: { crawled: false },
    medium: { crawled: false },
    low: { crawled: false },
  };
  
  // 检查高频源
  const lastHighCrawl = state.sourceStates['openai-blog']?.lastCrawled;
  const highInterval = now - (lastHighCrawl ? new Date(lastHighCrawl).getTime() : 0);
  
  if (!lastHighCrawl || highInterval >= CRAWLER_CONFIG.HIGH_PRIORITY_INTERVAL) {
    console.log('[Auto] Crawling high priority sources...');
    result.high = { crawled: true, result: await crawlByPriority('high') };
  }
  
  // 检查中频源
  const lastMediumCrawl = state.sourceStates['techcrunch-ai']?.lastCrawled;
  const mediumInterval = now - (lastMediumCrawl ? new Date(lastMediumCrawl).getTime() : 0);
  
  if (!lastMediumCrawl || mediumInterval >= CRAWLER_CONFIG.MEDIUM_PRIORITY_INTERVAL) {
    console.log('[Auto] Crawling medium priority sources...');
    result.medium = { crawled: true, result: await crawlByPriority('medium') };
  }
  
  // 检查低频源
  const lastLowCrawl = state.sourceStates['berkeley-ai']?.lastCrawled;
  const lowInterval = now - (lastLowCrawl ? new Date(lastLowCrawl).getTime() : 0);
  
  if (!lastLowCrawl || lowInterval >= CRAWLER_CONFIG.LOW_PRIORITY_INTERVAL) {
    console.log('[Auto] Crawling low priority sources...');
    result.low = { crawled: true, result: await crawlByPriority('low') };
  }
  
  return result;
}

// 处理待处理的 AI 文章
export async function processPendingArticles(limit: number = 10) {
  const news = await loadNews();
  const pendingArticles = news
    .filter(n => !n.aiProcessed || n.aiProcessingStatus === 'pending')
    .slice(0, limit);
  
  if (pendingArticles.length === 0) {
    console.log('[AI] No pending articles to process');
    return { processed: 0, success: 0 };
  }
  
  console.log(`[AI] Processing ${pendingArticles.length} pending articles...`);
  
  const articlesToProcess = pendingArticles.map(article => ({
    id: article.id,
    title: article.title,
    content: article.content || article.summary,
    url: article.url,
    source: article.source,
    publishedAt: article.publishedAt,
  }));
  
  const results = await batchProcessArticles(articlesToProcess, 3);
  
  let successCount = 0;
  for (const [id, result] of results) {
    if (result.processingStatus === 'completed') {
      await updateNewsItem(id, {
        aiProcessed: true,
        aiProcessingStatus: 'completed',
        aiProcessedAt: result.processedAt,
        aiScores: result.scores,
        aiCategory: result.category,
        chineseTitle: result.chineseTitle,
        aiSummary: result.summary,
        recommendation: result.recommendation,
        aiKeywords: result.keywords,
      });
      successCount++;
    }
  }
  
  console.log(`[AI] Processed ${successCount}/${pendingArticles.length} articles successfully`);
  
  // 更新 AI 处理时间
  const state = await loadCrawlState();
  state.lastAIProcessingTime = new Date().toISOString();
  await saveCrawlState(state);
  
  return {
    processed: pendingArticles.length,
    success: successCount,
    failed: pendingArticles.length - successCount,
  };
}

// 获取爬虫统计
export async function getCrawlerStats() {
  const state = await loadCrawlState();
  const news = await loadNews();
  
  return {
    lastCrawlTime: state.lastCrawlTime,
    lastFullCrawlTime: state.lastFullCrawlTime,
    lastAIProcessingTime: state.lastAIProcessingTime,
    totalNews: news.length,
    aiProcessedNews: news.filter(n => n.aiProcessed).length,
    pendingAINews: news.filter(n => !n.aiProcessed).length,
    sourceStats: state.sourceStates,
  };
}

// 初始化
export async function initCrawler(): Promise<void> {
  await initStorage();
  console.log('[Crawler] Initialized');
}
