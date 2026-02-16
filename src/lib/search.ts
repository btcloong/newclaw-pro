/**
 * 搜索系统
 * 支持全文搜索、筛选、排序
 */

import { NewsItem } from "./db";
import { loadNews } from "./file-db";

// 搜索选项
export interface SearchOptions {
  query: string;
  category?: string;
  source?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  isHot?: boolean;
  aiProcessed?: boolean;
  sortBy?: 'relevance' | 'date' | 'score' | 'views';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

// 搜索结果
export interface SearchResult {
  items: NewsItem[];
  total: number;
  hasMore: boolean;
  facets: {
    categories: Array<{ name: string; count: number }>;
    sources: Array<{ name: string; count: number }>;
    tags: Array<{ name: string; count: number }>;
    dateRanges: Array<{ name: string; count: number }>;
  };
}

// 简单的 TF-IDF 实现
class SimpleSearchIndex {
  private documents: Map<string, NewsItem> = new Map();
  private invertedIndex: Map<string, Set<string>> = new Map();
  private documentFrequency: Map<string, number> = new Map();
  private totalDocuments: number = 0;

  // 分词
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 1);
  }

  // 添加文档到索引
  addDocument(doc: NewsItem): void {
    if (this.documents.has(doc.id)) {
      this.removeDocument(doc.id);
    }

    this.documents.set(doc.id, doc);
    this.totalDocuments++;

    // 提取可搜索文本
    const searchableText = [
      doc.title,
      doc.chineseTitle,
      doc.summary,
      doc.aiSummary,
      doc.source,
      doc.category,
      ...(doc.tags || []),
      ...(doc.aiKeywords || []),
    ].filter(Boolean).join(' ');

    const tokens = this.tokenize(searchableText);
    const uniqueTokens = new Set(tokens);

    for (const token of uniqueTokens) {
      // 更新倒排索引
      if (!this.invertedIndex.has(token)) {
        this.invertedIndex.set(token, new Set());
      }
      this.invertedIndex.get(token)!.add(doc.id);

      // 更新文档频率
      this.documentFrequency.set(
        token,
        (this.documentFrequency.get(token) || 0) + 1
      );
    }
  }

  // 从索引中移除文档
  removeDocument(docId: string): void {
    const doc = this.documents.get(docId);
    if (!doc) return;

    this.documents.delete(docId);
    this.totalDocuments--;

    // 更新倒排索引
    for (const [token, docIds] of this.invertedIndex.entries()) {
      if (docIds.has(docId)) {
        docIds.delete(docId);
        if (docIds.size === 0) {
          this.invertedIndex.delete(token);
          this.documentFrequency.delete(token);
        } else {
          this.documentFrequency.set(token, docIds.size);
        }
      }
    }
  }

  // 计算 TF-IDF 分数
  private calculateTfIdf(token: string, docId: string): number {
    const doc = this.documents.get(docId);
    if (!doc) return 0;

    // 计算 TF
    const searchableText = [
      doc.title,
      doc.chineseTitle,
      doc.summary,
      doc.aiSummary,
    ].filter(Boolean).join(' ');
    
    const tokens = this.tokenize(searchableText);
    const tokenCount = tokens.filter(t => t === token).length;
    const tf = tokenCount / tokens.length;

    // 计算 IDF
    const df = this.documentFrequency.get(token) || 0;
    const idf = Math.log(this.totalDocuments / (df + 1)) + 1;

    return tf * idf;
  }

  // 搜索
  search(query: string, limit: number = 20): Array<{ docId: string; score: number }> {
    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0) return [];

    const scores = new Map<string, number>();

    for (const token of queryTokens) {
      const docIds = this.invertedIndex.get(token);
      if (!docIds) continue;

      for (const docId of docIds) {
        const score = this.calculateTfIdf(token, docId);
        scores.set(docId, (scores.get(docId) || 0) + score);
      }
    }

    // 按分数排序
    return Array.from(scores.entries())
      .map(([docId, score]) => ({ docId, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  // 获取所有文档
  getAllDocuments(): NewsItem[] {
    return Array.from(this.documents.values());
  }

  // 清空索引
  clear(): void {
    this.documents.clear();
    this.invertedIndex.clear();
    this.documentFrequency.clear();
    this.totalDocuments = 0;
  }
}

// 全局搜索索引实例
const searchIndex = new SimpleSearchIndex();
let isIndexInitialized = false;

// 初始化搜索索引
export async function initSearchIndex(): Promise<void> {
  if (isIndexInitialized) return;

  console.log('[Search] Initializing search index...');
  
  const news = await loadNews();
  
  for (const article of news) {
    searchIndex.addDocument(article);
  }

  isIndexInitialized = true;
  console.log(`[Search] Index initialized with ${news.length} documents`);
}

// 添加文章到索引
export async function addToSearchIndex(article: NewsItem): Promise<void> {
  searchIndex.addDocument(article);
}

// 从索引中移除文章
export async function removeFromSearchIndex(articleId: string): Promise<void> {
  searchIndex.removeDocument(articleId);
}

// 搜索文章
export async function searchNews(options: SearchOptions): Promise<SearchResult> {
  await initSearchIndex();

  const {
    query,
    category,
    source,
    tags,
    dateFrom,
    dateTo,
    isHot,
    aiProcessed,
    sortBy = 'relevance',
    sortOrder = 'desc',
    limit = 20,
    offset = 0,
  } = options;

  let results: NewsItem[] = [];

  // 如果有查询词，使用全文搜索
  if (query.trim()) {
    const searchResults = searchIndex.search(query, 100);
    results = searchResults
      .map(r => searchIndex['documents'].get(r.docId))
      .filter(Boolean) as NewsItem[];
  } else {
    // 否则获取所有文档
    results = searchIndex.getAllDocuments();
  }

  // 应用筛选
  if (category) {
    results = results.filter(r => 
      r.category === category || r.aiCategory === category
    );
  }

  if (source) {
    results = results.filter(r => r.source === source);
  }

  if (tags && tags.length > 0) {
    results = results.filter(r => 
      tags.some(tag => r.tags?.includes(tag) || r.aiKeywords?.includes(tag))
    );
  }

  if (dateFrom) {
    const fromDate = new Date(dateFrom).getTime();
    results = results.filter(r => new Date(r.publishedAt).getTime() >= fromDate);
  }

  if (dateTo) {
    const toDate = new Date(dateTo).getTime();
    results = results.filter(r => new Date(r.publishedAt).getTime() <= toDate);
  }

  if (isHot !== undefined) {
    results = results.filter(r => r.isHot === isHot);
  }

  if (aiProcessed !== undefined) {
    results = results.filter(r => r.aiProcessed === aiProcessed);
  }

  // 排序
  results.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        comparison = new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        break;
      case 'score':
        comparison = (b.aiScores?.overall || 0) - (a.aiScores?.overall || 0);
        break;
      case 'views':
        comparison = (b.viewCount || 0) - (a.viewCount || 0);
        break;
      case 'relevance':
      default:
        // 相关性已在搜索时排序
        break;
    }

    return sortOrder === 'asc' ? -comparison : comparison;
  });

  const total = results.length;
  const paginatedResults = results.slice(offset, offset + limit);
  const hasMore = offset + limit < total;

  // 计算 facets
  const facets = {
    categories: calculateFacet(results, r => r.aiCategory || r.category),
    sources: calculateFacet(results, r => r.source),
    tags: calculateFacet(results, r => r.tags || [], true),
    dateRanges: calculateDateRanges(results),
  };

  return {
    items: paginatedResults,
    total,
    hasMore,
    facets,
  };
}

