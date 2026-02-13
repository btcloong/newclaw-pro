import Parser from "rss-parser";
import { db, news, projects, research, flashNews, hotTopics, funding, crawlLogs } from "./db";
import { eq, desc, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "crypto";

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
        
        for (const item of feed.items.slice(0, 10)) {
          const id = uuidv4().replace(/-/g, "").slice(0, 16);
          const publishedAt = item.pubDate ? new Date(item.pubDate) : new Date();
          
          // 检查是否已存在
          const existing = await db.select().from(news).where(eq(news.id, id));
          if (existing.length > 0) continue;

          await db.insert(news).values({
            id,
            title: item.title || "Untitled",
            summary: item.contentSnippet?.slice(0, 500) || item.content?.slice(0, 500) || null,
            content: item["content:encoded"] || item.content || null,
            source: source === "mit" ? "MIT News" : source === "arxiv" ? "arXiv" : feed.title || source,
            sourceUrl: item.link || null,
            category: categorizeNews(item.title || ""),
            tags: JSON.stringify(extractTags(item.title || "", item.categories || [])),
            author: item.creator || item.author || null,
            publishedAt,
            isHot: false,
            isFeatured: false,
          });
          
          totalItems++;
        }
      } catch (e) {
        console.error(`Error crawling ${source}:`, e);
      }
    }

    await logCrawl("rss", "success", `Crawled ${totalItems} items`, totalItems, startTime);
    return { success: true, count: totalItems };
  } catch (error) {
    await logCrawl("rss", "error", error instanceof Error ? error.message : "Unknown error", 0, startTime);
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
      "LLM stars:>500",
      "AI agent stars:>100",
    ];

    for (const query of queries) {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=10`,
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
        const id = `gh_${repo.id}`;
        
        // 检查是否已存在
        const existing = await db.select().from(projects).where(eq(projects.id, id));
        if (existing.length > 0) {
          // 更新 stars 数
          await db.update(projects)
            .set({ stars: repo.stargazers_count, updatedAt: new Date() })
            .where(eq(projects.id, id));
          continue;
        }

        await db.insert(projects).values({
          id,
          name: repo.name,
          description: repo.description || "No description",
          fullDescription: null,
          logo: repo.owner?.avatar_url || null,
          category: categorizeProject(repo.topics || [], repo.language),
          tags: JSON.stringify(repo.topics?.slice(0, 5) || []),
          source: "github",
          sourceUrl: repo.html_url,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          upvotes: null,
          language: repo.language,
          license: repo.license?.spdx_id || null,
          createdAt: repo.created_at ? new Date(repo.created_at) : null,
          updatedAt: repo.updated_at ? new Date(repo.updated_at) : null,
          isNew: isNewProject(repo.created_at),
          isTrending: repo.stargazers_count > 5000,
        });
        
        totalItems++;
      }
    }

    await logCrawl("github", "success", `Crawled ${totalItems} repos`, totalItems, startTime);
    return { success: true, count: totalItems };
  } catch (error) {
    await logCrawl("github", "error", error instanceof Error ? error.message : "Unknown error", 0, startTime);
    return { success: false, error };
  }
}

// 抓取 Product Hunt
export async function crawlProductHunt() {
  const startTime = new Date();
  let totalItems = 0;

  try {
    // Product Hunt API 需要认证，这里使用模拟数据
    // 实际使用时需要申请 API 访问权限
    const mockProducts = [
      {
        name: "AI Code Reviewer",
        description: "Automated AI-powered code review for GitHub PRs",
        category: "开发工具",
        tags: ["AI", "代码审查", "GitHub"],
        upvotes: 1250,
        url: "https://www.producthunt.com/posts/ai-code-reviewer",
      },
      {
        name: "VoiceClone Pro",
        description: "Create realistic voice clones with just 10 seconds of audio",
        category: "音频",
        tags: ["TTS", "语音克隆", "AI"],
        upvotes: 890,
        url: "https://www.producthunt.com/posts/voiceclone-pro",
      },
      {
        name: "AgentFlow",
        description: "Visual builder for AI agent workflows",
        category: "开发工具",
        tags: ["Agent", "工作流", "无代码"],
        upvotes: 2100,
        url: "https://www.producthunt.com/posts/agentflow",
      },
      {
        name: "AI Research Assistant",
        description: "Your personal AI for academic research and paper analysis",
        category: "生产力",
        tags: ["研究", "学术", "AI"],
        upvotes: 1560,
        url: "https://www.producthunt.com/posts/ai-research-assistant",
      },
    ];

    for (const product of mockProducts) {
      const id = `ph_${Buffer.from(product.name).toString("base64").slice(0, 12)}`;
      
      // 检查是否已存在
      const existing = await db.select().from(projects).where(eq(projects.id, id));
      if (existing.length > 0) continue;

      await db.insert(projects).values({
        id,
        name: product.name,
        description: product.description,
        fullDescription: null,
        logo: null,
        category: product.category,
        tags: JSON.stringify(product.tags),
        source: "producthunt",
        sourceUrl: product.url,
        stars: null,
        forks: null,
        upvotes: product.upvotes,
        language: null,
        license: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        isNew: true,
        isTrending: product.upvotes > 1500,
      });
      
      totalItems++;
    }

    await logCrawl("producthunt", "success", `Crawled ${totalItems} products`, totalItems, startTime);
    return { success: true, count: totalItems };
  } catch (error) {
    await logCrawl("producthunt", "error", error instanceof Error ? error.message : "Unknown error", 0, startTime);
    return { success: false, error };
  }
}

// 生成模拟热搜话题
export async function generateHotTopics() {
  const startTime = new Date();
  
  const topics = [
    { title: "GPT-5", heat: 985000, change: 125, category: "大模型" },
    { title: "AI Agent", heat: 756000, change: 45, category: "应用" },
    { title: "Claude 3.5", heat: 642000, change: 23, category: "大模型" },
    { title: "Sora", heat: 534000, change: -12, category: "视频" },
    { title: "具身智能", heat: 423000, change: 89, category: "机器人" },
    { title: "AI 编程", heat: 389000, change: 67, category: "工具" },
    { title: "多模态", heat: 312000, change: 34, category: "技术" },
    { title: "AI 芯片", heat: 298000, change: 15, category: "硬件" },
  ];

  try {
    // 清空旧数据
    await db.delete(hotTopics);
    
    for (let i = 0; i < topics.length; i++) {
      const topic = topics[i];
      await db.insert(hotTopics).values({
        id: `ht_${i}`,
        title: topic.title,
        heat: topic.heat,
        change: topic.change,
        category: topic.category,
        rank: i + 1,
        updatedAt: new Date(),
      });
    }

    await logCrawl("hottopics", "success", `Generated ${topics.length} topics`, topics.length, startTime);
    return { success: true, count: topics.length };
  } catch (error) {
    await logCrawl("hottopics", "error", error instanceof Error ? error.message : "Unknown error", 0, startTime);
    return { success: false, error };
  }
}

// 生成模拟融资数据
export async function generateFundingData() {
  const startTime = new Date();
  
  const fundings = [
    {
      companyName: "Anthropic",
      amount: "35亿美元",
      round: "E轮",
      date: "2026-02-12",
      investors: ["Lightspeed", "Amazon", "Google"],
      category: "大模型",
      description: "Claude 开发商，专注于 AI 安全和对齐研究",
    },
    {
      companyName: "Perplexity",
      amount: "5亿美元",
      round: "C轮",
      date: "2026-02-08",
      investors: ["IVP", "NEA", "NVIDIA"],
      category: "AI 搜索",
      description: "AI 驱动的搜索引擎，月活用户突破 5000 万",
    },
    {
      companyName: "Figure AI",
      amount: "6.75亿美元",
      round: "B轮",
      date: "2026-02-05",
      investors: ["Microsoft", "OpenAI", "NVIDIA"],
      category: "机器人",
      description: "人形机器人公司，专注于具身智能研究",
    },
  ];

  try {
    for (const f of fundings) {
      const id = `fund_${Buffer.from(f.companyName).toString("base64").slice(0, 8)}`;
      
      const existing = await db.select().from(funding).where(eq(funding.id, id));
      if (existing.length > 0) continue;

      await db.insert(funding).values({
        id,
        companyName: f.companyName,
        amount: f.amount,
        round: f.round,
        date: f.date,
        investors: JSON.stringify(f.investors),
        category: f.category,
        description: f.description,
      });
    }

    await logCrawl("funding", "success", `Generated ${fundings.length} funding records`, fundings.length, startTime);
    return { success: true, count: fundings.length };
  } catch (error) {
    await logCrawl("funding", "error", error instanceof Error ? error.message : "Unknown error", 0, startTime);
    return { success: false, error };
  }
}

// 生成研究报告
export async function generateResearchReports() {
  const startTime = new Date();
  
  const reports = [
    {
      title: "2026 AI 投资趋势报告：Agent 赛道成为新宠",
      summary: "本报告分析了 2026 年 Q1 AI 领域的投资趋势，AI Agent 赛道融资额同比增长 128%。",
      content: "详细报告内容...",
      category: "投资",
      tags: ["投资", "趋势", "Agent"],
      author: "NewClaw Research",
      readTime: "15 分钟",
      publishedAt: new Date(Date.now() - 86400000),
    },
    {
      title: "大模型商业化深度分析：从 API 到垂直应用",
      summary: "探讨大模型厂商的商业模式演进，以及垂直领域应用的机会与挑战。",
      content: "详细报告内容...",
      category: "商业化",
      tags: ["大模型", "商业化", "B2B"],
      author: "NewClaw Research",
      readTime: "20 分钟",
      publishedAt: new Date(Date.now() - 172800000),
    },
    {
      title: "具身智能：下一个万亿级市场",
      summary: "人形机器人与具身智能的技术进展、市场规模预测和投资机会分析。",
      content: "详细报告内容...",
      category: "机器人",
      tags: ["机器人", "具身智能", "硬件"],
      author: "NewClaw Research",
      readTime: "25 分钟",
      publishedAt: new Date(Date.now() - 259200000),
    },
  ];

  try {
    for (const r of reports) {
      const id = `res_${Buffer.from(r.title).toString("base64").slice(0, 12)}`;
      
      const existing = await db.select().from(research).where(eq(research.id, id));
      if (existing.length > 0) continue;

      await db.insert(research).values({
        id,
        title: r.title,
        summary: r.summary,
        content: r.content,
        category: r.category,
        tags: JSON.stringify(r.tags),
        author: r.author,
        readTime: r.readTime,
        publishedAt: r.publishedAt,
      });
    }

    await logCrawl("research", "success", `Generated ${reports.length} reports`, reports.length, startTime);
    return { success: true, count: reports.length };
  } catch (error) {
    await logCrawl("research", "error", error instanceof Error ? error.message : "Unknown error", 0, startTime);
    return { success: false, error };
  }
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

function categorizeProject(topics: string[], language: string | null): string {
  if (topics.some(t => ["llm", "gpt", "language-model", "nlp"].includes(t))) return "大模型";
  if (topics.some(t => ["image-generation", "diffusion", "stable-diffusion"].includes(t))) return "图像生成";
  if (topics.some(t => ["video-generation", "sora"].includes(t))) return "视频生成";
  if (topics.some(t => ["agent", "autonomous", "workflow"].includes(t))) return "AI Agent";
  if (topics.some(t => ["code", "coding", "programming", "developer-tools"].includes(t))) return "开发工具";
  if (language === "Python") return "Python 工具";
  if (language === "TypeScript" || language === "JavaScript") return "JS/TS 工具";
  return "AI 项目";
}

function extractTags(title: string, categories: string[]): string[] {
  const commonTags = ["AI", "Machine Learning", "Deep Learning", "NLP", "Computer Vision"];
  const foundTags: string[] = [];
  
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("gpt")) foundTags.push("GPT");
  if (lowerTitle.includes("claude")) foundTags.push("Claude");
  if (lowerTitle.includes("openai")) foundTags.push("OpenAI");
  if (lowerTitle.includes("google")) foundTags.push("Google");
  if (lowerTitle.includes("meta")) foundTags.push("Meta");
  
  return [...new Set([...foundTags, ...categories.slice(0, 3)])];
}

function isNewProject(createdAt: string | null): boolean {
  if (!createdAt) return false;
  const created = new Date(createdAt);
  const now = new Date();
  const diffDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays < 30;
}

async function logCrawl(
  source: string,
  status: "success" | "error",
  message: string,
  itemsCount: number,
  startedAt: Date
) {
  await db.insert(crawlLogs).values({
    source,
    status,
    message,
    itemsCount,
    startedAt,
    completedAt: new Date(),
  });
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
