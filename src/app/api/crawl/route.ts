import { NextRequest, NextResponse } from "next/server";
import { crawlAllRSS, crawlByPriority, crawlAuto, processPendingArticles, getCrawlerStats, initCrawler } from "@/lib/crawler-new";
import { generateTrendSummary } from "@/lib/ai-processor";
import { loadNews, saveTrendSummary } from "@/lib/file-db";

// 初始化爬虫
let initialized = false;
async function ensureInitialized() {
  if (!initialized) {
    await initCrawler();
    initialized = true;
  }
}

// POST /api/crawl - 触发爬虫
export async function POST(request: NextRequest) {
  try {
    await ensureInitialized();
    
    const body = await request.json().catch(() => ({}));
    const { 
      type = 'auto', // 'auto' | 'full' | 'high' | 'medium' | 'low'
      processAI = true, 
      generateTrends = true 
    } = body;

    console.log(`[API] Crawl request: type=${type}`);

    let crawlResults;
    
    switch (type) {
      case 'full':
        crawlResults = await crawlAllRSS();
        break;
      case 'high':
      case 'medium':
      case 'low':
        crawlResults = await crawlByPriority(type);
        break;
      case 'auto':
      default:
        crawlResults = await crawlAuto();
        break;
    }

    // AI 处理
    let aiResults = null;
    if (processAI) {
      console.log("[API] Processing AI...");
      aiResults = await processPendingArticles(10);
    }

    // 生成趋势总结
    let trendSummary = null;
    if (generateTrends) {
      console.log("[API] Generating trend summary...");
      const processedArticles = (await loadNews())
        .filter(n => n.aiProcessed)
        .slice(0, 20);
        
      const articlesForSummary = processedArticles.map(a => ({
        title: a.chineseTitle || a.title,
        summary: a.aiSummary || a.summary,
        category: a.aiCategory || a.category,
        keywords: a.aiKeywords || a.tags,
        scores: a.aiScores || { relevance: 5, quality: 5, timeliness: 5, overall: 5 },
      }));
      
      if (articlesForSummary.length > 0) {
        trendSummary = await generateTrendSummary(articlesForSummary);
        await saveTrendSummary(trendSummary);
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results: {
        crawl: crawlResults,
        ai: aiResults,
        trends: trendSummary,
      },
    });
  } catch (error) {
    console.error("Crawl API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET /api/crawl - 获取爬虫状态
export async function GET() {
  try {
    await ensureInitialized();
    const stats = await getCrawlerStats();
    
    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Crawl stats API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
