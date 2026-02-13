import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/news - 获取新闻列表
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const category = searchParams.get("category");

    const results = db.news.findAll({ limit, offset, category: category || undefined });
    const total = db.news.count();

    return NextResponse.json({
      success: true,
      data: results,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
