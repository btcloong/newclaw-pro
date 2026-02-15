import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/twitter/trends - 获取 Twitter 趋势
export async function GET() {
  try {
    const trends = db.twitterTrends.findAll();
    
    return NextResponse.json({ 
      success: true, 
      trends,
      count: trends.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch trends" },
      { status: 500 }
    );
  }
}
