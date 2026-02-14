import { NextRequest, NextResponse } from "next/server";
import { crawlAll } from "@/lib/crawler";

export async function POST(request: NextRequest) {
  try {
    const results = await crawlAll();
    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Crawl error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Use POST to trigger crawl" });
}
