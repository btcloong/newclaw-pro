import { NextResponse } from "next/server";
import { getTweetStats, AI_TWITTER_ACCOUNTS } from "@/lib/twitter-crawler";

// GET /api/twitter/stats - 获取推文统计
export async function GET() {
  try {
    const stats = getTweetStats();
    
    return NextResponse.json({
      success: true,
      stats: {
        ...stats,
        totalAccounts: AI_TWITTER_ACCOUNTS.length,
        highPriorityAccounts: AI_TWITTER_ACCOUNTS.filter(a => a.priority === 1).length,
      }
    });
  } catch (error) {
    console.error("Twitter stats API error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to get stats",
        stats: {
          totalTweets: 0,
          hotTweets: 0,
          positiveTweets: 0,
          negativeTweets: 0,
          neutralTweets: 0,
          totalLikes: 0,
          totalRetweets: 0,
          lastUpdate: null,
          totalAccounts: AI_TWITTER_ACCOUNTS.length,
          highPriorityAccounts: AI_TWITTER_ACCOUNTS.filter(a => a.priority === 1).length,
        }
      },
      { status: 500 }
    );
  }
}