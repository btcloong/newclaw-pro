import { NextRequest, NextResponse } from "next/server";
import { getSearchSuggestions } from "@/lib/search";

// GET /api/search/suggestions?q=keyword
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const suggestions = await getSearchSuggestions(query, limit);

    return NextResponse.json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    console.error("Search suggestions error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get suggestions" },
      { status: 500 }
    );
  }
}
