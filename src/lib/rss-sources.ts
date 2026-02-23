/**
 * RSS 数据源配置 - 精简高质量版
 * 只保留 16 个高质量 AI 相关数据源
 */

export type SourcePriority = "high" | "medium" | "low";
export type SourceType = "official" | "media" | "community" | "academic" | "social";

export interface RSSSource {
  id: string;
  name: string;
  xmlUrl: string;
  htmlUrl: string;
  language: "zh" | "en";
  category: string;
  priority: SourcePriority;
  type: SourceType;
  isActive: boolean;
  lastCrawled?: string;
}

// ============ 高质量 AI 数据源 (16个) ============

export const AI_COMPANY_BLOGS: RSSSource[] = [
  {
    id: "openai-blog",
    name: "OpenAI Blog",
    xmlUrl: "https://openai.com/blog/rss.xml",
    htmlUrl: "https://openai.com/blog",
    language: "en",
    category: "大模型",
    priority: "high",
    type: "official",
    isActive: true,
  },
  {
    id: "deepmind-blog",
    name: "DeepMind Blog",
    xmlUrl: "https://deepmind.google/blog/rss.xml",
    htmlUrl: "https://deepmind.google/blog",
    language: "en",
    category: "研究",
    priority: "high",
    type: "official",
    isActive: true,
  },
];

export const AI_RESEARCH_BLOGS: RSSSource[] = [
  {
    id: "andrej-karpathy-blog",
    name: "Andrej Karpathy Blog",
    xmlUrl: "https://karpathy.ai/blog/feed.xml",
    htmlUrl: "https://karpathy.ai/blog",
    language: "en",
    category: "AI研究",
    priority: "high",
    type: "media",
    isActive: true,
  },
  {
    id: "lilian-weng",
    name: "Lilian Weng",
    xmlUrl: "https://lilianweng.github.io/index.xml",
    htmlUrl: "https://lilianweng.github.io",
    language: "en",
    category: "AI研究",
    priority: "high",
    type: "media",
    isActive: true,
  },
  {
    id: "colah-blog",
    name: "Colah's Blog",
    xmlUrl: "http://colah.github.io/rss.xml",
    htmlUrl: "http://colah.github.io",
    language: "en",
    category: "AI研究",
    priority: "high",
    type: "media",
    isActive: true,
  },
  {
    id: "distill-pub",
    name: "Distill.pub",
    xmlUrl: "https://distill.pub/rss.xml",
    htmlUrl: "https://distill.pub",
    language: "en",
    category: "AI研究",
    priority: "high",
    type: "academic",
    isActive: true,
  },
  {
    id: "jalammar-blog",
    name: "Jay Alammar",
    xmlUrl: "https://jalammar.github.io/feed.xml",
    htmlUrl: "https://jalammar.github.io",
    language: "en",
    category: "AI教育",
    priority: "high",
    type: "media",
    isActive: true,
  },
  {
    id: "sebastian-ruder",
    name: "Sebastian Ruder",
    xmlUrl: "https://ruder.io/rss/",
    htmlUrl: "https://ruder.io",
    language: "en",
    category: "NLP研究",
    priority: "medium",
    type: "academic",
    isActive: true,
  },
];

export const TECH_MEDIA: RSSSource[] = [
  {
    id: "ars-technica-ai",
    name: "Ars Technica AI",
    xmlUrl: "https://arstechnica.com/tag/ai/feed/",
    htmlUrl: "https://arstechnica.com/tag/ai/",
    language: "en",
    category: "AI媒体",
    priority: "high",
    type: "media",
    isActive: true,
  },
  {
    id: "producthunt",
    name: "Product Hunt",
    xmlUrl: "https://www.producthunt.com/feed",
    htmlUrl: "https://www.producthunt.com",
    language: "en",
    category: "产品发布",
    priority: "medium",
    type: "community",
    isActive: true,
  },
  {
    id: "one-thing-well",
    name: "One Thing Well",
    xmlUrl: "https://onethingwell.org/rss",
    htmlUrl: "https://onethingwell.org",
    language: "en",
    category: "工具",
    priority: "medium",
    type: "media",
    isActive: true,
  },
  {
    id: "ai-jenius",
    name: "AI Jenius",
    xmlUrl: "https://aijenius.wordpress.com/feed/",
    htmlUrl: "https://aijenius.wordpress.com",
    language: "en",
    category: "AI应用",
    priority: "medium",
    type: "media",
    isActive: true,
  },
];

