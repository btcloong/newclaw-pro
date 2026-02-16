import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// 生成 Twitter 趋势数据
function generateTrends() {
  const trends = [
    { name: "Grok 3", query: "Grok3", tweetVolume: 985000, category: "AI模型" },
    { name: "DeepSeek", query: "DeepSeek", tweetVolume: 856000, category: "开源模型" },
    { name: "OpenAI o3", query: "OpenAIo3", tweetVolume: 742000, category: "推理模型" },
    { name: "Gemini 2.0", query: "Gemini2", tweetVolume: 634000, category: "多模态" },
    { name: "AI Agent", query: "AIAgent", tweetVolume: 523000, category: "应用" },
    { name: "Llama 3.3", query: "Llama3", tweetVolume: 489000, category: "开源" },
    { name: "Claude", query: "Claude", tweetVolume: 412000, category: "AI助手" },
    { name: "AI编程", query: "AICoding", tweetVolume: 398000, category: "开发工具" },
    { name: "具身智能", query: "EmbodiedAI", tweetVolume: 334000, category: "机器人" },
    { name: "Sora", query: "Sora", tweetVolume: 298000, category: "视频生成" },
  ];
  
  return trends.map((t, i) => ({
    id: `tt_${i}`,
    ...t,
    rank: i + 1,
  }));
}

// GET /api/twitter/trends - 获取热门趋势
export async function GET() {
  try {
    const trends = generateTrends();
    
    return NextResponse.json({
      success: true,
      trends,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Twitter trends API error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to get trends",
        trends: []
      },
      { status: 500 }
    );
  }
}