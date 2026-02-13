import { NextResponse } from "next/server";
import { db, news } from "@/lib/db";
import { desc, eq, sql, like, or } from "drizzle-orm";

// GET /api/news - 获取新闻列表
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const category = searchParams.get("category");
    const isHot = searchParams.get("isHot");
    const isFeatured = searchParams.get("isFeatured");
    const search = searchParams.get("search");

    let query = db.select().from(news);

    // 应用筛选条件
    if (category) {
      query = query.where(eq(news.category, category));
    }
    if (isHot === "true") {
      query = query.where(eq(news.isHot, true));
    }
    if (isFeatured === "true") {
      query = query.where(eq(news.isFeatured, true));
    }
    if (search) {
      query = query.where(or(
        like(news.title, `%${search}%`),
        like(news.summary, `%${search}%`)
      ));
    }

    // 执行查询
    const results = await query
      .orderBy(desc(news.publishedAt))
      .limit(limit)
      .offset(offset);

    // 获取总数
    const countResult = await db.select({ count: sql`count(*)` }).from(news);
    const total = countResult[0]?.count || 0;

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
