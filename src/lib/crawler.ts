/**
 * 优化的爬虫系统
 * 支持并发控制、RSS 2.0 和 Atom 双格式解析、错误处理和重试机制
 */

import Parser from "rss-parser";
import { db, NewsItem } from "./db";
import { processArticleWithAI, batchProcessArticles } from "./ai-processor";
import { ALL_RSS_SOURCES, RSSSource } from "./rss-sources";

// 爬虫配置
const CRAWLER_CONFIG = {
  CONCURRENCY: 10, // 并发数
  TIMEOUT: 15000, // 超时时间（毫秒）
  MAX_RETRIES: 3, // 最大重试次数
  RETRY_DELAY: 2000, // 重试延迟（毫秒）
  MAX_ITEMS_PER_SOURCE: 10, // 每个源最大抓取数量
};

// 自定义 RSS 解析器，支持 Atom 和 RSS 2.0
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

// 创建全局并发队列
const crawlQueue = new ConcurrencyQueue(CRAWLER_CONFIG.CONCURRENCY);

// 延迟函数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 带重试的 RSS 抓取
async function fetchRSSWithRetry(source: RSSSource, retries: number = 0): Promise<any> {
  try {
    const feed = await rssParser.parseURL(source.url);
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

// 提取图片
function extractImage(item: any): string | null {
  // 尝试各种可能的图片字段
  if (item.mediaContent?.$?.url) return item.mediaContent.$.url;
  if (item.mediaThumbnail?.$?.url) return item.mediaThumbnail.$.url;
  if (item.enclosure?.url) return item.enclosure.url;
  
  // 从内容中提取
  const content = item.contentEncoded || item.content || item.summary || '';
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch) return imgMatch[1];
  
  return null;
}

// 提取标签
function extractTags(item: any, sourceCategory: string): string[] {
  const tags: string[] = [];
  
  // 从 categories 提取
  if (item.categories && Array.isArray(item.categories)) {
    tags.push(...item.categories.slice(0, 3));
  }
  
  // 从标题提取关键词
  const title = item.title || '';
  const titleLower = title.toLowerCase();
  
  // AI 相关关键词映射
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
  
  // 添加源分类
  if (sourceCategory) {
    tags.push(sourceCategory);
  }
  
  // 去重并限制数量
  return [...new Set(tags)].slice(0, 5);
}

// 生成唯一 ID
function generateId(source: string, title: string, pubDate: string): string {
  const hash = `${source}-${title}-${pubDate}`.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  return `rss_${Math.abs(hash).toString(36)}_${Date.now().toString(36).slice(-4)}`;
}

// 抓取单个 RSS 源
async function crawlSingleSource(source: RSSSource): Promise<{ success: boolean; count: number; error?: string }> {
  return crawlQueue.add(async () => {
    try {
      console.log(`[RSS] Crawling ${source.name}...`);
      
      const feed = await fetchRSSWithRetry(source);
      const items: NewsItem[] = [];
      
      for (const item of feed.items.slice(0, CRAWLER_CONFIG.MAX_ITEMS_PER_SOURCE)) {
        const pubDate = item.pubDate || item.dcDate || item.isoDate || new Date().toISOString();
        
        const newsItem: NewsItem = {
          id: generateId(source.id, item.title || '', pubDate),
          title: item.title?.slice(0, 200) || 'Untitled',
          summary: item.contentSnippet?.slice(0, 500) || item.summary?.slice(0, 500) || '',
          content: item.contentEncoded || item.content || undefined,
          url: item.link || item.guid || '#',
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
        
        items.push(newsItem);
      }
      
      // 添加到数据库
      for (const item of items) {
        // 检查是否已存在
        const existing = db.news.findById(item.id);
        if (!existing) {
          db.news.add(item);
        }
      }
      
      console.log(`[RSS] ${source.name}: ${items.length} items`);
      return { success: true, count: items.length };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`[RSS] Error crawling ${source.name}:`, errorMsg);
      return { success: false, count: 0, error: errorMsg };
    }
  });
}

// 抓取所有 RSS 源
export async function crawlAllRSS(): Promise<{
  success: boolean;
  totalCount: number;
  successCount: number;
  errorCount: number;
  errors: Array<{ source: string; error: string }>;
}> {
  console.log('\n🚀 Starting RSS crawl at', new Date().toISOString());
  console.log('='.repeat(50));
  
  const activeSources = ALL_RSS_SOURCES.filter(s => s.isActive);
  const results = await Promise.allSettled(
    activeSources.map(source => crawlSingleSource(source))
  );
  
  let totalCount = 0;
  let successCount = 0;
  let errorCount = 0;
  const errors: Array<{ source: string; error: string }> = [];
  
  results.forEach((result, index) => {
    const source = activeSources[index];
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
  console.log('✅ RSS crawl completed');
  console.log(`   Total sources: ${activeSources.length}`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Errors: ${errorCount}`);
  console.log(`   Total items: ${totalCount}`);
  
  return {
    success: errorCount === 0,
    totalCount,
    successCount,
    errorCount,
    errors,
  };
}

// 抓取 GitHub Trending
export async function crawlGitHub(): Promise<{ success: boolean; count: number; error?: string }> {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  
  if (!GITHUB_TOKEN) {
    console.warn('⚠️ GITHUB_TOKEN not set, skipping GitHub crawl');
    return { success: false, count: 0, error: 'GITHUB_TOKEN not configured' };
  }

  let totalItems = 0;

  try {
    // 搜索 AI 相关的热门仓库
    const queries = [
      { q: 'artificial intelligence stars:>5000', category: 'AI' },
      { q: 'machine learning stars:>5000', category: '机器学习' },
      { q: 'LLM stars:>3000', category: '大模型' },
      { q: 'AI agent stars:>1000', category: 'AI Agent' },
    ];

    for (const { q, category } of queries) {
      try {
        const response = await fetch(
          `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=5`,
          {
            headers: {
              Authorization: `Bearer ${GITHUB_TOKEN}`,
              Accept: 'application/vnd.github.v3+json',
              'User-Agent': 'NewClaw-Pro',
            },
          }
        );

        if (!response.ok) {
          console.error(`GitHub API error: ${response.status}`);
          continue;
        }

        const data = await response.json();
        
        for (const repo of data.items || []) {
          console.log(`[GitHub] ${category}: ${repo.name} (${repo.stargazers_count} stars)`);
          totalItems++;
        }
      } catch (e) {
        console.error(`Error querying GitHub:`, e);
      }
    }

    console.log(`[GitHub] Total crawled: ${totalItems} repos`);
    return { success: true, count: totalItems };
  } catch (error) {
    console.error('[GitHub] Error:', error);
    return { success: false, count: totalItems, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// 抓取 Hacker News AI 相关内容
export async function crawlHackerNews(): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    // 获取热门故事
    const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    const storyIds = await response.json() as number[];
    
    let aiStories = 0;
    const maxCheck = Math.min(50, storyIds.length);
    
    for (let i = 0; i < maxCheck; i++) {
      const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${storyIds[i]}.json`);
      const story = await storyResponse.json();
      
      if (story && story.title) {
        const title = story.title.toLowerCase();
        if (title.includes('ai') || title.includes('llm') || title.includes('gpt') || 
            title.includes('machine learning') || title.includes('openai') || 
            title.includes('claude') || title.includes('gemini')) {
          console.log(`[HN] AI Story: ${story.title}`);
          aiStories++;
        }
      }
    }
    
    console.log(`[HN] Found ${aiStories} AI-related stories`);
    return { success: true, count: aiStories };
  } catch (error) {
    console.error('[HN] Error:', error);
    return { success: false, count: 0, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// 抓取 Product Hunt
export async function crawlProductHunt(): Promise<{ success: boolean; count: number; error?: string }> {
  const PH_TOKEN = process.env.PRODUCT_HUNT_TOKEN;
  
  if (!PH_TOKEN) {
    console.warn('⚠️ PRODUCT_HUNT_TOKEN not set, skipping Product Hunt crawl');
    return { success: false, count: 0, error: 'PRODUCT_HUNT_TOKEN not configured' };
  }

  try {
    const response = await fetch('https://api.producthunt.com/v2/api/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            posts(first: 10) {
              edges {
                node {
                  id
                  name
                  tagline
                  url
                  votesCount
                  topics {
                    edges {
                      node {
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        `
      }),
    });

    const data = await response.json();
    const posts = data.data?.posts?.edges || [];
    
    // 过滤 AI 相关产品
    const aiPosts = posts.filter((p: any) => {
      const topics = p.node.topics?.edges?.map((t: any) => t.node.name.toLowerCase()) || [];
      return topics.some((t: string) => t.includes('ai') || t.includes('artificial intelligence'));
    });
    
    console.log(`[PH] Found ${aiPosts.length} AI products`);
    return { success: true, count: aiPosts.length };
  } catch (error) {
    console.error('[PH] Error:', error);
    return { success: false, count: 0, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// 运行所有抓取任务
export async function crawlAll() {
  console.log('\n🚀 Starting full crawl at', new Date().toISOString());
  console.log('='.repeat(50));
  
  const results = await Promise.allSettled([
    crawlAllRSS(),
    crawlGitHub(),
    crawlHackerNews(),
    crawlProductHunt(),
  ]);

  const summary = {
    rss: results[0],
    github: results[1],
    hackernews: results[2],
    producthunt: results[3],
  };

  console.log('='.repeat(50));
  console.log('✅ Full crawl completed at', new Date().toISOString());
  
  return summary;
}

// 处理待处理的 AI 文章
export async function processPendingArticles(limit: number = 10) {
  const pendingArticles = db.news.findPendingAIProcessing(limit);
  
  if (pendingArticles.length === 0) {
    console.log('[AI] No pending articles to process');
    return { processed: 0, success: true };
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
  
  // 更新数据库
  let successCount = 0;
  for (const [id, result] of results) {
    const success = db.news.updateAIResult(id, result);
    if (success && result.processingStatus === 'completed') {
      successCount++;
    }
  }
  
  console.log(`[AI] Processed ${successCount}/${pendingArticles.length} articles successfully`);
  
  return {
    processed: pendingArticles.length,
    success: successCount,
    failed: pendingArticles.length - successCount,
  };
}

// 如果直接运行此文件
if (require.main === module) {
  crawlAll().then(async (results) => {
    console.log('\n📊 Crawl Summary:');
    console.log(JSON.stringify(results, null, 2));
    
    // 处理 AI
    const aiResults = await processPendingArticles(10);
    console.log('\n🤖 AI Processing Summary:');
    console.log(JSON.stringify(aiResults, null, 2));
    
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Crawl failed:', error);
    process.exit(1);
  });
}
