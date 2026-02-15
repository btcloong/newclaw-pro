import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const category = searchParams.get("category");
    const aiProcessed = searchParams.get("aiProcessed");

    const news = db.news.findAll({
      limit,
      category: category || undefined,
      aiProcessed: aiProcessed === "true" ? true : aiProcessed === "false" ? false : undefined,
    });

    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    console.error("News API error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
