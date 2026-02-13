import { NextResponse } from "next/server";
import { db, news } from "@/lib/db";
import { eq } from "drizzle-orm";

// GET /api/news/[id] - 获取新闻详情
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const result = await db.select().from(news).where(eq(news.id, id));

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "News not found" },
        { status: 404 }
      );
    }

    // 增加浏览量
    await db.update(news)
      .set({ viewCount: (result[0].viewCount || 0) + 1 })
      .where(eq(news.id, id));

    return NextResponse.json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error("Error fetching news detail:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch news detail" },
      { status: 500 }
    );
  }
}
