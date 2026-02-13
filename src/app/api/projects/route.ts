import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/projects - 获取项目列表
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const source = searchParams.get("source");

    const results = db.projects.findAll({ limit, source: source || undefined });
    const total = db.projects.count();

    return NextResponse.json({
      success: true,
      data: results,
      pagination: {
        total,
        limit,
        hasMore: results.length >= limit,
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