export const PERSONAL_BLOGS: RSSSource[] = [
  {
    id: "paul-graham",
    name: "Paul Graham",
    xmlUrl: "http://www.aaronsw.com/2002/feeds/pgessays.rss",
    htmlUrl: "https://paulgraham.com",
    language: "en",
    category: "观点",
    priority: "medium",
    type: "media",
    isActive: true,
  },
  {
    id: "simon-willison",
    name: "Simon Willison",
    xmlUrl: "https://simonwillison.net/atom/everything/",
    htmlUrl: "https://simonwillison.net",
    language: "en",
    category: "技术博客",
    priority: "medium",
    type: "media",
    isActive: true,
  },
];

export const CHINESE_MEDIA: RSSSource[] = [
  {
    id: "qbitai",
    name: "量子位",
    xmlUrl: "https://www.qbitai.com/feed",
    htmlUrl: "https://www.qbitai.com",
    language: "zh",
    category: "AI媒体",
    priority: "high",
    type: "media",
    isActive: true,
  },
  {
    id: "ifanr-ai",
    name: "爱范儿",
    xmlUrl: "https://www.ifanr.com/feed",
    htmlUrl: "https://www.ifanr.com",
    language: "zh",
    category: "科技媒体",
    priority: "high",
    type: "media",
    isActive: true,
  },
];

// ============ 合并所有源 ============

export const ALL_RSS_SOURCES: RSSSource[] = [
  ...AI_COMPANY_BLOGS,
  ...AI_RESEARCH_BLOGS,
  ...TECH_MEDIA,
  ...PERSONAL_BLOGS,
  ...CHINESE_MEDIA,
];

// 统计信息
export function getSourcesStats(): {
  total: number;
  english: number;
  chinese: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
  byType: Record<SourceType, number>;
} {
  return {
    total: ALL_RSS_SOURCES.length,
    english: ALL_RSS_SOURCES.filter((s) => s.language === "en").length,
    chinese: ALL_RSS_SOURCES.filter((s) => s.language === "zh").length,
    highPriority: ALL_RSS_SOURCES.filter((s) => s.priority === "high").length,
    mediumPriority: ALL_RSS_SOURCES.filter((s) => s.priority === "medium").length,
    lowPriority: ALL_RSS_SOURCES.filter((s) => s.priority === "low").length,
    byType: {
      official: ALL_RSS_SOURCES.filter((s) => s.type === "official").length,
      media: ALL_RSS_SOURCES.filter((s) => s.type === "media").length,
      community: ALL_RSS_SOURCES.filter((s) => s.type === "community").length,
      academic: ALL_RSS_SOURCES.filter((s) => s.type === "academic").length,
      social: ALL_RSS_SOURCES.filter((s) => s.type === "social").length,
    },
  };
}

// 按优先级获取源
export function getSourcesByPriority(priority: SourcePriority): RSSSource[] {
  return ALL_RSS_SOURCES.filter((s) => s.priority === priority && s.isActive);
}

// 按类型获取源
export function getSourcesByType(type: SourceType): RSSSource[] {
  return ALL_RSS_SOURCES.filter((s) => s.type === type && s.isActive);
}

// 按语言获取源
export function getSourcesByLanguage(lang: "zh" | "en" | "all"): RSSSource[] {
  if (lang === "all") return ALL_RSS_SOURCES.filter((s) => s.isActive);
  return ALL_RSS_SOURCES.filter((s) => s.language === lang && s.isActive);
}

// 获取活跃的源
export function getActiveSources(): RSSSource[] {
  return ALL_RSS_SOURCES.filter((s) => s.isActive);
}