// 计算 facet
function calculateFacet(
  items: NewsItem[],
  getter: (item: NewsItem) => string | string[],
  isArray: boolean = false
): Array<{ name: string; count: number }> {
  const counts = new Map<string, number>();

  for (const item of items) {
    const value = getter(item);
    if (isArray && Array.isArray(value)) {
      for (const v of value) {
        counts.set(v, (counts.get(v) || 0) + 1);
      }
    } else if (typeof value === 'string') {
      counts.set(value, (counts.get(value) || 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

// 计算日期范围 facet
function calculateDateRanges(items: NewsItem[]): Array<{ name: string; count: number }> {
  const now = new Date();
  const ranges = [
    { name: '今天', days: 1 },
    { name: '本周', days: 7 },
    { name: '本月', days: 30 },
    { name: '更早', days: Infinity },
  ];

  const counts = ranges.map(range => {
    if (range.days === Infinity) {
      const count = items.filter(item => {
        const days = (now.getTime() - new Date(item.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
        return days > 30;
      }).length;
      return { name: range.name, count };
    } else {
      const count = items.filter(item => {
        const days = (now.getTime() - new Date(item.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
        return days <= range.days;
      }).length;
      return { name: range.name, count };
    }
  });

  return counts;
}

// 获取搜索建议
export async function getSearchSuggestions(query: string, limit: number = 10): Promise<string[]> {
  await initSearchIndex();

  if (!query.trim()) return [];

  const results = searchIndex.search(query, limit);
  const suggestions: string[] = [];

  for (const result of results) {
    const doc = searchIndex['documents'].get(result.docId);
    if (doc) {
      suggestions.push(doc.chineseTitle || doc.title);
    }
  }

  return suggestions;
}

// 获取热门搜索
export async function getTrendingSearches(): Promise<string[]> {
  // 基于当前热门内容生成搜索建议
  const news = await loadNews();
  const hotNews = news.filter(n => n.isHot).slice(0, 10);
  
  return hotNews.map(n => n.chineseTitle || n.title).slice(0, 5);
}

// 重建索引
export async function rebuildSearchIndex(): Promise<void> {
  console.log('[Search] Rebuilding index...');
  searchIndex.clear();
  isIndexInitialized = false;
  await initSearchIndex();
  console.log('[Search] Index rebuilt');
}
