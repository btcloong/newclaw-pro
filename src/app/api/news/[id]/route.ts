import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/news/[id] - 获取单条新闻
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const news = db.news.findById(params.id);

    if (!news) {
      return NextResponse.json(
        { success: false, error: "News not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: news,
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
