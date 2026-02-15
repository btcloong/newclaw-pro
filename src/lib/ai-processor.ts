/**
 * AI 智能处理系统
 * 使用 Gemini API 进行文章评分、分类、摘要生成等
 */

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// 安全设置
const safetySettings = [
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
  {
    category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
  {
    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
];

// AI 分类定义
export type AICategory =
  | "AI/ML"
  | "安全"
  | "工程"
  | "工具"
  | "开源"
  | "观点"
  | "其他";

export const AI_CATEGORIES: AICategory[] = [
  "AI/ML",
  "安全",
  "工程",
  "工具",
  "开源",
  "观点",
  "其他",
];

const CATEGORY_META: Record<AICategory, { emoji: string; description: string }> =
  {
    "AI/ML": { emoji: "🤖", description: "AI、机器学习、LLM、深度学习" },
    安全: { emoji: "🔒", description: "安全、隐私、漏洞、加密" },
    工程: { emoji: "⚙️", description: "软件工程、架构、编程语言、系统设计" },
    工具: { emoji: "🛠", description: "开发工具、新发布的库/框架" },
    开源: { emoji: "📦", description: "开源项目、GitHub 热门" },
    观点: { emoji: "💡", description: "行业观点、个人思考、职业发展" },
    其他: { emoji: "📝", description: "不属于以上分类的内容" },
  };

// 评分接口
export interface ArticleScores {
  relevance: number; // 相关性 1-10
  quality: number; // 质量 1-10
  timeliness: number; // 时效性 1-10
  overall: number; // 综合评分 1-10
}

// AI 处理结果接口
export interface AIProcessingResult {
  scores: ArticleScores;
  category: AICategory;
  chineseTitle: string;
  summary: string;
  recommendation: string;
  keywords: string[];
  processedAt: string;
  processingStatus: "completed" | "failed" | "pending";
  error?: string;
}

// 趋势总结接口
export interface TrendSummary {
  date: string;
  summary: string;
  keyTrends: string[];
  notableArticles: string[];
  categoryDistribution: Record<string, number>;
  topKeywords: Array<{ keyword: string; count: number }>;
}

/**
 * 调用 Gemini API
 */
async function callGemini(
  prompt: string,
  apiKey: string
): Promise<string> {
  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
      },
      safetySettings,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };

  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

/**
 * 解析 JSON 响应
 */
function parseJsonResponse<T>(text: string): T {
  let jsonText = text.trim();
  // 去除 markdown 代码块
  if (jsonText.startsWith("```")) {
    jsonText = jsonText
      .replace(/^```(?:json)?\n?/, "")
      .replace(/\n?```$/, "");
  }
  return JSON.parse(jsonText) as T;
}

/**
 * 构建评分提示词
 */
function buildScoringPrompt(
  title: string,
  content: string,
  source: string
): string {
  return `你是一个技术内容策展人，正在为一份面向技术爱好者的每日精选摘要筛选文章。

请对以下文章进行三个维度的评分（1-10 整数，10 分最高），并分配分类标签和提取关键词。

## 评分维度
### 1. 相关性 (relevance)
- 对技术/编程/AI/互联网从业者的价值
- 10: 所有技术人都应该知道的重大事件/突破
- 7-9: 对大部分技术从业者有价值
- 4-6: 对特定技术领域有价值
- 1-3: 与技术行业关联不大

### 2. 质量 (quality)
- 文章本身的深度和写作质量
- 10: 深度分析，原创洞见，引用丰富
- 7-9: 有深度，观点独到
- 4-6: 信息准确，表达清晰
- 1-3: 浅尝辄止或纯转述

### 3. 时效性 (timeliness)
- 当前是否值得阅读
- 10: 正在发生的重大事件/刚发布的重要工具
- 7-9: 近期热点相关
- 4-6: 常青内容，不过时
- 1-3: 过时或无时效价值

## 分类标签（必须从以下选一个）
- AI/ML: AI、机器学习、LLM、深度学习相关
- 安全: 安全、隐私、漏洞、加密相关
- 工程: 软件工程、架构、编程语言、系统设计
- 工具: 开发工具、新发布的库/框架
- 开源: 开源项目、GitHub热门项目
- 观点: 行业观点、个人思考、职业发展、文化评论
- 其他: 以上都不太适合的

## 关键词提取
提取 2-4 个最能代表文章主题的关键词（用英文，简短，如 "Rust", "LLM", "database", "performance"）

## 待评分文章
标题: ${title}
来源: ${source}
内容: ${content.slice(0, 1000)}

请严格按 JSON 格式返回，不要包含 markdown 代码块或其他文字：
{
  "relevance": 8,
  "quality": 7,
  "timeliness": 9,
  "category": "AI/ML",
  "keywords": ["AI", "LLM", "performance"]
}`;
}

/**
 * 构建摘要提示词
 */
function buildSummaryPrompt(
  title: string,
  content: string,
  source: string
): string {
  return `你是一个技术内容摘要专家。请为以下文章完成三件事：

1. **中文标题** (chineseTitle): 将英文标题翻译成自然流畅的中文。如果原标题已经是中文则保持不变。

2. **摘要** (summary): 4-6 句话的结构化摘要，让读者不点进原文也能了解核心内容。包含：
   - 文章讨论的核心问题或主题（1 句）
   - 关键论点、技术方案或发现（2-3 句）
   - 结论或作者的核心观点（1 句）

3. **推荐理由** (recommendation): 1 句话说明"为什么值得读"，区别于摘要（摘要说"是什么"，推荐理由说"为什么"）。

摘要要求：
- 直接说重点，不要用"本文讨论了..."、"这篇文章介绍了..."这种开头
- 包含具体的技术名词、数据、方案名称或观点
- 保留关键数字和指标（如性能提升百分比、用户数、版本号等）
- 如果文章涉及对比或选型，要点出比较对象和结论
- 目标：读者花 30 秒读完摘要，就能决定是否值得花 10 分钟读原文

## 待摘要文章
标题: ${title}
来源: ${source}
内容: ${content.slice(0, 1500)}

请严格按 JSON 格式返回：
{
  "chineseTitle": "中文翻译的标题",
  "summary": "摘要内容...",
  "recommendation": "推荐理由..."
}`;
}

/**
 * 处理文章内容，生成 AI 分析结果
 */
export async function processArticleWithAI(
  title: string,
  content: string,
  url: string,
  source: string,
  publishedAt: string,
  apiKey?: string
): Promise<AIProcessingResult> {
  const key = apiKey || process.env.GEMINI_API_KEY;

  if (!key) {
    return {
      scores: { relevance: 5, quality: 5, timeliness: 5, overall: 5 },
      category: "其他",
      chineseTitle: title,
      summary: content.slice(0, 200) + "...",
      recommendation: "暂无推荐理由",
      keywords: [],
      processedAt: new Date().toISOString(),
      processingStatus: "failed",
      error: "未配置 GEMINI_API_KEY",
    };
  }

  try {
    // 第一步：评分和分类
    const scoringPrompt = buildScoringPrompt(title, content, source);
    const scoringResponse = await callGemini(scoringPrompt, key);
    const scoringResult = parseJsonResponse<{
      relevance: number;
      quality: number;
      timeliness: number;
      category: string;
      keywords: string[];
    }>(scoringResponse);

    // 验证分类
    const validCategory = AI_CATEGORIES.includes(scoringResult.category as AICategory)
      ? (scoringResult.category as AICategory)
      : "其他";

    // 计算综合评分
    const overall =
      Math.round(
        ((scoringResult.relevance +
          scoringResult.quality +
          scoringResult.timeliness) /
          3) *
          10
      ) / 10;

    // 第二步：生成摘要
    const summaryPrompt = buildSummaryPrompt(title, content, source);
    const summaryResponse = await callGemini(summaryPrompt, key);
    const summaryResult = parseJsonResponse<{
      chineseTitle: string;
      summary: string;
      recommendation: string;
    }>(summaryResponse);

    return {
      scores: {
        relevance: Math.min(10, Math.max(1, Math.round(scoringResult.relevance))),
        quality: Math.min(10, Math.max(1, Math.round(scoringResult.quality))),
        timeliness: Math.min(10, Math.max(1, Math.round(scoringResult.timeliness))),
        overall,
      },
      category: validCategory,
      chineseTitle: summaryResult.chineseTitle || title,
      summary: summaryResult.summary || content.slice(0, 200) + "...",
      recommendation: summaryResult.recommendation || "值得阅读的技术文章",
      keywords: Array.isArray(scoringResult.keywords)
        ? scoringResult.keywords.slice(0, 4)
        : [],
      processedAt: new Date().toISOString(),
      processingStatus: "completed",
    };
  } catch (error) {
    console.error("AI processing error:", error);
    return {
      scores: { relevance: 5, quality: 5, timeliness: 5, overall: 5 },
      category: "其他",
      chineseTitle: title,
      summary: content.slice(0, 200) + "...",
      recommendation: "暂无推荐理由",
      keywords: [],
      processedAt: new Date().toISOString(),
      processingStatus: "failed",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * 批量处理文章
 */
export async function batchProcessArticles(
  articles: Array<{
    id: string;
    title: string;
    content: string;
    url: string;
    source: string;
    publishedAt: string;
  }>,
  concurrency: number = 2,
  apiKey?: string
): Promise<Map<string, AIProcessingResult>> {
  const results = new Map<string, AIProcessingResult>();
  const key = apiKey || process.env.GEMINI_API_KEY;

  if (!key) {
    console.warn("[AI] GEMINI_API_KEY not configured, skipping AI processing");
    return results;
  }

  console.log(`[AI] Processing ${articles.length} articles with concurrency ${concurrency}`);

  // 分批处理，控制并发
  for (let i = 0; i < articles.length; i += concurrency) {
    const batch = articles.slice(i, i + concurrency);
    const batchPromises = batch.map(async (article) => {
      console.log(`[AI] Processing: ${article.title.slice(0, 50)}...`);
      const result = await processArticleWithAI(
        article.title,
        article.content,
        article.url,
        article.source,
        article.publishedAt,
        key
      );
      results.set(article.id, result);
      return result;
    });

    await Promise.all(batchPromises);

    // 批次间添加延迟，避免 API 限流
    if (i + concurrency < articles.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log(`[AI] Completed processing ${results.size} articles`);
  return results;
}

/**
 * 构建趋势总结提示词
 */
function buildTrendPrompt(
  articles: Array<{
    title: string;
    summary: string;
    category: string;
    keywords: string[];
  }>
): string {
  const articleList = articles
    .slice(0, 15)
    .map((a, i) => `${i + 1}. [${a.category}] ${a.title}\n   摘要: ${a.summary.slice(0, 100)}...`)
    .join("\n\n");

  return `根据以下今日精选技术文章列表，分析并总结今日技术趋势。

## 文章列表
${articleList}

## 分析要求
1. 提炼出今天技术圈的 2-4 个主要趋势或话题
2. 写一个 3-5 句话的"今日看点"总结，风格简洁有力，像新闻导语
3. 列出关键趋势标签

请严格按 JSON 格式返回：
{
  "summary": "今日看点总结...",
  "keyTrends": ["趋势1", "趋势2", "趋势3"]
}`;
}

/**
 * 生成今日趋势总结
 */
export async function generateTrendSummary(
  articles: Array<{
    title: string;
    summary: string;
    category: string;
    keywords: string[];
    scores?: ArticleScores;
  }>,
  apiKey?: string
): Promise<TrendSummary> {
  const key = apiKey || process.env.GEMINI_API_KEY;

  // 计算分类分布
  const categoryDistribution: Record<string, number> = {};
  for (const article of articles) {
    categoryDistribution[article.category] =
      (categoryDistribution[article.category] || 0) + 1;
  }

  // 计算关键词频率
  const keywordCount = new Map<string, number>();
  for (const article of articles) {
    for (const kw of article.keywords || []) {
      const normalized = kw.toLowerCase();
      keywordCount.set(normalized, (keywordCount.get(normalized) || 0) + 1);
    }
  }
  const topKeywords = Array.from(keywordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([keyword, count]) => ({ keyword, count }));

  // 如果没有 API Key，返回基础总结
  if (!key) {
    return {
      date: new Date().toISOString().split("T")[0],
      summary: `今日共收录 ${articles.length} 篇技术文章，涵盖 ${Object.keys(categoryDistribution).length} 个分类。`,
      keyTrends: ["AI技术持续演进", "开源项目活跃", "工程实践分享"],
      notableArticles: articles.slice(0, 3).map((a) => a.title),
      categoryDistribution,
      topKeywords,
    };
  }

  try {
    const prompt = buildTrendPrompt(articles);
    const response = await callGemini(prompt, key);
    const result = parseJsonResponse<{
      summary: string;
      keyTrends: string[];
    }>(response);

    return {
      date: new Date().toISOString().split("T")[0],
      summary: result.summary || "今日技术圈呈现多元化发展态势。",
      keyTrends: result.keyTrends || ["AI技术持续演进", "开源项目活跃"],
      notableArticles: articles.slice(0, 3).map((a) => a.title),
      categoryDistribution,
      topKeywords,
    };
  } catch (error) {
    console.error("Trend summary error:", error);
    return {
      date: new Date().toISOString().split("T")[0],
      summary: `今日共收录 ${articles.length} 篇技术文章。`,
      keyTrends: ["AI技术持续演进", "开源项目活跃"],
      notableArticles: articles.slice(0, 3).map((a) => a.title),
      categoryDistribution,
      topKeywords,
    };
  }
}

/**
 * 测试 Gemini API 连接
 */
export async function testGeminiConnection(
  apiKey?: string
): Promise<{ success: boolean; message: string }> {
  const key = apiKey || process.env.GEMINI_API_KEY;

  if (!key) {
    return { success: false, message: "未配置 GEMINI_API_KEY" };
  }

  try {
    const response = await callGemini(
      '请回复 {"status": "ok"}',
      key
    );
    const result = parseJsonResponse<{ status: string }>(response);
    if (result.status === "ok") {
      return { success: true, message: "Gemini API 连接正常" };
    }
    return { success: false, message: "API 响应异常" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * 获取分类元数据
 */
export function getCategoryMeta(category: AICategory) {
  return CATEGORY_META[category] || { emoji: "📝", description: "其他" };
}
