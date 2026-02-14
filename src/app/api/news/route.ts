import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const news = db.news.findAll({ limit: 50 });
    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    console.error("News API error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
