import Parser from "rss-parser";
import { db, NewsItem, Project } from "./db";

const rssParser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; NewClawBot/1.0)'
  }
});

// 真实的 RSS 新闻源配置
const RSS_SOURCES = {
  // AI 公司官方博客
  openai: {
    url: "https://openai.com/blog/rss.xml",
    name: "OpenAI Blog",
    category: "大模型"
  },
  googleAI: {
    url: "https://blog.google/technology/ai/rss/",
    name: "Google AI Blog",
    category: "大模型"
  },
  anthropic: {
    url: "https://www.anthropic.com/news/rss.xml",
    name: "Anthropic",
    category: "大模型"
  },
  // 科技媒体
  techcrunchAI: {
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    name: "TechCrunch AI",
    category: "AI资讯"
  },
  theVergeAI: {
    url: "https://www.theverge.com/ai-artificial-intelligence/rss/index.xml",
    name: "The Verge AI",
    category: "AI资讯"
  },
  // 学术资源
  arxivAI: {
    url: "http://export.arxiv.org/rss/cs.AI",
    name: "arXiv AI",
    category: "学术研究"
  },
};

// 抓取 RSS 新闻
export async function crawlRSS(): Promise<{ success: boolean; count: number; errors: string[] }> {
  const errors: string[] = [];
  let totalItems = 0;

  for (const [key, source] of Object.entries(RSS_SOURCES)) {
    try {
      console.log(`[RSS] Crawling ${source.name}...`);
      
      const feed = await rssParser.parseURL(source.url);
      
      for (const item of feed.items.slice(0, 5)) {
        const id = `rss_${key}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        
        const newsItem: NewsItem = {
          id,
          title: item.title?.slice(0, 200) || "Untitled",
          summary: item.contentSnippet?.slice(0, 500) || item.content?.slice(0, 500) || "",
          content: item["content:encoded"] || item.content || undefined,
          url: item.link || "#",
          source: source.name,
          sourceUrl: item.link || undefined,
          image: extractImage(item) || undefined,
          category: source.category,
          tags: extractTags(item.title || "", item.categories || []),
          publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
          isHot: false,
          isFeatured: false,
          viewCount: 0,
        };
        
        // 这里可以添加到数据库
        console.log(`[RSS] Added: ${newsItem.title}`);
        totalItems++;
      }
      
      console.log(`[RSS] ${source.name}: ${feed.items.length} items`);
    } catch (e) {
      const errorMsg = `Error crawling ${source.name}: ${e instanceof Error ? e.message : String(e)}`;
      console.error(errorMsg);
      errors.push(errorMsg);
    }
  }

  console.log(`[RSS] Total crawled: ${totalItems} items`);
  return { success: errors.length === 0, count: totalItems, errors };
}

// 抓取 GitHub Trending
export async function crawlGitHub(): Promise<{ success: boolean; count: number; error?: string }> {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  
  if (!GITHUB_TOKEN) {
    console.warn("⚠️ GITHUB_TOKEN not set, skipping GitHub crawl");
    return { success: false, count: 0, error: "GITHUB_TOKEN not configured" };
  }

  let totalItems = 0;

  try {
    // 搜索 AI 相关的热门仓库
    const queries = [
      { q: "artificial intelligence stars:>5000", category: "AI" },
      { q: "machine learning stars:>5000", category: "机器学习" },
      { q: "LLM stars:>3000", category: "大模型" },
      { q: "AI agent stars:>1000", category: "AI Agent" },
    ];

    for (const { q, category } of queries) {
      try {
        const response = await fetch(
          `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=5`,
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
    console.error("[GitHub] Error:", error);
    return { success: false, count: totalItems, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// 抓取 Hacker News AI 相关内容
export async function crawlHackerNews(): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    // 获取热门故事
    const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
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
    console.error("[HN] Error:", error);
    return { success: false, count: 0, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// 抓取 Product Hunt (需要 API Key)
export async function crawlProductHunt(): Promise<{ success: boolean; count: number; error?: string }> {
  const PH_TOKEN = process.env.PRODUCT_HUNT_TOKEN;
  
  if (!PH_TOKEN) {
    console.warn("⚠️ PRODUCT_HUNT_TOKEN not set, using mock data");
    return { success: false, count: 0, error: "PRODUCT_HUNT_TOKEN not configured" };
  }

  try {
    const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PH_TOKEN}`,
        "Content-Type": "application/json",
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
    console.error("[PH] Error:", error);
    return { success: false, count: 0, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

// 辅助函数：提取图片
function extractImage(item: any): string | null {
  // 尝试从内容中提取图片
  const content = item["content:encoded"] || item.content || "";
  const imgMatch = content.match(/<img[^>]+src="([^"]+)"/);
  if (imgMatch) return imgMatch[1];
  
  // 尝试从 media 内容中提取
  if (item.media?.content?.url) return item.media.content.url;
  if (item.enclosure?.url) return item.enclosure.url;
  
  return null;
}

// 辅助函数：提取标签
function extractTags(title: string, categories: string[]): string[] {
  const tags: string[] = [];
  const lowerTitle = title.toLowerCase();
  
  // 常见 AI 标签
  const tagMap: Record<string, string[]> = {
    'gpt': ['GPT', 'OpenAI'],
    'claude': ['Claude', 'Anthropic'],
    'gemini': ['Gemini', 'Google'],
    'llama': ['Llama', 'Meta'],
    'deepseek': ['DeepSeek'],
    'openai': ['OpenAI'],
    'google': ['Google'],
    'anthropic': ['Anthropic'],
    'meta': ['Meta'],
    'xai': ['xAI'],
    'grok': ['Grok', 'xAI'],
    'ai agent': ['AI Agent'],
    'multimodal': ['多模态'],
    'reasoning': ['推理模型'],
  };
  
  for (const [keyword, tagList] of Object.entries(tagMap)) {
    if (lowerTitle.includes(keyword)) {
      tags.push(...tagList);
    }
  }
  
  // 添加分类标签
  if (categories) {
    tags.push(...categories.slice(0, 3));
  }
  
  return [...new Set(tags)];
}

// 运行所有抓取任务
export async function crawlAll() {
  console.log("\n🚀 Starting crawl at", new Date().toISOString());
  console.log("=" .repeat(50));
  
  const results = await Promise.allSettled([
    crawlRSS(),
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

  console.log("=" .repeat(50));
  console.log("✅ Crawl completed at", new Date().toISOString());
  
  return summary;
}

// 如果直接运行此文件
if (require.main === module) {
  crawlAll().then((results) => {
    console.log("\n📊 Crawl Summary:");
    console.log(JSON.stringify(results, null, 2));
    process.exit(0);
  }).catch((error) => {
    console.error("❌ Crawl failed:", error);
    process.exit(1);
  });
}
