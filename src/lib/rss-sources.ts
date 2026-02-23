/**
 * RSS 数据源配置 - 精简高质量版
 * 只保留 14 个高质量 AI 相关数据源（正式文章，非个人博客）
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

// ============ 高质量 AI 数据源 (14个) ============

// AI 公司官方博客
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

// AI 研究/学术机构（正式研究文章）
export const AI_RESEARCH_BLOGS: RSSSource[] = [
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
    id: "ai2-blog",
    name: "Allen Institute for AI",
    xmlUrl: "https://blog.allenai.org/feed",
    htmlUrl: "https://blog.allenai.org",
    language: "en",
    category: "AI研究",
    priority: "high",
    type: "academic",
    isActive: true,
  },
  {
    id: "baai",
    name: "北京智源研究院",
    xmlUrl: "https://www.baai.ac.cn/rss",
    htmlUrl: "https://www.baai.ac.cn",
    language: "zh",
    category: "AI研究",
    priority: "high",
    type: "academic",
    isActive: true,
  },
];

// 专业科技媒体
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
    id: "mit-tech-review",
    name: "MIT Technology Review",
    xmlUrl: "https://www.technologyreview.com/feed/",
    htmlUrl: "https://www.technologyreview.com",
    language: "en",
    category: "科技媒体",
    priority: "high",
    type: "media",
    isActive: true,
  },
  {
    id: "wired-ai",
    name: "Wired AI",
    xmlUrl: "https://www.wired.com/feed/tag/ai/latest/rss",
    htmlUrl: "https://www.wired.com/tag/ai/",
    language: "en",
    category: "科技媒体",
    priority: "high",
    type: "media",
    isActive: true,
  },
  {
    id: "venturebeat-ai",
    name: "VentureBeat AI",
    xmlUrl: "https://venturebeat.com/category/ai/feed/",
    htmlUrl: "https://venturebeat.com/category/ai/",
    language: "en",
    category: "AI商业",
    priority: "medium",
    type: "media",
    isActive: true,
  },
  {
    id: "techcrunch-ai",
    name: "TechCrunch AI",
    xmlUrl: "https://techcrunch.com/category/artificial-intelligence/feed/",
    htmlUrl: "https://techcrunch.com/category/artificial-intelligence/",
    language: "en",
    category: "AI创业",
    priority: "medium",
    type: "media",
    isActive: true,
  },
];

// 中文科技媒体
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
  {
    id: "jiqizhixin",
    name: "机器之心",
    xmlUrl: "https://www.jiqizhixin.com/rss",
    htmlUrl: "https://www.jiqizhixin.com",
    language: "zh",
    category: "AI媒体",
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
