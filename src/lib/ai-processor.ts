/**
 * 优化的 AI 智能处理系统
 * 最省 token 方案：批量处理、频率控制、降级方案
 */

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// 安全设置
const safetySettings = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
];

// AI 分类定义
export type AICategory = "AI/ML" | "安全" | "工程" | "工具" | "开源" | "观点" | "其他";
export const AI_CATEGORIES: AICategory[] = ["AI/ML", "安全", "工程", "工具", "开源", "观点", "其他"];

const CATEGORY_META: Record<AICategory, { emoji: string; description: string }> = {
  "AI/ML": { emoji: "🤖", description: "AI、机器学习、LLM、深度学习" },
  "安全": { emoji: "🔒", description: "安全、隐私、漏洞、加密" },
  "工程": { emoji: "⚙️", description: "软件工程、架构、编程语言、系统设计" },
  "工具": { emoji: "🛠", description: "开发工具、新发布的库/框架" },
  "开源": { emoji: "📦", description: "开源项目、GitHub 热门" },
  "观点": { emoji: "💡", description: "行业观点、个人思考、职业发展" },
  "其他": { emoji: "📝", description: "不属于以上分类的内容" },
};

export interface ArticleScores {
  relevance: number;
  quality: number;
  timeliness: number;
  overall: number;
}

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

export interface TrendSummary {
  date: string;
  summary: string;
  keyTrends: string[];
  notableArticles: string[];
  categoryDistribution: Record<string, number>;
  topKeywords: Array<{ keyword: string; count: number }>;
}

// ============ 频率控制 ============
class RateLimiter {
  private lastRequestTime = 0;
  private readonly minIntervalMs = 6000; // 6秒间隔，每分钟最多10次

