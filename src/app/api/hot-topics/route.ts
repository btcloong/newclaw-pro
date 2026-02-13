import { NextResponse } from "next/server";
import { db, hotTopics } from "@/lib/db";
import { asc } from "drizzle-orm";

// GET /api/hot-topics - 获取热搜话题
export async function GET() {
  try {
    const results = await db
      .select()
      .from(hotTopics)
      .orderBy(asc(hotTopics.rank))
      .limit(10);

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Error fetching hot topics:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch hot topics" },
      { status: 500 }
    );
  }
}
