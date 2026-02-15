import { NextRequest, NextResponse } from "next/server";
import { crawlAll, processPendingArticles } from "@/lib/crawler";
import { generateTrendSummary } from "@/lib/ai-processor";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { processAI = true, generateTrends = true } = body;

    console.log("[API] Starting crawl...");
    const crawlResults = await crawlAll();

    let aiResults = null;
    if (processAI) {
      console.log("[API] Processing AI...");
      aiResults = await processPendingArticles(10);
    }

    let trendSummary = null;
    if (generateTrends) {
      console.log("[API] Generating trend summary...");
      const processedArticles = db.news.findAll({ aiProcessed: true, limit: 20 });
      const articlesForSummary = processedArticles.map(a => ({
        title: a.chineseTitle || a.title,
        summary: a.aiSummary || a.summary,
        category: a.aiCategory || a.category,
        keywords: a.aiKeywords || a.tags,
        scores: a.aiScores || { relevance: 5, quality: 5, timeliness: 5, overall: 5 },
      }));
      
      if (articlesForSummary.length > 0) {
        trendSummary = await generateTrendSummary(articlesForSummary);
        db.trendSummary.set(trendSummary);
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

export async function GET() {
  return NextResponse.json({ message: "Use POST to trigger crawl" });
}
