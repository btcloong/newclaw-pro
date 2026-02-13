import { NextResponse } from "next/server";
import { crawlAll, crawlRSS, crawlGitHub, crawlProductHunt } from "@/lib/crawler";

// POST /api/crawl - 手动触发抓取
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get("source");

    let result;

    switch (source) {
      case "rss":
        result = await crawlRSS();
        break;
      case "github":
        result = await crawlGitHub();
        break;
      case "producthunt":
        result = await crawlProductHunt();
        break;
      case "all":
      default:
        result = await crawlAll();
        break;
    }

    return NextResponse.json({
      success: true,
      message: `Crawl completed for source: ${source || "all"}`,
      result,
    });
  } catch (error) {
    console.error("Error during crawl:", error);
    return NextResponse.json(
      { success: false, error: "Failed to crawl" },
      { status: 500 }
    );
  }
}

// GET /api/crawl - 获取抓取状态
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Use POST to trigger crawl",
    sources: ["rss", "github", "producthunt", "all"],
  });
}
