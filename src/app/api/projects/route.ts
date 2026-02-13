import { NextResponse } from "next/server";
import { db, projects } from "@/lib/db";
import { desc, eq, sql, like, or } from "drizzle-orm";

// GET /api/projects - 获取项目列表
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const category = searchParams.get("category");
    const source = searchParams.get("source");
    const isTrending = searchParams.get("isTrending");
    const isNew = searchParams.get("isNew");
    const search = searchParams.get("search");

    let query = db.select().from(projects);

    // 应用筛选条件
    if (category) {
      query = query.where(eq(projects.category, category));
    }
    if (source) {
      query = query.where(eq(projects.source, source));
    }
    if (isTrending === "true") {
      query = query.where(eq(projects.isTrending, true));
    }
    if (isNew === "true") {
      query = query.where(eq(projects.isNew, true));
    }
    if (search) {
      query = query.where(or(
        like(projects.name, `%${search}%`),
        like(projects.description, `%${search}%`)
      ));
    }

    // 执行查询
    const results = await query
      .orderBy(desc(projects.stars))
      .limit(limit)
      .offset(offset);

    // 获取总数
    const countResult = await db.select({ count: sql`count(*)` }).from(projects);
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
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
