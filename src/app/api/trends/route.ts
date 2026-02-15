import { NextRequest, NextResponse } from "next/server";
import { generateTrendSummary } from "../../../lib/ai-processor";
import { db } from "../../../lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "generate") {
      const processedArticles = db.news.findAll({ aiProcessed: true, limit: 30 });
      
      if (processedArticles.length === 0) {
        return NextResponse.json(
          { success: false, error: "No processed articles available" },
          { status: 400 }
        );
      }

      const articlesForSummary = processedArticles.map((a) => ({
        title: a.chineseTitle || a.title,
        summary: a.aiSummary || a.summary,
        category: a.aiCategory || a.category,
        keywords: a.aiKeywords || a.tags,
        scores: a.aiScores || { relevance: 5, quality: 5, timeliness: 5, overall: 5 },
      }));

      const trendSummary = await generateTrendSummary(articlesForSummary);
      db.trendSummary.set(trendSummary);

      return NextResponse.json({
        success: true,
        generated: true,
        summary: trendSummary,
      });
    }

    const trendSummary = db.trendSummary.get();
    
    if (!trendSummary) {
      return NextResponse.json(
        { success: false, error: "No trend summary available" },
        { status: 404 }
      );
    }

    const processedArticles = db.news.findAll({ aiProcessed: true });
    const categoryDistribution: Record<string, number> = {};
    processedArticles.forEach((a) => {
      const cat = a.aiCategory || a.category || "其他";
      categoryDistribution[cat] = (categoryDistribution[cat] || 0) + 1;
    });

    const keywordCount: Record<string, number> = {};
    processedArticles.forEach((a) => {
      const keywords = a.aiKeywords || a.tags || [];
      keywords.forEach((k) => {
        keywordCount[k] = (keywordCount[k] || 0) + 1;
      });
    });

    const keywordCloud = Object.entries(keywordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([keyword, count]) => ({
        keyword,
        count,
        weight: Math.min(5, Math.max(1, Math.ceil(count / 2))),
      }));

    return NextResponse.json({
      success: true,
      summary: trendSummary,
      stats: {
        categoryDistribution,
        keywordCloud,
        totalArticles: processedArticles.length,
      },
    });
  } catch (error) {
    console.error("Trends API error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const processedArticles = db.news.findAll({ aiProcessed: true, limit: 30 });
    
    if (processedArticles.length === 0) {
      return NextResponse.json(
        { success: false, error: "No processed articles available" },
        { status: 400 }
      );
    }

    const articlesForSummary = processedArticles.map((a) => ({
      title: a.chineseTitle || a.title,
      summary: a.aiSummary || a.summary,
      category: a.aiCategory || a.category,
      keywords: a.aiKeywords || a.tags,
      scores: a.aiScores || { relevance: 5, quality: 5, timeliness: 5, overall: 5 },
    }));

    const trendSummary = await generateTrendSummary(articlesForSummary);
    db.trendSummary.set(trendSummary);

    return NextResponse.json({
      success: true,
      summary: trendSummary,
    });
  } catch (error) {
    console.error("Trends generation API error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
