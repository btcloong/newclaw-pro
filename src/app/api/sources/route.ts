import { NextResponse } from "next/server";
import { getSourcesStats, ALL_RSS_SOURCES, getSourcesByPriority, getSourcesByType } from "../../../../lib/rss-sources";

export async function GET() {
  try {
    const stats = getSourcesStats();
    
    return NextResponse.json({
      success: true,
      stats,
      sources: {
        high: getSourcesByPriority('high').length,
        medium: getSourcesByPriority('medium').length,
        low: getSourcesByPriority('low').length,
      },
      byType: {
        official: getSourcesByType('official').length,
        media: getSourcesByType('media').length,
        academic: getSourcesByType('academic').length,
        community: getSourcesByType('community').length,
      },
      totalActive: ALL_RSS_SOURCES.filter(s => s.isActive).length,
    });
  } catch (error) {
    console.error("Sources API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
