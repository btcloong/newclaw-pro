import { NextRequest, NextResponse } from "next/server";
import { processArticleWithAI, batchProcessArticles, testGeminiConnection } from "../../../lib/ai-processor";
import { db } from "../../../lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { articleId, processAll = false, limit = 10 } = body;

    if (articleId) {
      const article = db.news.findById(articleId);
      if (!article) {
        return NextResponse.json(
          { success: false, error: "Article not found" },
          { status: 404 }
        );
      }

      const result = await processArticleWithAI(
        article.title,
        article.content || article.summary,
        article.url,
        article.source,
        article.publishedAt
      );

      const updated = db.news.updateAIResult(articleId, result);

      return NextResponse.json({
        success: updated,
        result,
      });
    }

    if (processAll) {
      const pendingArticles = db.news.findPendingAIProcessing(limit);
      
      if (pendingArticles.length === 0) {
        return NextResponse.json({
          success: true,
          message: "No pending articles to process",
          processed: 0,
        });
      }

      const articlesToProcess = pendingArticles.map((article) => ({
        id: article.id,
        title: article.title,
        content: article.content || article.summary,
        url: article.url,
        source: article.source,
        publishedAt: article.publishedAt,
      }));

      const results = await batchProcessArticles(articlesToProcess, 3);

      let successCount = 0;
      for (const [id, result] of results) {
        const success = db.news.updateAIResult(id, result);
        if (success && result.processingStatus === "completed") {
          successCount++;
        }
      }

      return NextResponse.json({
        success: true,
        processed: pendingArticles.length,
        successCount,
        failed: pendingArticles.length - successCount,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid request. Provide articleId or set processAll to true" },
      { status: 400 }
    );
  } catch (error) {
    console.error("AI process API error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "test") {
      const result = await testGeminiConnection();
      return NextResponse.json(result);
    }

    if (action === "pending") {
      const limit = parseInt(searchParams.get("limit") || "10", 10);
      const pending = db.news.findPendingAIProcessing(limit);
      return NextResponse.json({
        success: true,
        count: pending.length,
        articles: pending.map((a) => ({
          id: a.id,
          title: a.title,
          source: a.source,
          publishedAt: a.publishedAt,
        })),
      });
    }

    const stats = db.getStats();
    const processed = db.news.findAll({ aiProcessed: true });

    return NextResponse.json({
      success: true,
      stats: {
        total: stats.newsCount,
        processed: stats.aiProcessedCount,
        pending: stats.newsCount - stats.aiProcessedCount,
      },
      recentProcessed: processed.slice(0, 5).map((a) => ({
        id: a.id,
        title: a.chineseTitle || a.title,
        overall: a.aiScores?.overall,
        category: a.aiCategory,
      })),
    });
  } catch (error) {
    console.error("AI process status API error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
