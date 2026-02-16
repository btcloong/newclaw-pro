import { NextRequest, NextResponse } from "next/server";
import { 
  crawlAllRSS, 
  crawlByPriority, 
  crawlAuto, 
  processPendingArticles,
  initCrawler,
  getCrawlerStats 
} from "@/lib/crawler-new";

// 验证 API Key
function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get("X-API-Key") || request.headers.get("x-api-key");
  const expectedKey = process.env.API_KEY;
  
  if (!expectedKey) {
    console.warn("[API] API_KEY not set in environment");
    return false;
  }
  
  return apiKey === expectedKey;
}

// GET /api/crawl - 获取爬虫状态
export async function GET(request: NextRequest) {
  try {
    await initCrawler();
    const stats = await getCrawlerStats();
    
    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("[API] Crawl stats error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get crawl stats" },
      { status: 500 }
    );
  }
}

// POST /api/crawl - 触发爬虫
export async function POST(request: NextRequest) {
  try {
    // 验证 API Key
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 解析请求体
    const body = await request.json().catch(() => ({}));
    const { type = "auto", limit = 10 } = body;

    console.log(`[API] Crawl request: type=${type}, limit=${limit}`);

    await initCrawler();

    let result;

    switch (type) {
      case "full":
        result = await crawlAllRSS();
        break;
      case "high":
        result = await crawlByPriority("high");
        break;
      case "medium":
        result = await crawlByPriority("medium");
        break;
      case "low":
        result = await crawlByPriority("low");
        break;
      case "ai":
        result = await processPendingArticles(limit);
        break;
      case "auto":
      default:
        result = await crawlAuto();
        // 自动处理 AI
        if (result.high?.crawled || result.medium?.crawled) {
          await processPendingArticles(5);
        }
        break;
    }

    return NextResponse.json({
      success: true,
      type,
      result,
    });
  } catch (error) {
    console.error("[API] Crawl error:", error);
    return NextResponse.json(
      { success: false, error: "Crawl failed" },
      { status: 500 }
    );
  }
}
