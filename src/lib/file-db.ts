/**
 * 文件存储数据库
 * 用于数据持久化，支持新闻、项目、趋势等数据的文件存储
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import { NewsItem, Project, ResearchReport, HotTopic, Funding, Tweet, TwitterTrend, DailyTrendSummary } from './db';

// 数据目录
const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), 'data');

// 文件路径
const PATHS = {
  news: join(DATA_DIR, 'news.json'),
  projects: join(DATA_DIR, 'projects.json'),
  research: join(DATA_DIR, 'research.json'),
  hotTopics: join(DATA_DIR, 'hot-topics.json'),
  funding: join(DATA_DIR, 'funding.json'),
  tweets: join(DATA_DIR, 'tweets.json'),
  twitterTrends: join(DATA_DIR, 'twitter-trends.json'),
  trendSummary: join(DATA_DIR, 'trend-summary.json'),
  crawlState: join(DATA_DIR, 'crawl-state.json'),
  seenUrls: join(DATA_DIR, 'seen-urls.json'),
};

// 爬虫状态
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

// 确保数据目录存在
async function ensureDataDir(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create data directory:', error);
  }
}

// 读取JSON文件
async function readJsonFile<T>(path: string, defaultValue: T): Promise<T> {
  try {
    const data = await fs.readFile(path, 'utf-8');
    return JSON.parse(data) as T;
  } catch {
    return defaultValue;
  }
}

// 写入JSON文件
async function writeJsonFile<T>(path: string, data: T): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(path, JSON.stringify(data, null, 2), 'utf-8');
}

// ============ News 操作 ============
export async function loadNews(): Promise<NewsItem[]> {
  return readJsonFile<NewsItem[]>(PATHS.news, []);
}

export async function saveNews(news: NewsItem[]): Promise<void> {
  await writeJsonFile(PATHS.news, news);
}

export async function addNewsItem(item: NewsItem): Promise<void> {
  const news = await loadNews();
  // 去重检查
  const exists = news.some(n => n.url === item.url || n.id === item.id);
  if (!exists) {
    news.unshift(item);
    // 保留最近7天的数据
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const filtered = news.filter(n => new Date(n.publishedAt) > sevenDaysAgo);
    await saveNews(filtered);
  }
}

export async function updateNewsItem(id: string, updates: Partial<NewsItem>): Promise<void> {
  const news = await loadNews();
  const index = news.findIndex(n => n.id === id);
  if (index !== -1) {
    news[index] = { ...news[index], ...updates };
    await saveNews(news);
  }
}

// ============ Projects 操作 ============
export async function loadProjects(): Promise<Project[]> {
  return readJsonFile<Project[]>(PATHS.projects, []);
}

export async function saveProjects(projects: Project[]): Promise<void> {
  await writeJsonFile(PATHS.projects, projects);
}

// ============ Research 操作 ============
export async function loadResearch(): Promise<ResearchReport[]> {
  return readJsonFile<ResearchReport[]>(PATHS.research, []);
}

export async function saveResearch(research: ResearchReport[]): Promise<void> {
  await writeJsonFile(PATHS.research, research);
}

// ============ Hot Topics 操作 ============
export async function loadHotTopics(): Promise<HotTopic[]> {
  return readJsonFile<HotTopic[]>(PATHS.hotTopics, []);
}

export async function saveHotTopics(topics: HotTopic[]): Promise<void> {
  await writeJsonFile(PATHS.hotTopics, topics);
}

// ============ Funding 操作 ============
export async function loadFunding(): Promise<Funding[]> {
  return readJsonFile<Funding[]>(PATHS.funding, []);
}

export async function saveFunding(funding: Funding[]): Promise<void> {
  await writeJsonFile(PATHS.funding, funding);
}

// ============ Tweets 操作 ============
export async function loadTweets(): Promise<Tweet[]> {
  return readJsonFile<Tweet[]>(PATHS.tweets, []);
}

export async function saveTweets(tweets: Tweet[]): Promise<void> {
  await writeJsonFile(PATHS.tweets, tweets);
}

export async function addTweet(tweet: Tweet): Promise<void> {
  const tweets = await loadTweets();
  const exists = tweets.some(t => t.id === tweet.id);
  if (!exists) {
    tweets.unshift(tweet);
    // 保留最近7天的数据
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const filtered = tweets.filter(t => new Date(t.publishedAt) > sevenDaysAgo);
    await saveTweets(filtered);
  }
}

// ============ Twitter Trends 操作 ============
export async function loadTwitterTrends(): Promise<TwitterTrend[]> {
  return readJsonFile<TwitterTrend[]>(PATHS.twitterTrends, []);
}

export async function saveTwitterTrends(trends: TwitterTrend[]): Promise<void> {
  await writeJsonFile(PATHS.twitterTrends, trends);
}

// ============ Trend Summary 操作 ============
export async function loadTrendSummary(): Promise<DailyTrendSummary | null> {
  return readJsonFile<DailyTrendSummary | null>(PATHS.trendSummary, null);
}

export async function saveTrendSummary(summary: DailyTrendSummary): Promise<void> {
  await writeJsonFile(PATHS.trendSummary, summary);
}

// ============ Crawl State 操作 ============
export async function loadCrawlState(): Promise<CrawlState> {
  return readJsonFile<CrawlState>(PATHS.crawlState, {
    lastCrawlTime: null,
    lastAIProcessingTime: null,
    lastFullCrawlTime: null,
    sourceStates: {},
  });
}

export async function saveCrawlState(state: CrawlState): Promise<void> {
  await writeJsonFile(PATHS.crawlState, state);
}

export async function updateLastCrawlTime(): Promise<void> {
  const state = await loadCrawlState();
  state.lastCrawlTime = new Date().toISOString();
  await saveCrawlState(state);
}

export async function updateSourceState(sourceId: string, success: boolean): Promise<void> {
  const state = await loadCrawlState();
  const existing = state.sourceStates[sourceId] || { errorCount: 0 };
  state.sourceStates[sourceId] = {
    lastCrawled: new Date().toISOString(),
    lastSuccess: success,
    errorCount: success ? 0 : (existing.errorCount || 0) + 1,
  };
  await saveCrawlState(state);
}

// ============ Seen URLs (去重) ============
export async function loadSeenUrls(): Promise<Set<string>> {
  const urls = await readJsonFile<string[]>(PATHS.seenUrls, []);
  return new Set(urls);
}

export async function saveSeenUrls(urls: Set<string>): Promise<void> {
  await writeJsonFile(PATHS.seenUrls, Array.from(urls));
}

export async function isUrlSeen(url: string): Promise<boolean> {
  const seen = await loadSeenUrls();
  return seen.has(url);
}

export async function markUrlAsSeen(url: string): Promise<void> {
  const seen = await loadSeenUrls();
  seen.add(url);
  // 只保留最近10000个URL
  const urls = Array.from(seen);
  if (urls.length > 10000) {
    urls.splice(0, urls.length - 10000);
  }
  await saveSeenUrls(new Set(urls));
}

// ============ 初始化 ============
export async function initFileDb(): Promise<void> {
  await ensureDataDir();
  console.log('[FileDB] Initialized at:', DATA_DIR);
}