  async waitForAvailable(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minIntervalMs) {
      const waitTime = this.minIntervalMs - timeSinceLastRequest;
      console.log(`[AI] Rate limiting: waiting ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }
}

const rateLimiter = new RateLimiter();

// ============ 降级方案 - 本地规则 ============
const CATEGORY_KEYWORDS: Record<AICategory, string[]> = {
  "AI/ML": ["ai", "llm", "gpt", "claude", "gemini", "openai", "anthropic", "deepseek", "machine learning", "neural", "model", "training", "inference", "transformer", "llama", "mistral", "embedding"],
  "安全": ["security", "vulnerability", "exploit", "cve", "hack", "privacy", "encryption", "auth", "oauth", "jwt", "penetration", "firewall", "malware"],
  "工程": ["architecture", "system design", "microservices", "database", "performance", "scalability", "distributed", "api", "graphql", "rest", "backend", "frontend"],
  "工具": ["framework", "library", "sdk", "cli", "devtools", "ide", "editor", "plugin", "extension", "package", "npm", "cargo", "pip"],
  "开源": ["github", "opensource", "contribution", "pull request", "issue", "release", "version", "license", "mit", "apache", "gpl"],
  "观点": ["opinion", "thoughts", "career", "culture", "team", "management", "leadership", "hiring", "interview", "remote work"],
  "其他": [],
};

function classifyByKeywords(title: string, content: string): AICategory {
  const text = (title + " " + content).toLowerCase();
  const scores: Record<AICategory, number> = { "AI/ML": 0, "安全": 0, "工程": 0, "工具": 0, "开源": 0, "观点": 0, "其他": 0 };

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) scores[category as AICategory]++;
    }
  }

  let bestCategory: AICategory = "其他";
  let maxScore = 0;
  for (const [category, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestCategory = category as AICategory;
    }
  }
  return bestCategory;
}

function extractKeywordsByRules(title: string, content: string): string[] {
  const text = (title + " " + content).toLowerCase();
  const keywords: string[] = [];
  const patterns = [
    { pattern: /\b(openai|gpt-?4|gpt-?3|chatgpt)\b/gi, tag: "OpenAI" },
    { pattern: /\b(claude|anthropic)\b/gi, tag: "Claude" },
    { pattern: /\b(gemini|google\s+ai)\b/gi, tag: "Gemini" },
    { pattern: /\b(deepseek)\b/gi, tag: "DeepSeek" },
    { pattern: /\b(llama|meta\s+ai)\b/gi, tag: "Llama" },
    { pattern: /\b(mistral)\b/gi, tag: "Mistral" },
    { pattern: /\b(grok|xai)\b/gi, tag: "Grok" },
    { pattern: /\b(rust)\b/gi, tag: "Rust" },
    { pattern: /\b(golang|go\s+lang)\b/gi, tag: "Go" },
    { pattern: /\b(python)\b/gi, tag: "Python" },
    { pattern: /\b(javascript|typescript)\b/gi, tag: "JavaScript" },
    { pattern: /\b(react|vue|angular)\b/gi, tag: "Frontend" },
    { pattern: /\b(kubernetes|docker)\b/gi, tag: "Cloud" },
    { pattern: /\b(database|postgres|mongodb)\b/gi, tag: "Database" },
    { pattern: /\b(github|git)\b/gi, tag: "GitHub" },
    { pattern: /\b(security|vulnerability)\b/gi, tag: "Security" },
  ];

  for (const { pattern, tag } of patterns) {
    if (pattern.test(text)) keywords.push(tag);
  }
  return [...new Set(keywords)].slice(0, 4);
}

function fallbackProcessing(title: string, content: string, source: string): AIProcessingResult {
  const category = classifyByKeywords(title, content);
  const keywords = extractKeywordsByRules(title, content);
  const summary = content.slice(0, 200).trim();
  
  return {
    scores: { relevance: 5, quality: 5, timeliness: 5, overall: 5 },
    category,
    chineseTitle: title,
    summary: summary.length >= 200 ? summary + "..." : summary,
    recommendation: `来自 ${source} 的技术文章`,
    keywords,
    processedAt: new Date().toISOString(),
    processingStatus: "completed",
  };
}

// ============ API 调用 ============
async function callGemini(prompt: string, apiKey: string, retryCount = 0): Promise<string> {
  const maxRetries = 3;
  const baseDelay = 2000;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, topP: 0.8, topK: 40, maxOutputTokens: 1024 },
        safetySettings,
      }),
    });

    if (!response.ok) {
      if (response.status === 429 && retryCount < maxRetries) {
        const delay = baseDelay * Math.pow(2, retryCount);
        console.log(`[AI] Rate limited, retrying in ${delay}ms... (${retryCount + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return callGemini(prompt, apiKey, retryCount + 1);
      }
      const errorText = await response.text().catch(() => "Unknown error");
      throw new Error(`Gemini API error (${response.status}): ${errorText}`);
    }

    const data = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (error) {
    if (retryCount < maxRetries) {
      const delay = baseDelay * Math.pow(2, retryCount);
      await new Promise(resolve => setTimeout(resolve, delay));
      return callGemini(prompt, apiKey, retryCount + 1);
    }
    throw error;
  }
}

function parseJsonResponse<T>(text: string): T {
  let jsonText = text.trim();
  if (jsonText.startsWith("```")) {
    jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }
  return JSON.parse(jsonText) as T;
}

// ============ Prompt 构建（精简版） ============
function buildBatchScoringPrompt(articles: Array<{ id: string; title: string; content: string; source: string }>): string {
  const articlesText = articles.map((a, i) => `
[${i + 1}] ID:${a.id}
标题:${a.title.slice(0, 100)}
内容:${a.content.slice(0, 300)}`).join("\n");

  return `为${articles.length}篇文章评分。返回JSON数组：
[{"id":"文章ID","relevance":1-10,"quality":1-10,"timeliness":1-10,"category":"AI/ML/安全/工程/工具/开源/观点/其他","keywords":["关键词1","关键词2"]}]

${articlesText}`;
}

function buildBatchSummaryPrompt(articles: Array<{ id: string; title: string; content: string }>): string {
  const articlesText = articles.map((a, i) => `
[${i + 1}] ID:${a.id}
标题:${a.title.slice(0, 100)}
内容:${a.content.slice(0, 300)}`).join("\n");

  return `为${articles.length}篇文章生成中文内容。返回JSON数组：
[{"id":"文章ID","chineseTitle":"中文标题","summary":"3-5句话摘要","recommendation":"推荐理由"}]

${articlesText}`;
}

// ============ 批量处理 ============
export async function batchProcessArticles(
  articles: Array<{ id: string; title: string; content: string; url: string; source: string; publishedAt: string }>,
  apiKey?: string
): Promise<Map<string, AIProcessingResult>> {
  const results = new Map<string, AIProcessingResult>();
  const key = apiKey || process.env.GEMINI_API_KEY;

  if (!key) {
    console.warn("[AI] No API key, using fallback");
    for (const article of articles) {
      results.set(article.id, fallbackProcessing(article.title, article.content, article.source));
    }
    return results;
  }

  console.log(`[AI] Processing ${articles.length} articles in batches`);

  // 批量评分（每批10篇）
  const scoringResults = new Map<string, { scores: ArticleScores; category: AICategory; keywords: string[] }>();
  
  for (let i = 0; i < articles.length; i += 10) {
    const batch = articles.slice(i, i + 10).map(a => ({ id: a.id, title: a.title, content: a.content, source: a.source }));
    console.log(`[AI] Scoring batch ${Math.floor(i / 10) + 1}/${Math.ceil(articles.length / 10)}`);
    
    await rateLimiter.waitForAvailable();
    
    try {
      const prompt = buildBatchScoringPrompt(batch);
      const response = await callGemini(prompt, key);
      const parsed = parseJsonResponse<Array<{ id: string; relevance: number; quality: number; timeliness: number; category: string; keywords: string[] }>>(response);
      
      for (const item of parsed) {
        const category = AI_CATEGORIES.includes(item.category as AICategory) ? (item.category as AICategory) : "其他";
        const overall = Math.round(((item.relevance + item.quality + item.timeliness) / 3) * 10) / 10;
        scoringResults.set(item.id, {
          scores: {
            relevance: Math.min(10, Math.max(1, Math.round(item.relevance))),
            quality: Math.min(10, Math.max(1, Math.round(item.quality))),
            timeliness: Math.min(10, Math.max(1, Math.round(item.timeliness))),
            overall,
          },
          category,
          keywords: Array.isArray(item.keywords) ? item.keywords.slice(0, 4) : [],
        });
      }
    } catch (error) {
      console.error(`[AI] Batch scoring error:`, error);
      // 降级处理
      for (const article of batch) {
        const category = classifyByKeywords(article.title, article.content);
        const keywords = extractKeywordsByRules(article.title, article.content);
        scoringResults.set(article.id, {
          scores: { relevance: 5, quality: 5, timeliness: 5, overall: 5 },
          category,
          keywords,
        });
      }
    }
  }

  // 批量摘要（每批5篇）
  const summaryResults = new Map<string, { chineseTitle: string; summary: string; recommendation: string }>();
  
  for (let i = 0; i < articles.length; i += 5) {
    const batch = articles.slice(i, i + 5).map(a => ({ id: a.id, title: a.title, content: a.content }));
    console.log(`[AI] Summarizing batch ${Math.floor(i / 5) + 1}/${Math.ceil(articles.length / 5)}`);
    
    await rateLimiter.waitForAvailable();
    
    try {
      const prompt = buildBatchSummaryPrompt(batch);
      const response = await callGemini(prompt, key);
      const parsed = parseJsonResponse<Array<{ id: string; chineseTitle: string; summary: string; recommendation: string }>>(response);
      
      for (const item of parsed) {
        summaryResults.set(item.id, {
          chineseTitle: item.chineseTitle || batch.find(b => b.id === item.id)?.title || "",
          summary: item.summary || "",
          recommendation: item.recommendation || "",
        });
      }
    } catch (error) {
      console.error(`[AI] Batch summarization error:`, error);
      for (const article of batch) {
        const summary = article.content.slice(0, 200).trim() + "...";
        summaryResults.set(article.id, { chineseTitle: article.title, summary, recommendation: "" });
      }
    }
  }

  // 合并结果
  for (const article of articles) {
    const scoring = scoringResults.get(article.id);
    const summary = summaryResults.get(article.id);

    if (scoring && summary) {
      results.set(article.id, {
        scores: scoring.scores,
        category: scoring.category,
        chineseTitle: summary.chineseTitle,
        summary: summary.summary,
        recommendation: summary.recommendation,
        keywords: scoring.keywords,
        processedAt: new Date().toISOString(),
        processingStatus: "completed",
      });
    } else {
      results.set(article.id, fallbackProcessing(article.title, article.content, article.source));
    }
  }

  console.log(`[AI] Completed ${results.size} articles`);
  return results;
}

// ============ 单篇处理（兼容旧代码） ============
export async function processArticleWithAI(
  title: string,
  content: string,
  url: string,
  source: string,
  publishedAt: string,
  apiKey?: string
): Promise<AIProcessingResult> {
  const results = await batchProcessArticles([{ id: "single", title, content, url, source, publishedAt }], apiKey);
  return results.get("single") || fallbackProcessing(title, content, source);
}

// ============ 趋势总结 ============
export async function generateTrendSummary(
  articles: Array<{ title: string; summary: string; category: string; keywords: string[] }>,
  apiKey?: string
): Promise<TrendSummary> {
  const key = apiKey || process.env.GEMINI_API_KEY;
  const date = new Date().toISOString().split("T")[0];
  
  // 计算分类分布
  const categoryDistribution: Record<string, number> = {};
  for (const article of articles) {
    categoryDistribution[article.category] = (categoryDistribution[article.category] || 0) + 1;
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

  if (!key) {
    return {
      date,
      summary: `今日收录 ${articles.length} 篇文章，涵盖 ${Object.keys(categoryDistribution).length} 个分类。`,
      keyTrends: ["AI技术演进", "开源项目活跃", "工程实践"],
      notableArticles: articles.slice(0, 3).map(a => a.title),
      categoryDistribution,
      topKeywords,
    };
  }

  try {
    await rateLimiter.waitForAvailable();
    
    const articleList = articles.slice(0, 10).map((a, i) => `${i + 1}. [${a.category}] ${a.title.slice(0, 80)}`).join("\n");
    const prompt = `总结技术趋势。返回JSON：{"summary":"3-5句话","keyTrends":["趋势1","趋势2"]}

${articleList}`;

    const response = await callGemini(prompt, key);
    const result = parseJsonResponse<{ summary: string; keyTrends: string[] }>(response);

    return {
      date,
      summary: result.summary || `今日收录 ${articles.length} 篇文章`,
      keyTrends: result.keyTrends || ["AI技术演进", "开源项目活跃"],
      notableArticles: articles.slice(0, 3).map(a => a.title),
      categoryDistribution,
      topKeywords,
    };
  } catch (error) {
    return {
      date,
      summary: `今日收录 ${articles.length} 篇文章`,
      keyTrends: ["AI技术演进", "开源项目活跃"],
      notableArticles: articles.slice(0, 3).map(a => a.title),
      categoryDistribution,
      topKeywords,
    };
  }
}

// ============ 测试连接 ============
export async function testGeminiConnection(apiKey?: string): Promise<{ success: boolean; message: string }> {
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key) return { success: false, message: "未配置 GEMINI_API_KEY" };

  try {
    await rateLimiter.waitForAvailable();
    const response = await callGemini('{"test": true}', key);
    return { success: true, message: "连接正常" };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : String(error) };
  }
}

export function getCategoryMeta(category: AICategory) {
  return CATEGORY_META[category] || { emoji: "📝", description: "其他" };
}

// ============ 通用文本生成 ============
interface GenerateTextOptions {
  temperature?: number;
  maxTokens?: number;
  apiKey?: string;
}

export async function generateText(
  prompt: string,
  options: GenerateTextOptions = {}
): Promise<string> {
  const key = options.apiKey || process.env.GEMINI_API_KEY;
  
  if (!key) {
    throw new Error("未配置 GEMINI_API_KEY");
  }

  await rateLimiter.waitForAvailable();

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: options.temperature ?? 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: options.maxTokens ?? 2048,
        },
        safetySettings,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      throw new Error(`Gemini API error (${response.status}): ${errorText}`);
    }

    const data = await response.json() as { 
      candidates?: Array<{ 
        content?: { 
          parts?: Array<{ text?: string }> 
        } 
      }> 
    };
    
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (error) {
    console.error("[AI] Text generation error:", error);
    throw error;
  }
}
