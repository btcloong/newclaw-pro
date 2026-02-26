import { NextRequest, NextResponse } from "next/server";
import { 
  TwitterMCPClient, 
  NewsMCPClient, 
  convert6551NewsToNewClaw,
  convert6551TweetToNewClaw,
  test6551Connection 
} from "@/lib/mcp-6551";
import { db } from "@/lib/db";

// 从环境变量获取 Token
const TWITTER_TOKEN = process.env.MCP6551_TWITTER_TOKEN;
const NEWS_TOKEN = process.env.MCP6551_NEWS_TOKEN;

// GET /api/mcp6551/status - 检查连接状态
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "status";

    if (action === "status") {
      const status = await test6551Connection({
        twitterToken: TWITTER_TOKEN,
        newsToken: NEWS_TOKEN,
      });
      return NextResponse.json({ success: true, status });
    }

    if (action === "news") {
      if (!NEWS_TOKEN) {
        return NextResponse.json({ success: false, error: "News token not configured" }, { status: 500 });
      }
      const client = new NewsMCPClient(NEWS_TOKEN);
      const news = await client.getLatestNews(20);
      return NextResponse.json({ success: true, data: news.map(convert6551NewsToNewClaw) });
    }

    if (action === "high-score") {
      if (!NEWS_TOKEN) {
        return NextResponse.json({ success: false, error: "News token not configured" }, { status: 500 });
      }
      const client = new NewsMCPClient(NEWS_TOKEN);
      const news = await client.getHighScoreNews(80, 20);
      return NextResponse.json({ success: true, data: news.map(convert6551NewsToNewClaw) });
    }

    if (action === "signals") {
      if (!NEWS_TOKEN) {
        return NextResponse.json({ success: false, error: "News token not configured" }, { status: 500 });
      }
      const client = new NewsMCPClient(NEWS_TOKEN);
      const [longNews, shortNews] = await Promise.all([
        client.getBySignal("long", 10),
        client.getBySignal("short", 10),
      ]);
      return NextResponse.json({
        success: true,
        data: {
          long: longNews.map(convert6551NewsToNewClaw),
          short: shortNews.map(convert6551NewsToNewClaw),
        },
      });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("MCP6551 API error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// POST /api/mcp6551/sync - 同步数据到数据库
export async function POST(request: NextRequest) {
  try {
    if (!NEWS_TOKEN) {
      return NextResponse.json({ success: false, error: "News token not configured" }, { status: 500 });
    }

    const body = await request.json().catch(() => ({}));
    const { type = "news", limit = 20 } = body;

    const client = new NewsMCPClient(NEWS_TOKEN);
    let articles: any[] = [];

    if (type === "news") {
      articles = await client.getLatestNews(limit);
    } else if (type === "high-score") {
      articles = await client.getHighScoreNews(80, limit);
    } else if (type === "coin" && body.coin) {
      articles = await client.searchByCoin(body.coin, limit);
    }

    // 转换为 NewClaw 格式并保存
    const converted = articles.map(convert6551NewsToNewClaw);
    let saved = 0;

    for (const article of converted) {
      try {
        // 检查是否已存在
        const existing = await db.news.findById(article.id);
        if (!existing) {
          await db.news.create(article);
          saved++;
        }
      } catch (e) {
        console.error("Failed to save article:", e);
      }
    }

    return NextResponse.json({
      success: true,
      synced: saved,
      total: articles.length,
    });
  } catch (error) {
    console.error("MCP6551 sync error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
