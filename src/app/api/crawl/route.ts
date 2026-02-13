import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/crawl - 手动触发抓取（重新加载示例数据）
export async function POST() {
  try {
    const result = db.recrawl();

    return NextResponse.json({
      success: true,
      message: "Data reloaded successfully",
      result,
    });
  } catch (error) {
    console.error("Error during crawl:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reload data" },
      { status: 500 }
    );
  }
}

// GET /api/crawl - 获取抓取状态
export async function GET() {
  const stats = db.getStats();
  
  return NextResponse.json({
    success: true,
    stats,
    message: "Use POST to reload data",
  });
}
