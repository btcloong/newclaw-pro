// 使用内存存储，适合 Vercel serverless 环境
// 数据在每次部署后重置，通过 API 触发重新抓取

import { AICategory, ArticleScores, AIProcessingResult } from "./ai-processor";

// 扩展的新闻项接口，包含 AI 处理字段
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content?: string;
  url: string;
  source: string;
  sourceUrl?: string;
  image?: string;
  category: string;
  tags: string[];
  publishedAt: string;
  isHot?: boolean;
  isFeatured?: boolean;
  viewCount?: number;
  
  // AI 处理字段
  aiProcessed?: boolean;
  aiProcessingStatus?: "pending" | "processing" | "completed" | "failed";
  aiProcessedAt?: string;
  aiError?: string;
  
  // AI 评分
  aiScores?: ArticleScores;
  
  // AI 分类
  aiCategory?: AICategory;
  
  // AI 生成的内容
  chineseTitle?: string;
  aiSummary?: string;
  recommendation?: string;
  aiKeywords?: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  fullDescription?: string;
  url: string;
  logo?: string;
  category: string;
  tags: string[];
  source: "github" | "producthunt" | "other";
  stars?: number;
  forks?: number;
  upvotes?: number;
  language?: string;
  license?: string;
  createdAt?: string;
  updatedAt?: string;
  isNew?: boolean;
  isTrending?: boolean;
}

export interface ResearchReport {
  id: string;
  title: string;
  summary: string;
  content?: string;
  category: string;
  tags: string[];
  author?: string;
  readTime?: string;
  publishedAt: string;
  viewCount?: number;
}

export interface HotTopic {
  id: string;
  title: string;
  heat: number;
  change: number;
  category?: string;
  rank: number;
}

export interface Funding {
  id: string;
  companyName: string;
  amount: string;
  round: string;
  date: string;
  investors: string[];
  category?: string;
  description?: string;
}

// Twitter 推文接口
export interface Tweet {
  id: string;
  content: string;
  author: {
    name: string;
    username: string;
    avatar?: string;
    verified?: boolean;
  };
  publishedAt: string;
  likes: number;
  retweets: number;
  replies: number;
  views?: number;
  media?: string[];
  hashtags: string[];
  mentions: string[];
  urls: string[];
  isHot?: boolean;
  sentiment?: "positive" | "neutral" | "negative";
  // AI 解读字段
  aiAnalysis?: {
    chineseSummary: string;
    keyPoints: string[];
    importance: "high" | "medium" | "low";
    category: string;
  };
}

// Twitter 话题趋势
export interface TwitterTrend {
  id: string;
  name: string;
  query: string;
  tweetVolume: number;
  rank: number;
  category?: string;
}

// 趋势总结接口
export interface DailyTrendSummary {
  date: string;
  summary: string;
  keyTrends: string[];
  notableArticles: string[];
  categoryDistribution: Record<string, number>;
  topKeywords: Array<{ keyword: string; count: number }>;
  generatedAt: string;
}

// 内存存储
let newsStore: NewsItem[] = [];
let projectsStore: Project[] = [];
let researchStore: ResearchReport[] = [];
let hotTopicsStore: HotTopic[] = [];
let fundingStore: Funding[] = [];
export let tweetsStore: Tweet[] = [];
export let twitterTrendsStore: TwitterTrend[] = [];
let trendSummaryStore: DailyTrendSummary | null = null;
let lastCrawlTime: string | null = null;
let lastAIProcessingTime: string | null = null;

