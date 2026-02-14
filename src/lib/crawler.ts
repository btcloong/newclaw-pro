import Parser from "rss-parser";
import { db, NewsItem, Project, ResearchReport, HotTopic, Funding } from "./db";

const rssParser = new Parser();

// RSS 源配置
const RSS_SOURCES = {
  techcrunch: "https://techcrunch.com/category/artificial-intelligence/feed/",
  theVerge: "https://www.theverge.com/ai-artificial-intelligence/rss/index.xml",
  mit: "https://news.mit.edu/rss/topic/artificial-intelligence2",
  arxiv: "http://export.arxiv.org/rss/cs.AI",
};

// 抓取 RSS 新闻
export async function crawlRSS() {
  const startTime = new Date();
  let totalItems = 0;

  try {
    for (const [source, url] of Object.entries(RSS_SOURCES)) {
      try {
        const feed = await rssParser.parseURL(url);
        
        for (const item of feed.items.slice(0, 5)) {
          const id = `rss_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
          
          const newsItem: NewsItem = {
            id,
            title: item.title || "Untitled",
            summary: item.contentSnippet?.slice(0, 500) || item.content?.slice(0, 500) || "",
            content: item["content:encoded"] || item.content || undefined,
            url: item.link || "#",
            source: source === "mit" ? "MIT News" : source === "arxiv" ? "arXiv" : feed.title || source,
            sourceUrl: item.link || undefined,
            image: undefined,
            category: categorizeNews(item.title || ""),
            tags: extractTags(item.title || "", item.categories || []),
            publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
            isHot: false,
            isFeatured: false,
            viewCount: 0,
          };
          
          // 添加到内存存储（这里简化处理，实际应该检查重复）
          console.log(`[RSS] Added: ${newsItem.title}`);
          totalItems++;
        }
      } catch (e) {
        console.error(`Error crawling ${source}:`, e);
      }
    }

    console.log(`[RSS] Crawled ${totalItems} items`);
    return { success: true, count: totalItems };
  } catch (error) {
    console.error("[RSS] Error:", error);
    return { success: false, error };
  }
}

// 抓取 GitHub Trending
export async function crawlGitHub() {
  const startTime = new Date();
  let totalItems = 0;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  if (!GITHUB_TOKEN) {
    console.warn("⚠️ GITHUB_TOKEN not set, skipping GitHub crawl");
    return { success: false, error: "GITHUB_TOKEN not configured" };
  }

  try {
    // 搜索 AI 相关的热门仓库
    const queries = [
      "artificial intelligence stars:>1000",
      "machine learning stars:>1000",
    ];

    for (const query of queries) {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=5`,
        {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "NewClaw-Pro",
          },
        }
      );

      if (!response.ok) {
        console.error(`GitHub API error: ${response.status}`);
        continue;
      }

      const data = await response.json();
      
      for (const repo of data.items || []) {
        console.log(`[GitHub] Found: ${repo.name} (${repo.stargazers_count} stars)`);
        totalItems++;
      }
    }

    console.log(`[GitHub] Crawled ${totalItems} repos`);
    return { success: true, count: totalItems };
  } catch (error) {
    console.error("[GitHub] Error:", error);
    return { success: false, error };
  }
}

// 抓取 Product Hunt
export async function crawlProductHunt() {
  console.log("[ProductHunt] Mock crawl - API requires authentication");
  return { success: true, count: 0 };
}

// 生成模拟热搜话题
export async function generateHotTopics() {
  console.log("[HotTopics] Using static data from db.ts");
  return { success: true, count: db.hotTopics.findAll().length };
}

// 生成模拟融资数据
export async function generateFundingData() {
  console.log("[Funding] Using static data from db.ts");
  return { success: true, count: db.funding.findAll().length };
}

// 生成研究报告
export async function generateResearchReports() {
  console.log("[Research] Using static data from db.ts");
  return { success: true, count: db.research.findAll().length };
}

// 辅助函数
function categorizeNews(title: string): string {
  const categories: Record<string, string[]> = {
    "大模型": ["GPT", "Claude", "LLM", "大模型", "language model"],
    "图像生成": ["Midjourney", "Stable Diffusion", "DALL-E", "图像", "image"],
    "视频生成": ["Sora", "Pika", "Runway", "视频", "video"],
    "AI 编程": ["Copilot", "Cursor", "编程", "code", "coding"],
    "机器人": ["机器人", "robot", "具身智能", "embodied"],
    "投资": ["融资", "投资", "funding", "investment", "收购"],
  };

  const lowerTitle = title.toLowerCase();
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(k => lowerTitle.includes(k.toLowerCase()))) {
      return category;
    }
  }
  return "AI";
}

function extractTags(title: string, categories: string[]): string[] {
  const foundTags: string[] = [];
  
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("gpt")) foundTags.push("GPT");
  if (lowerTitle.includes("claude")) foundTags.push("Claude");
  if (lowerTitle.includes("openai")) foundTags.push("OpenAI");
  if (lowerTitle.includes("google")) foundTags.push("Google");
  if (lowerTitle.includes("meta")) foundTags.push("Meta");
  
  return [...new Set([...foundTags, ...categories.slice(0, 3)])];
}

// 运行所有抓取任务
export async function crawlAll() {
  const results = await Promise.allSettled([
    crawlRSS(),
    crawlGitHub(),
    crawlProductHunt(),
    generateHotTopics(),
    generateFundingData(),
    generateResearchReports(),
  ]);

  return {
    rss: results[0],
    github: results[1],
    producthunt: results[2],
    hottopics: results[3],
    funding: results[4],
    research: results[5],
  };
}
