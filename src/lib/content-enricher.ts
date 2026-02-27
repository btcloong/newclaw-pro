/**
 * 内容获取和翻译服务
 * 用于充实文章内容和翻译
 */

import { generateText } from "./ai-processor";

// 获取文章全文内容
export async function fetchArticleContent(url: string): Promise<string | null> {
  try {
    // 尝试获取原文内容
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; NewClawBot/1.0)",
      },
      timeout: 10000,
    });

    if (!response.ok) {
      console.warn(`[Content] Failed to fetch ${url}: ${response.status}`);
      return null;
    }

    const html = await response.text();
    
    // 提取正文内容（简单实现）
    const content = extractContentFromHtml(html);
    return content;
  } catch (error) {
    console.error(`[Content] Error fetching ${url}:`, error);
    return null;
  }
}

// 从 HTML 中提取正文
function extractContentFromHtml(html: string): string {
  // 移除 script 和 style
  let text = html
    .replace(/<script[^\u003e]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^\u003e]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^\u003e]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  
  // 限制长度
  return text.slice(0, 5000);
}

// 翻译标题为中文
export async function translateTitleToChinese(
  title: string,
  apiKey?: string
): Promise<string> {
  try {
    const prompt = `将以下英文标题翻译成简洁的中文（不超过25字），保持专业性和准确性：

标题：${title}

只返回翻译后的中文标题，不要有任何其他文字。`;

    const result = await generateText(prompt, { maxTokens: 100, apiKey });
    return result.trim() || title;
  } catch (error) {
    console.error("[Translate] Title translation failed:", error);
    return title;
  }
}

// 生成中文摘要
export async function generateChineseSummary(
  title: string,
  content: string,
  apiKey?: string
): Promise<{ summary: string; recommendation: string }> {
  try {
    const prompt = `请为以下文章生成中文摘要和推荐理由：

标题：${title}
内容：${content.slice(0, 2000)}

要求：
1. 摘要：用3-5句话总结文章核心内容（中文，200字以内）
2. 推荐理由：用1-2句话说明为什么值得阅读（中文，50字以内）

返回JSON格式：
{"summary":"摘要内容","recommendation":"推荐理由"}`;

    const result = await generateText(prompt, { maxTokens: 500, apiKey });
    
    // 解析 JSON
    let jsonText = result.trim();
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    
    const parsed = JSON.parse(jsonText);
    return {
      summary: parsed.summary || "",
      recommendation: parsed.recommendation || "",
    };
  } catch (error) {
    console.error("[Translate] Summary generation failed:", error);
    return {
      summary: content.slice(0, 200) + "...",
      recommendation: "",
    };
  }
}

// 完整处理文章（获取内容+翻译）
export async function enrichArticle(
  article: {
    id: string;
    title: string;
    summary?: string;
    content?: string;
    url: string;
  },
  apiKey?: string
): Promise<{
  chineseTitle: string;
  aiSummary: string;
  recommendation: string;
  content: string;
}> {
  console.log(`[Enrich] Processing article: ${article.title.slice(0, 50)}...`);

  // 1. 获取全文内容
  let fullContent = article.content || article.summary || "";
  
  if (!fullContent || fullContent.length < 500) {
    const fetchedContent = await fetchArticleContent(article.url);
    if (fetchedContent) {
      fullContent = fetchedContent;
    }
  }

  // 2. 翻译标题
  const chineseTitle = await translateTitleToChinese(article.title, apiKey);

  // 3. 生成中文摘要
  const { summary: aiSummary, recommendation } = await generateChineseSummary(
    article.title,
    fullContent,
    apiKey
  );

  return {
    chineseTitle,
    aiSummary,
    recommendation,
    content: fullContent,
  };
}
