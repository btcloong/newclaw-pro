import { NextResponse } from "next/server";
import { forceRefreshTwitter } from "@/lib/twitter-crawler";

// POST /api/twitter/refresh - 强制刷新 Twitter 数据
export async function POST() {
  try {
    const result = await forceRefreshTwitter();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Refresh Error:", error);
    return NextResponse.json(
      { success: false, error: "Refresh failed" },
      { status: 500 }
    );
  }
}
