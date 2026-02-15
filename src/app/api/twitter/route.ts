import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { 
  crawlTwitter, 
  forceRefreshTwitter, 
  getTweetStats,
  AI_TWITTER_ACCOUNTS 
} from "@/lib/twitter-crawler";

// GET /api/twitter - 获取推文列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const sortBy = searchParams.get("sortBy") as "time" | "popularity" | null;
    const category = searchParams.get("category");
    const isHot = searchParams.get("isHot");
    
    const options: any = { limit };
    if (sortBy) options.sortBy = sortBy;
    if (category) options.category = category;
    if (isHot !== null) options.isHot = isHot === "true";
    
    const tweets = db.tweets.findAll(options);
    
    return NextResponse.json({ 
      success: true, 
      tweets,
      count: tweets.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tweets" },
      { status: 500 }
    );
  }
}

// POST /api/twitter - 触发抓取
export async function POST() {
  try {
    const result = await crawlTwitter();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Crawl Error:", error);
    return NextResponse.json(
      { success: false, error: "Crawl failed" },
      { status: 500 }
    );
  }
}
