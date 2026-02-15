import { NextResponse } from "next/server";
import { getTweetStats } from "@/lib/twitter-crawler";

// GET /api/twitter/stats - 获取 Twitter 统计数据
export async function GET() {
  try {
    const stats = getTweetStats();
    
    return NextResponse.json({ 
      success: true, 
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
