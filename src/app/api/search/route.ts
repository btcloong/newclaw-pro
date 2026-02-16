import { NextRequest, NextResponse } from "next/server";
import { searchNews, getSearchSuggestions, initSearchIndex } from "@/lib/search";

// 初始化搜索索引
let initialized = false;
async function ensureInitialized() {
  if (!initialized) {
    await initSearchIndex();
    initialized = true;
  }
}

// GET /api/search?q=keyword&category=AI&source=OpenAI&limit=20
export async function GET(request: NextRequest) {
  try {
    await ensureInitialized();

    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || undefined;
    const source = searchParams.get("source") || undefined;
    const tags = searchParams.get("tags")?.split(",").filter(Boolean);
    const isHot = searchParams.get("isHot") === "true" ? true : 
                  searchParams.get("isHot") === "false" ? false : undefined;
    const sortBy = (searchParams.get("sortBy") as any) || "relevance";
    const sortOrder = (searchParams.get("sortOrder") as any) || "desc";
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    const results = await searchNews({
      query,
      category,
      source,
      tags,
      isHot,
      sortBy,
      sortOrder,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { success: false, error: "Search failed" },
      { status: 500 }
    );
  }
}
