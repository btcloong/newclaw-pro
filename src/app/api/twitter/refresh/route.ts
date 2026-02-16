import { NextResponse } from "next/server";
import { forceRefreshTwitter } from "@/lib/twitter-crawler";

// POST /api/twitter/refresh - 强制刷新 Twitter 数据
export async function POST() {
  try {
    const result = await forceRefreshTwitter();
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Twitter refresh API error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to refresh tweets",
        tweetsCount: 0,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}