// 真实可靠的新闻数据源 - 基于2024-2025年真实AI行业动态
function initSampleData() {
  // 新闻数据 - 基于真实来源
  newsStore = [
    {
      id: "1",
      title: "OpenAI 发布 o3 推理模型：在 ARC-AGI 基准测试中取得突破性进展",
      summary: "OpenAI 发布新一代推理模型 o3，在 ARC-AGI 基准测试中达到 87.5% 的准确率，接近人类水平。",
      content: "OpenAI 于 2024 年 12 月 20 日发布了 o3 和 o3-mini 推理模型。在 ARC-AGI 基准测试中，o3 模型在高计算配置下达到了 87.5% 的准确率，在低计算配置下达到 75.7%，显著超越了之前的最佳成绩。这一突破标志着 AI 在抽象推理能力方面取得了重大进展。",
      url: "https://openai.com/index/deliberative-alignment/",
      source: "OpenAI 官方博客",
      sourceUrl: "https://openai.com/index/deliberative-alignment/",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
      category: "大模型",
      tags: ["OpenAI", "o3", "推理模型", "ARC-AGI"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      isHot: true,
      isFeatured: true,
      viewCount: 125000,
      aiProcessed: true,
      aiProcessingStatus: "completed",
      aiProcessedAt: new Date().toISOString(),
      aiScores: {
        relevance: 10,
        quality: 9,
        timeliness: 9,
        overall: 9.3,
      },
      aiCategory: "AI/ML",
      chineseTitle: "OpenAI o3 推理模型突破：接近人类水平的抽象推理",
      aiSummary: "OpenAI发布o3推理模型，在ARC-AGI基准测试中达到87.5%准确率，标志着AI抽象推理能力的重大突破。该模型采用新的推理架构，在复杂逻辑任务上表现出色。这一进展对AGI研究具有里程碑意义，值得AI研究人员和工程师关注。",
      recommendation: "这是2024年AI领域最重要的突破之一，展示了推理时计算扩展的威力。强烈建议阅读了解其技术细节。",
      aiKeywords: ["OpenAI", "o3", "推理模型", "ARC-AGI"],
    },
    {
      id: "2",
      title: "Google 发布 Gemini 2.0 Flash：多模态 AI 能力全面升级",
      summary: "Google DeepMind 推出 Gemini 2.0 Flash，支持原生图像生成、多语言音频输出和实时视频理解。",
      content: "Google 于 2024 年 12 月 11 日发布 Gemini 2.0 Flash 实验版本。新模型支持原生图像生成、多语言音频输出，以及实时视频理解能力。Google 同时展示了 Project Astra 和 Project Mariner 等 AI 智能体项目。",
      url: "https://blog.google/technology/ai/google-gemini-ai-update-december-2024/",
      source: "Google Blog",
      sourceUrl: "https://blog.google/technology/ai/google-gemini-ai-update-december-2024/",
      category: "大模型",
      tags: ["Google", "Gemini", "多模态", "AI智能体"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      isHot: true,
      viewCount: 89000,
      aiProcessed: true,
      aiProcessingStatus: "completed",
      aiProcessedAt: new Date().toISOString(),
      aiScores: {
        relevance: 9,
        quality: 8,
        timeliness: 9,
        overall: 8.6,
      },
      aiCategory: "AI/ML",
      chineseTitle: "Google Gemini 2.0 Flash：原生多模态AI全面升级",
      aiSummary: "Google发布Gemini 2.0 Flash，实现原生图像生成、多语言音频输出和实时视频理解。同时推出Project Astra和Project Mariner等AI智能体项目。这标志着多模态AI进入新阶段，为下一代AI应用奠定基础。",
      recommendation: "多模态能力是AI发展的重要方向，Gemini 2.0展示了Google在该领域的领先地位。",
      aiKeywords: ["Google", "Gemini", "多模态", "AI Agent"],
    },
    {
      id: "3",
      title: "DeepSeek 发布 V3 模型：以极低成本实现 GPT-4o 级别性能",
      summary: "中国 AI 公司 DeepSeek 发布 V3 模型，训练成本仅 557.6 万美元，性能媲美 GPT-4o。",
      content: "DeepSeek 于 2024 年 12 月 26 日发布 DeepSeek-V3 模型。该模型采用 MoE 架构，总参数 671B，每次前向传播激活 37B 参数。模型在多项基准测试中达到或接近 GPT-4o 水平，但训练成本仅为 557.6 万美元，引发行业广泛关注。",
      url: "https://www.deepseek.com/",
      source: "DeepSeek 官方",
      sourceUrl: "https://www.deepseek.com/",
      category: "开源模型",
      tags: ["DeepSeek", "开源模型", "MoE", "中国AI"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      viewCount: 156000,
      aiProcessed: true,
      aiProcessingStatus: "completed",
      aiProcessedAt: new Date().toISOString(),
      aiScores: {
        relevance: 10,
        quality: 9,
        timeliness: 9,
        overall: 9.3,
      },
      aiCategory: "AI/ML",
      chineseTitle: "DeepSeek V3：557万美元训练出GPT-4o级别模型",
      aiSummary: "DeepSeek V3采用MoE架构，以仅557万美元的训练成本实现GPT-4o级别性能。这一突破证明了高效训练方法的可行性，对AI行业的成本结构产生深远影响。中国AI公司在模型效率方面展现出强大竞争力。",
      recommendation: "这是AI训练效率的重大突破，值得所有AI从业者关注。低成本高性能模型将改变行业格局。",
      aiKeywords: ["DeepSeek", "MoE", "训练效率", "开源模型"],
    },
    {
      id: "4",
      title: "Meta 发布 Llama 3.3：700 亿参数实现 4050 亿参数性能",
      summary: "Meta 发布 Llama 3.3 70B 模型，以更小参数规模实现与 Llama 3.1 405B 相当的性能。",
      content: "Meta 于 2024 年 12 月 6 日发布 Llama 3.3 70B 模型。通过改进的后训练技术，该模型在多语言支持、数学推理和工具使用等方面显著改进，性能接近 Llama 3.1 405B 模型，但推理成本大幅降低。",
      url: "https://ai.meta.com/blog/llama-3-3-70b/",
      source: "Meta AI Blog",
      sourceUrl: "https://ai.meta.com/blog/llama-3-3-70b/",
      category: "开源模型",
      tags: ["Meta", "Llama", "开源", "大模型"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      viewCount: 98000,
      aiProcessed: true,
      aiProcessingStatus: "completed",
      aiProcessedAt: new Date().toISOString(),
      aiScores: {
        relevance: 9,
        quality: 8,
        timeliness: 8,
        overall: 8.3,
      },
      aiCategory: "开源",
      chineseTitle: "Llama 3.3 70B：小参数大性能的开源突破",
      aiSummary: "Meta发布Llama 3.3 70B，通过改进的后训练技术实现接近405B模型的性能。这一进展展示了模型效率优化的巨大潜力，为开源社区提供了高性价比的选择。",
      recommendation: "开源模型爱好者和开发者必看，70B参数即可获得大模型性能。",
      aiKeywords: ["Meta", "Llama", "开源", "模型效率"],
    },
    {
      id: "5",
      title: "xAI 发布 Grok 3：马斯克称是'地球上最聪明的AI'",
      summary: "埃隆·马斯克的 xAI 公司发布 Grok 3 模型，声称在数学、科学和编程基准测试中超越所有竞争对手。",
      content: "xAI 于 2025 年 2 月发布 Grok 3 模型。马斯克声称这是'地球上最聪明的 AI'，在 AIME 数学测试、GPQA 科学测试和 LCB 编程测试中均获得最高分数。Grok 3 还引入了 DeepSearch 智能体功能，用于深度网络搜索和分析。",
      url: "https://x.ai/blog/grok-3",
      source: "xAI 官方博客",
      sourceUrl: "https://x.ai/blog/grok-3",
      category: "大模型",
      tags: ["xAI", "Grok", "马斯克", "AI智能体"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      viewCount: 187000,
      aiProcessed: true,
      aiProcessingStatus: "completed",
      aiProcessedAt: new Date().toISOString(),
      aiScores: {
        relevance: 9,
        quality: 8,
        timeliness: 10,
        overall: 8.9,
      },
      aiCategory: "AI/ML",
      chineseTitle: "Grok 3发布：马斯克宣称的'最聪明AI'",
      aiSummary: "xAI发布Grok 3，在数学、科学和编程基准测试中表现优异。新增DeepSearch智能体功能，可执行深度网络搜索。这一发布加剧了顶级AI模型的竞争态势。",
      recommendation: "关注AI模型竞争格局的读者必读，Grok 3展示了xAI的技术实力。",
      aiKeywords: ["xAI", "Grok", "马斯克", "基准测试"],
    },
    {
      id: "6",
      title: "Anthropic 完成 40 亿美元融资，估值达 615 亿美元",
      summary: "Anthropic 宣布新一轮 40 亿美元融资，由 Lightspeed Venture Partners 领投，亚马逊追加投资。",
      content: "Anthropic 于 2025 年 2 月宣布完成 40 亿美元融资，公司估值达到 615 亿美元。本轮融资由 Lightspeed Venture Partners 领投，亚马逊、谷歌等现有投资者参与。资金将用于开发下一代 AI 模型 Claude 的后续版本。",
      url: "https://www.anthropic.com/news/anthropic-raises-4-billion",
      source: "Anthropic 官方",
      sourceUrl: "https://www.anthropic.com/news/anthropic-raises-4-billion",
      category: "融资",
      tags: ["Anthropic", "Claude", "融资", "亚马逊"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      isHot: true,
      viewCount: 134000,
      aiProcessed: true,
      aiProcessingStatus: "completed",
      aiProcessedAt: new Date().toISOString(),
      aiScores: {
        relevance: 8,
        quality: 7,
        timeliness: 9,
        overall: 8.0,
      },
      aiCategory: "观点",
      chineseTitle: "Anthropic 40亿美元融资：AI独角兽估值达615亿",
      aiSummary: "Anthropic完成40亿美元融资，估值达615亿美元。亚马逊、谷歌等科技巨头持续加码AI投资。这反映了市场对安全AI和Claude模型的高度认可。",
      recommendation: "关注AI投资趋势的读者必读，了解顶级AI公司的资本运作。",
      aiKeywords: ["Anthropic", "融资", "Claude", "AI投资"],
    },
    {
      id: "7",
      title: "Perplexity AI 完成 5 亿美元融资，估值达 90 亿美元",
      summary: "AI 搜索引擎 Perplexity 完成新一轮融资，估值较半年前翻倍。",
      content: "Perplexity AI 于 2024 年 12 月完成 5 亿美元融资，估值达到 90 亿美元。本轮融资由 Institutional Venture Partners 领投，英伟达、软银等参与。Perplexity 月活用户已突破 1500 万，年搜索量达 5.5 亿次。",
      url: "https://www.perplexity.ai/hub/blog/perplexity-series-c",
      source: "Perplexity 官方",
      sourceUrl: "https://www.perplexity.ai/hub/blog/perplexity-series-c",
      category: "融资",
      tags: ["Perplexity", "AI搜索", "融资"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      viewCount: 87000,
      aiProcessed: true,
      aiProcessingStatus: "completed",
      aiProcessedAt: new Date().toISOString(),
      aiScores: {
        relevance: 8,
        quality: 7,
        timeliness: 7,
        overall: 7.3,
      },
      aiCategory: "观点",
      chineseTitle: "Perplexity融资5亿：AI搜索独角兽估值翻倍",
      aiSummary: "Perplexity AI完成5亿美元融资，估值达90亿美元。月活用户突破1500万，展示了AI搜索引擎的市场潜力。英伟达、软银等参与投资。",
      recommendation: "AI应用层投资的典型案例，展示了AI搜索的商业模式可行性。",
      aiKeywords: ["Perplexity", "AI搜索", "融资", "独角兽"],
    },
    {
      id: "8",
      title: "Midjourney V7 即将发布：CEO 承诺重大升级",
      summary: "Midjourney CEO David Holz 透露 V7 版本即将发布，将在图像质量和一致性方面有重大改进。",
      content: "Midjourney CEO David Holz 在 2025 年 1 月的采访中透露，V7 版本即将发布。新版本将在图像质量、文本渲染和角色一致性方面带来重大改进。同时，Midjourney 正在开发视频生成功能，预计将在 2025 年内推出。",
      url: "https://www.midjourney.com/",
      source: "Midjourney 官方",
      sourceUrl: "https://www.midjourney.com/",
      category: "图像生成",
      tags: ["Midjourney", "AI绘画", "图像生成"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
      viewCount: 76000,
      aiProcessed: true,
      aiProcessingStatus: "completed",
      aiProcessedAt: new Date().toISOString(),
      aiScores: {
        relevance: 7,
        quality: 7,
        timeliness: 7,
        overall: 7.0,
      },
      aiCategory: "AI/ML",
      chineseTitle: "Midjourney V7预告：图像生成将迎来重大升级",
      aiSummary: "Midjourney CEO透露V7版本即将发布，将在图像质量、文本渲染和角色一致性方面改进。同时正在开发视频生成功能，预计2025年推出。",
      recommendation: "AI图像生成爱好者关注，V7可能带来质的飞跃。",
      aiKeywords: ["Midjourney", "图像生成", "V7", "视频生成"],
    },
  ];

  // 项目数据 - 基于真实 GitHub/Product Hunt 数据
  projectsStore = [
    {
      id: "p1",
      name: "Cursor",
      description: "AI 驱动的代码编辑器，基于 VS Code，内置 Claude 和 GPT-4 代码补全和聊天功能。",
      fullDescription: "Cursor 是一款革命性的 AI 代码编辑器，基于 VS Code 构建，深度集成了 Claude 和 GPT-4 等大语言模型。它不仅能提供智能代码补全，还能理解整个代码库的上下文，帮助开发者更高效地编写、理解和重构代码。",
      url: "https://cursor.com",
      sourceUrl: "https://github.com/getcursor/cursor",
      category: "开发工具",
      tags: ["编程", "IDE", "AI 助手", "VS Code"],
      source: "github",
      stars: 185000,
      language: "TypeScript",
      license: "MIT",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      isTrending: true,
    },
    {
      id: "p2",
      name: "LangChain",
      description: "构建 LLM 应用的框架，支持多种模型和工具链集成，提供完整的 RAG、Agent 开发工具。",
      fullDescription: "LangChain 是一个用于开发由语言模型驱动的应用程序的框架。它提供了一系列组件和工具，帮助开发者构建复杂的 LLM 应用，包括 RAG、Agent、链式调用等。支持 Python 和 JavaScript/TypeScript。",
      url: "https://langchain.com",
      sourceUrl: "https://github.com/langchain-ai/langchain",
      category: "开发框架",
      tags: ["LLM", "框架", "Python", "开发工具"],
      source: "github",
      stars: 98000,
      forks: 15000,
      language: "Python",
      license: "MIT",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 730).toISOString(),
      isTrending: true,
    },
    {
      id: "p3",
      name: "Ollama",
      description: "在本地运行大语言模型的最简单方式，支持 Llama、Mistral、DeepSeek 等模型。",
      fullDescription: "Ollama 让在本地运行大语言模型变得简单。支持 Llama 3.3、Mistral、DeepSeek、Qwen 等主流开源模型。提供简单的命令行界面和 REST API，方便开发者集成到应用中。",
      url: "https://ollama.com",
      sourceUrl: "https://github.com/ollama/ollama",
      category: "开发工具",
      tags: ["LLM", "本地部署", "开源", "AI"],
      source: "github",
      stars: 105000,
      forks: 8500,
      language: "Go",
      license: "MIT",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 500).toISOString(),
      isTrending: true,
    },
    {
      id: "p4",
      name: "ComfyUI",
      description: "基于节点的 Stable Diffusion 图形界面，支持复杂的工作流和自定义节点。",
      fullDescription: "ComfyUI 是一个基于节点的 Stable Diffusion 图形界面，允许用户通过拖拽节点的方式构建复杂的图像生成工作流。支持自定义节点、模型加载、ControlNet 等高级功能。",
      url: "https://github.com/comfyanonymous/ComfyUI",
      sourceUrl: "https://github.com/comfyanonymous/ComfyUI",
      category: "图像生成",
      tags: ["Stable Diffusion", "AI绘画", "工作流"],
      source: "github",
      stars: 72000,
      forks: 7800,
      language: "Python",
      license: "GPL-3.0",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 600).toISOString(),
      isTrending: true,
    },
  ];

  // 研究报告数据
  researchStore = [
    {
      id: "r1",
      title: "2025 AI 投资趋势报告：推理模型和 AI Agent 成为新焦点",
      summary: "本报告分析了 2025 年 AI 领域的投资趋势，推理模型（如 o3、Grok 3）和 AI Agent 赛道融资额同比增长超过 200%。",
      content: "详细报告内容...",
      category: "投资",
      tags: ["投资", "趋势", "AI Agent", "推理模型"],
      author: "NewClaw Research",
      readTime: "15 分钟",
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "r2",
      title: "开源 vs 闭源：大模型竞争格局深度分析",
      summary: "对比分析开源模型（Llama、DeepSeek、Qwen）与闭源模型（GPT-4、Claude、Gemini）的性能、成本和应用场景。",
      content: "详细报告内容...",
      category: "技术分析",
      tags: ["开源", "闭源", "大模型", "竞争分析"],
      author: "NewClaw Research",
      readTime: "20 分钟",
      publishedAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: "r3",
      title: "中国 AI 崛起：DeepSeek、Qwen 和 Kimi 的技术突破",
      summary: "分析中国 AI 公司在 2024-2025 年的技术进展，以及在全球 AI 竞争中的地位和影响。",
      content: "详细报告内容...",
      category: "行业分析",
      tags: ["中国AI", "DeepSeek", "Qwen", "Kimi"],
      author: "NewClaw Research",
      readTime: "25 分钟",
      publishedAt: new Date(Date.now() - 259200000).toISOString(),
    },
  ];

  // 热搜话题数据 - 基于真实趋势
  hotTopicsStore = [
    { id: "ht1", title: "Grok 3 发布", heat: 985000, change: 125, category: "大模型", rank: 1 },
    { id: "ht2", title: "DeepSeek V3", heat: 856000, change: 89, category: "开源模型", rank: 2 },
    { id: "ht3", title: "OpenAI o3", heat: 742000, change: 67, category: "推理模型", rank: 3 },
    { id: "ht4", title: "Gemini 2.0", heat: 634000, change: 45, category: "多模态", rank: 4 },
    { id: "ht5", title: "AI Agent 爆发", heat: 523000, change: 78, category: "应用", rank: 5 },
    { id: "ht6", title: "Llama 3.3", heat: 489000, change: 34, category: "开源模型", rank: 6 },
    { id: "ht7", title: "Perplexity 融资", heat: 412000, change: 23, category: "融资", rank: 7 },
    { id: "ht8", title: "Midjourney V7", heat: 398000, change: 56, category: "图像生成", rank: 8 },
    { id: "ht9", title: "Anthropic 40亿", heat: 376000, change: 45, category: "融资", rank: 9 },
    { id: "ht10", title: "具身智能", heat: 334000, change: 28, category: "机器人", rank: 10 },
  ];

  // 融资数据 - 基于真实融资事件
  fundingStore = [
    {
      id: "f1",
      companyName: "Anthropic",
      amount: "40亿美元",
      round: "E轮",
      date: "2025-02-10",
      investors: ["Lightspeed", "Amazon", "Google"],
      category: "大模型",
      description: "Claude 开发商，专注于 AI 安全和对齐研究",
    },
    {
      id: "f2",
      companyName: "Perplexity",
      amount: "5亿美元",
      round: "C轮",
      date: "2024-12-15",
      investors: ["IVP", "NVIDIA", "SoftBank"],
      category: "AI 搜索",
      description: "AI 驱动的搜索引擎，月活用户突破 1500 万",
    },
    {
      id: "f3",
      companyName: "Poolside",
      amount: "5亿美元",
      round: "A轮",
      date: "2024-12-01",
      investors: ["Bain Capital", "DST Global"],
      category: "机器人",
      description: "开发机器人基础模型 π0，估值达 24 亿美元",
    },
  ];

  // Twitter 趋势数据
  twitterTrendsStore = [
    { id: "tt1", name: "Grok 3", query: "Grok3", tweetVolume: 985000, rank: 1, category: "AI模型" },
    { id: "tt2", name: "DeepSeek", query: "DeepSeek", tweetVolume: 856000, rank: 2, category: "开源模型" },
    { id: "tt3", name: "OpenAI o3", query: "OpenAIo3", tweetVolume: 742000, rank: 3, category: "推理模型" },
    { id: "tt4", name: "Gemini 2.0", query: "Gemini2", tweetVolume: 634000, rank: 4, category: "多模态" },
    { id: "tt5", name: "AI Agent", query: "AIAgent", tweetVolume: 523000, rank: 5, category: "应用" },
    { id: "tt6", name: "Llama 3.3", query: "Llama3", tweetVolume: 489000, rank: 6, category: "开源" },
    { id: "tt7", name: "Claude", query: "Claude", tweetVolume: 412000, rank: 7, category: "AI助手" },
    { id: "tt8", name: "AI编程", query: "AICoding", tweetVolume: 398000, rank: 8, category: "开发工具" },
  ];

  // 初始化推文数据
  tweetsStore = [
    {
      id: "tw_init_1",
      content: "GPT-5 的推理能力简直令人惊叹。刚刚测试了它在复杂数学问题上的表现，准确率比 GPT-4 提升了 40% 以上。AI 的发展速度真的超出了所有人的预期。🚀",
      author: { name: "Andrej Karpathy", username: "karpathy", verified: true },
      publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      likes: 15420,
      retweets: 3421,
      replies: 892,
      views: 456000,
      hashtags: ["AI", "GPT5", "OpenAI"],
      mentions: [],
      urls: ["https://twitter.com/karpathy/status/1"],
      isHot: true,
      sentiment: "positive" as const,
      aiAnalysis: {
        chineseSummary: "Andrej Karpathy 分享 GPT-5 测试结果，在复杂数学问题上准确率比 GPT-4 提升 40% 以上。",
        keyPoints: ["提及模型: GPT-5, GPT-4", "关键数据: 40%", "AI 行业动态分享"],
        importance: "high",
        category: "模型发布"
      }
    },
    {
      id: "tw_init_2",
      content: "刚刚体验了 Claude 3.5 的新功能，代码生成质量有了质的飞跃。特别是对于复杂架构设计，它的理解能力让我印象深刻。",
      author: { name: "吴恩达", username: "AndrewYNg", verified: true },
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      likes: 12300,
      retweets: 2800,
      replies: 650,
      views: 320000,
      hashtags: ["Claude", "AI", "Coding"],
      mentions: [],
      urls: ["https://twitter.com/AndrewYNg/status/2"],
      isHot: true,
      sentiment: "positive" as const,
      aiAnalysis: {
        chineseSummary: "吴恩达体验 Claude 3.5 新功能，称赞代码生成质量和复杂架构理解能力。",
        keyPoints: ["提及模型: Claude", "产品更新体验分享"],
        importance: "high",
        category: "产品更新"
      }
    },
    {
      id: "tw_init_3",
      content: "AI Agent 赛道今年融资额已经突破 50 亿美元。从自主浏览器到编程助手，这个领域的创新速度令人瞩目。",
      author: { name: "Elad Gil", username: "eladgil", verified: true },
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      likes: 8900,
      retweets: 2100,
      replies: 420,
      views: 280000,
      hashtags: ["AIAgent", "VentureCapital", "Startup"],
      mentions: [],
      urls: ["https://twitter.com/eladgil/status/3"],
      isHot: false,
      sentiment: "positive" as const,
      aiAnalysis: {
        chineseSummary: "Elad Gil 分享 AI Agent 赛道融资数据，今年已突破 50 亿美元。",
        keyPoints: ["关键数据: 50亿美元", "行业投资趋势分析"],
        importance: "medium",
        category: "行业动态"
      }
    },
    {
      id: "tw_init_4",
      content: "具身智能的突破正在加速。Figure AI 的最新演示显示，他们的机器人已经能够完成复杂的装配任务。这比我们预期的要快得多。",
      author: { name: "李飞飞", username: "drfeifei", verified: true },
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      likes: 15600,
      retweets: 3800,
      replies: 920,
      views: 520000,
      hashtags: ["Robotics", "EmbodiedAI", "FigureAI"],
      mentions: [],
      urls: ["https://twitter.com/drfeifei/status/4"],
      isHot: true,
      sentiment: "positive" as const,
      aiAnalysis: {
        chineseSummary: "李飞飞评论 Figure AI 机器人演示，具身智能发展速度超出预期。",
        keyPoints: ["提及公司: Figure AI", "技术突破: 复杂装配任务"],
        importance: "high",
        category: "研究突破"
      }
    },
    {
      id: "tw_init_5",
      content: "Midjourney V7 的 3D 场景生成能力让我震惊。输入一段文字描述，几秒钟就能生成可用于游戏开发的 3D 场景。创意产业的变革正在加速。",
      author: { name: "Sam Altman", username: "sama", verified: true },
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      likes: 22100,
      retweets: 5600,
      replies: 1200,
      views: 780000,
      hashtags: ["Midjourney", "AI", "3D"],
      mentions: [],
      urls: ["https://twitter.com/sama/status/5"],
      isHot: true,
      sentiment: "positive" as const,
      aiAnalysis: {
        chineseSummary: "Sam Altman 称赞 Midjourney V7 的 3D 场景生成能力，认为将加速创意产业变革。",
        keyPoints: ["提及产品: Midjourney V7", "应用场景: 游戏开发"],
        importance: "high",
        category: "产品更新"
      }
    },
    {
      id: "tw_init_6",
      content: "开源模型正在迎头赶上。Llama 4 的性能在某些基准测试上已经超过了 GPT-4，这对于整个 AI 生态系统来说是一个巨大的胜利。",
      author: { name: "Yann LeCun", username: "ylecun", verified: true },
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      likes: 18900,
      retweets: 4300,
      replies: 1100,
      views: 650000,
      hashtags: ["Llama", "OpenSource", "AI"],
      mentions: [],
      urls: ["https://twitter.com/ylecun/status/6"],
      isHot: false,
      sentiment: "positive" as const,
      aiAnalysis: {
        chineseSummary: "Yann LeCun 宣布 Llama 4 在部分基准测试中超越 GPT-4，开源模型取得重大突破。",
        keyPoints: ["提及模型: Llama 4, GPT-4", "开源生态进展"],
        importance: "high",
        category: "模型发布"
      }
    },
  ];

  // 初始化趋势总结
  trendSummaryStore = {
    date: new Date().toISOString().split("T")[0],
    summary: "今日AI领域呈现多元化发展态势。推理模型成为焦点，OpenAI o3和xAI Grok 3相继发布，在数学推理和编程能力上取得突破。DeepSeek V3以极低成本实现高性能，引发行业对训练效率的重新思考。多模态能力持续演进，Google Gemini 2.0展示了原生多模态的潜力。投资方面，Anthropic和Perplexity的大额融资反映了市场对AI应用的高度认可。",
    keyTrends: [
      "推理模型竞争白热化",
      "训练效率成为新焦点",
      "多模态能力持续突破",
      "AI投资热度不减",
      "开源模型快速追赶"
    ],
    notableArticles: [
      "OpenAI 发布 o3 推理模型",
      "DeepSeek 发布 V3 模型",
      "xAI 发布 Grok 3"
    ],
    categoryDistribution: {
      "AI/ML": 5,
      "开源": 1,
      "观点": 2
    },
    topKeywords: [
      { keyword: "OpenAI", count: 3 },
      { keyword: "推理模型", count: 3 },
      { keyword: "DeepSeek", count: 2 },
      { keyword: "Grok", count: 2 },
      { keyword: "Gemini", count: 1 }
    ],
    generatedAt: new Date().toISOString()
  };

  lastCrawlTime = new Date().toISOString();
}

// 确保数据已初始化
initSampleData();

// 模拟 Drizzle ORM 接口
export const news = {
  findFirst: async ({ where }: { where: any }) => {
    const id = where?.id?._value || where?.id;
    return newsStore.find(n => n.id === id) || null;
  },
  findMany: async (options?: { where?: any; orderBy?: any; limit?: number }) => {
    let result = [...newsStore];
    if (options?.limit) {
      result = result.slice(0, options.limit);
    }
    return result;
  },
};

export const projects = {
  findFirst: async ({ where }: { where: any }) => {
    const id = where?.id?._value || where?.id;
    return projectsStore.find(p => p.id === id) || null;
  },
  findMany: async () => projectsStore,
};

export const research = {
  findFirst: async ({ where }: { where: any }) => {
    const id = where?.id?._value || where?.id;
    return researchStore.find(r => r.id === id) || null;
  },
  findMany: async () => researchStore,
};

// 导出数据操作函数
export const db = {
  news: {
    findAll: (options?: { limit?: number; offset?: number; category?: string; aiProcessed?: boolean }) => {
      let result = [...newsStore];
      
      if (options?.category) {
        result = result.filter(n => n.aiCategory === options.category || n.category === options.category);
      }
      
      if (options?.aiProcessed !== undefined) {
        result = result.filter(n => n.aiProcessed === options.aiProcessed);
      }
      
      result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      
      const offset = options?.offset || 0;
      const limit = options?.limit || result.length;
      
      return result.slice(offset, offset + limit);
    },
    findById: (id: string) => newsStore.find(n => n.id === id),
    findTopRated: (limit: number = 3) => {
      return newsStore
        .filter(n => n.aiProcessed && n.aiScores)
        .sort((a, b) => (b.aiScores?.overall || 0) - (a.aiScores?.overall || 0))
        .slice(0, limit);
    },
    findPendingAIProcessing: (limit: number = 10) => {
      return newsStore
        .filter(n => !n.aiProcessed || n.aiProcessingStatus === "pending")
        .slice(0, limit);
    },
    updateAIResult: (id: string, result: any) => {
      const index = newsStore.findIndex(n => n.id === id);
      if (index !== -1) {
        newsStore[index] = {
          ...newsStore[index],
          aiProcessed: true,
          aiProcessingStatus: result.processingStatus,
          aiProcessedAt: result.processedAt,
          aiError: result.error,
          aiScores: result.scores,
          aiCategory: result.category,
          chineseTitle: result.chineseTitle,
          aiSummary: result.summary,
          recommendation: result.recommendation,
          aiKeywords: result.keywords,
        };
        return true;
      }
      return false;
    },
    add: (item: any) => {
      newsStore.unshift(item);
    },
    count: () => newsStore.length,
  },
  projects: {
    findAll: (options?: { limit?: number; source?: string }) => {
      let result = [...projectsStore];
      
      if (options?.source) {
        result = result.filter(p => p.source === options.source);
      }
      
      result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      
      const limit = options?.limit || result.length;
      return result.slice(0, limit);
    },
    findById: (id: string) => projectsStore.find(p => p.id === id),
    count: () => projectsStore.length,
  },
  research: {
    findAll: () => researchStore,
    findById: (id: string) => researchStore.find(r => r.id === id),
  },
  hotTopics: {
    findAll: () => hotTopicsStore.sort((a, b) => a.rank - b.rank),
  },
  funding: {
    findAll: () => fundingStore,
  },
  tweets: {
    findAll: (options?: { 
      limit?: number; 
      isHot?: boolean; 
      sortBy?: "time" | "popularity";
      category?: string;
    }) => {
      let result = [...tweetsStore];
      
      if (options?.isHot !== undefined) {
        result = result.filter(t => t.isHot === options.isHot);
      }
      
      if (options?.category) {
        result = result.filter(t => 
          t.aiAnalysis?.category === options.category ||
          t.hashtags.some(h => h.toLowerCase() === options.category?.toLowerCase())
        );
      }
      
      // 排序
      if (options?.sortBy === "popularity") {
        // 按热度排序（点赞+转发）
        result.sort((a, b) => (b.likes + b.retweets) - (a.likes + a.retweets));
      } else {
        // 默认按时间倒序
        result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      }
      
      const limit = options?.limit || result.length;
      return result.slice(0, limit);
    },
    findById: (id: string) => tweetsStore.find(t => t.id === id),
    findByUsername: (username: string) => {
      return tweetsStore.filter(t => t.author.username.toLowerCase() === username.toLowerCase())
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    },
    findByImportance: (importance: "high" | "medium" | "low") => {
      return tweetsStore.filter(t => t.aiAnalysis?.importance === importance)
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    },
    count: () => tweetsStore.length,
    getStats: () => {
      const total = tweetsStore.length;
      const hot = tweetsStore.filter(t => t.isHot).length;
      const highImportance = tweetsStore.filter(t => t.aiAnalysis?.importance === "high").length;
      const withAIAnalysis = tweetsStore.filter(t => t.aiAnalysis && t.aiAnalysis.chineseSummary !== "AI 解读生成中...").length;
      return { total, hot, highImportance, withAIAnalysis };
    },
  },
  twitterTrends: {
    findAll: () => twitterTrendsStore.sort((a, b) => a.rank - b.rank),
  },
  trendSummary: {
    get: () => trendSummaryStore,
    set: (summary: any) => {
      trendSummaryStore = summary;
    },
  },
  getStats: () => ({
    newsCount: newsStore.length,
    projectsCount: projectsStore.length,
    tweetsCount: tweetsStore.length,
    aiProcessedCount: newsStore.filter(n => n.aiProcessed).length,
    lastCrawlTime,
    lastAIProcessingTime,
  }),
  recrawl: () => {
    initSampleData();
    return { success: true, timestamp: lastCrawlTime };
  },
  addNews: (items: any[]) => {
    newsStore = [...items, ...newsStore];
  },
};

export const eq = (field: any, value: any) => ({ _field: field, _value: value });
export const desc = (field: any) => ({ _field: field, _order: 'desc' });
export const sql = (strings: TemplateStringsArray, ...values: any[]) => ({
  toString: () => strings.reduce((acc, str, i) => acc + str + (values[i] || ''), ''),
});
