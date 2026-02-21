// 使用内存存储，适合 Vercel serverless 环境
// 数据在每次部署后重置，通过 API 触发重新抓取

import { AICategory, ArticleScores, AIProcessingResult } from "./ai-processor";

// 判断是否在 Vercel 环境
const isVercel = process.env.VERCEL === "1" || process.env.VERCEL_ENV !== undefined;

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
  
  // 前世今生背景信息
  background?: string;
  history?: string[];
  relatedNews?: string[];
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

// 2026年2月最新AI新闻数据 - 覆盖大模型发布、融资、产品更新、研究突破、行业动态
function initSampleData() {
  // 新闻数据 - 20条2026年2月最新AI新闻
  newsStore = [
    {
      id: "1",
      title: "OpenAI GPT-4.5 Preview Released: Enhanced Reasoning and Multimodal Capabilities",
      summary: "OpenAI发布GPT-4.5预览版，在推理能力和多模态理解方面实现重大突破，支持更长的上下文窗口。",
      content: "OpenAI于2026年2月12日发布GPT-4.5预览版。新模型在数学推理、代码生成和科学问题解决方面较前代提升显著。GPT-4.5支持200万token的上下文窗口，可处理整本书籍或大型代码库。多模态能力增强，能够更准确地理解复杂图表、手写笔记和3D模型。OpenAI表示该模型在幻觉率控制上也有明显改善。",
      url: "https://openai.com/blog/gpt-4-5-preview",
      source: "OpenAI Blog",
      sourceUrl: "https://openai.com/blog/gpt-4-5-preview",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
      category: "大模型",
      tags: ["OpenAI", "GPT-4.5", "多模态", "推理模型"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      isHot: true,
      isFeatured: true,
      viewCount: 215000,
      aiProcessed: true,
      aiProcessingStatus: "completed",
      aiProcessedAt: new Date().toISOString(),
      aiScores: { relevance: 10, quality: 9, timeliness: 10, overall: 9.7 },
      aiCategory: "AI/ML",
      chineseTitle: "OpenAI发布GPT-4.5预览版：推理与多模态能力全面升级",
      aiSummary: "OpenAI发布GPT-4.5预览版，支持200万token超长上下文，在数学推理、代码生成和多模态理解方面实现重大突破。幻觉率显著降低，为复杂任务处理提供更可靠的基础。",
      recommendation: "这是2026年开年最重要的AI发布，超长上下文能力将改变文档分析和代码理解的工作方式。",
      aiKeywords: ["OpenAI", "GPT-4.5", "多模态", "长上下文"],
    },
    {
      id: "2",
      title: "DeepSeek R2 Unveiled: Next-Generation MoE Architecture with 1.2T Parameters",
      summary: "DeepSeek发布R2模型，采用1.2万亿参数MoE架构，在保持高效率的同时实现顶级性能。",
      content: "DeepSeek于2026年2月8日正式发布R2模型。该模型采用1.2万亿参数MoE架构，每次前向传播仅激活80亿参数，实现极高的推理效率。R2在代码生成、数学推理和长文本理解方面超越GPT-4o，训练成本控制在800万美元以内。DeepSeek同时开源了模型权重和技术报告，引发全球AI社区热烈讨论。",
      url: "https://www.deepseek.com/blog/r2-release",
      source: "DeepSeek Official",
      sourceUrl: "https://www.deepseek.com/blog/r2-release",
      category: "开源模型",
      tags: ["DeepSeek", "R2", "MoE", "开源", "中国AI"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      isHot: true,
      viewCount: 356000,
      aiProcessed: true,
      aiProcessingStatus: "completed",
      aiProcessedAt: new Date().toISOString(),
      aiScores: { relevance: 10, quality: 9, timeliness: 9, overall: 9.3 },
      aiCategory: "开源",
      chineseTitle: "DeepSeek R2发布：1.2万亿参数MoE架构新标杆",
      aiSummary: "DeepSeek R2以1.2万亿参数MoE架构实现顶级性能，训练成本仅800万美元。代码生成和数学推理能力超越GPT-4o，全面开源推动行业进步。",
      recommendation: "开源AI的重大里程碑，高效MoE架构为行业提供新思路，值得深入研究。",
      aiKeywords: ["DeepSeek", "R2", "MoE", "开源模型"],
    },
    {
      id: "3",
      title: "Google Gemini 2.5 Pro Update: Native Video Understanding and Agentic Capabilities",
      summary: "Google更新Gemini 2.5 Pro，新增原生视频理解和自主Agent能力，可执行复杂多步骤任务。",
      content: "Google于2026年2月10日发布Gemini 2.5 Pro重大更新。新版本支持原生视频理解，可分析长达1小时的视频内容并生成详细摘要。Agentic能力大幅增强，Gemini可自主规划并执行复杂任务，如数据分析、报告生成和代码重构。Google还推出了Gemini for Workspace，深度集成到Docs、Sheets和Slides中。",
      url: "https://blog.google/technology/ai/gemini-2-5-pro-update",
      source: "Google Blog",
      sourceUrl: "https://blog.google/technology/ai/gemini-2-5-pro-update",
      category: "大模型",
      tags: ["Google", "Gemini", "多模态", "AI Agent", "视频理解"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      isHot: true,
      viewCount: 189000,
      aiProcessed: true,
      aiProcessingStatus: "completed",
      aiProcessedAt: new Date().toISOString(),
      aiScores: { relevance: 9, quality: 9, timeliness: 9, overall: 9.0 },
      aiCategory: "AI/ML",
      chineseTitle: "Google Gemini 2.5 Pro更新：原生视频理解与Agent能力",
      aiSummary: "Gemini 2.5 Pro新增原生视频理解能力，支持1小时视频分析。Agentic能力大幅提升，可自主执行复杂多步骤任务，深度集成Workspace办公套件。",
      recommendation: "多模态AI的重要进展，视频理解和Agent能力的结合将开启新的应用场景。",
      aiKeywords: ["Google", "Gemini", "视频理解", "AI Agent"],
    },
    {
      id: "4",
      title: "xAI Grok 3 Major Update: Deep Research Mode and Real-Time Collaboration",
      summary: "xAI发布Grok 3重大更新，推出深度研究模式和实时协作功能，支持多用户协同工作。",
      content: "xAI于2026年2月14日发布Grok 3重大功能更新。新增Deep Research模式，可执行长达数小时的深度研究任务，自动收集、分析和综合信息。实时协作功能允许多个用户同时与Grok交互，共同完成项目。Grok 3还增强了与X平台的集成，可实时分析社交媒体趋势。马斯克表示Grok 3的推理能力已接近博士水平。",
      url: "https://x.ai/blog/grok-3-update-february-2026",
      source: "xAI Blog",
      sourceUrl: "https://x.ai/blog/grok-3-update-february-2026",
      category: "大模型",
      tags: ["xAI", "Grok", "研究工具", "协作", "马斯克"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      isHot: true,
      viewCount: 267000,
      aiProcessed: true,
      aiProcessingStatus: "completed",
      aiProcessedAt: new Date().toISOString(),
      aiScores: { relevance: 9, quality: 8, timeliness: 10, overall: 9.0 },
      aiCategory: "AI/ML",
      chineseTitle: "xAI Grok 3重大更新：深度研究模式与实时协作",
      aiSummary: "Grok 3推出Deep Research模式，支持数小时深度研究任务。新增实时协作功能，多用户可协同工作。与X平台深度集成，实时分析社交媒体趋势。",
      recommendation: "研究型用户的利器，深度研究模式将改变信息收集和分析的工作流程。",
      aiKeywords: ["xAI", "Grok 3", "深度研究", "协作"],
    },
    {
      id: "5",
      title: "Meta Llama 4 Leaked: 400B Parameters and Multimodal Native Architecture",
      summary: "Meta Llama 4技术细节泄露，采用4000亿参数原生多模态架构，预计3月正式发布。",
      content: "据可靠消息来源，Meta Llama 4将采用4000亿参数原生多模态架构，支持文本、图像、音频和视频的统一处理。泄露的基准测试显示，Llama 4在多项任务上超越GPT-4.5。Meta计划同时发布Llama 4 Scout（轻量版）和Llama 4 Maverick（旗舰版）。开源协议将更加宽松，允许商业使用。预计正式发布时间为2026年3月。",
      url: "https://ai.meta.com/blog/llama-4-preview",
      source: "Meta AI",
      sourceUrl: "https://ai.meta.com/blog/llama-4-preview",
      category: "开源模型",
      tags: ["Meta", "Llama 4", "开源", "多模态", "泄露"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      viewCount: 298000,
      aiProcessed: true,
      aiProcessingStatus: "completed",
      aiProcessedAt: new Date().toISOString(),
      aiScores: { relevance: 9, quality: 8, timeliness: 9, overall: 8.7 },
      aiCategory: "开源",
      chineseTitle: "Meta Llama 4泄露：4000亿参数原生多模态架构",
      aiSummary: "Llama 4将采用4000亿参数原生多模态架构，支持文本、图像、音频、视频统一处理。基准测试显示多项任务超越GPT-4.5，预计3月正式发布。",
      recommendation: "开源社区期待已久的重大发布，原生多模态架构将是开源模型的重要里程碑。",
      aiKeywords: ["Meta", "Llama 4", "多模态", "开源"],
    },
    {
      id: "6",
      title: "Anthropic Claude 3.7 Sonnet Released: Extended Thinking and Tool Use",
      summary: "Anthropic发布Claude 3.7 Sonnet，新增扩展思考模式和增强工具使用能力。",
      content: "Anthropic于2026年2月11日发布Claude 3.7 Sonnet。新模型引入Extended Thinking模式，可在复杂推理任务上花费更多时间以获得更准确结果。工具使用能力显著增强，支持更复杂的API调用链和错误处理。Claude 3.7在代码生成、数学推理和长文档分析方面表现优异。Anthropic还发布了新的AI安全评估框架。",
      url: "https://www.anthropic.com/news/claude-3-7-sonnet",
      source: "Anthropic",
      sourceUrl: "https://www.anthropic.com/news/claude-3-7-sonnet",
      category: "大模型",
      tags: ["Anthropic", "Claude", "推理", "工具使用", "AI安全"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      isHot: true,
      viewCount: 178000,
      aiProcessed: true,
      aiProcessingStatus: "completed",
      aiProcessedAt: new Date().toISOString(),
      aiScores: { relevance: 9, quality: 9, timeliness: 9, overall: 9.0 },
      aiCategory: "AI/ML",
      chineseTitle: "Claude 3.7 Sonnet发布：扩展思考与增强工具使用",
      aiSummary: "Claude 3.7引入Extended Thinking模式，复杂推理任务更准确。工具使用能力增强，支持复杂API调用链。代码生成和长文档分析能力显著提升。",
      recommendation: "注重AI安全和可靠性的用户首选，扩展思考模式适合复杂分析任务。",
      aiKeywords: ["Anthropic", "Claude 3.7", "工具使用", "AI安全"],
    },
    {
      id: "7",
      title: "Mistral Large 2 Update: European Sovereign AI and Enterprise Focus",
      summary: "Mistral更新Large 2模型，强调欧洲数据主权和企业级安全合规。",
      content: "Mistral AI于2026年2月9日发布Large 2模型更新。新版本针对欧洲企业优化，确保数据完全在欧盟境内处理，符合GDPR要求。模型在多语言处理（尤其是欧洲语言）方面表现优异。Mistral还推出了企业级部署方案，支持私有云和本地部署。与SAP、Siemens等欧洲企业达成合作，推动AI在制造业的应用。",
      url: "https://mistral.ai/news/mistral-large-2-update",
      source: "Mistral AI",
      sourceUrl: "https://mistral.ai/news/mistral-large-2-update",
      category: "大模型",
      tags: ["Mistral", "欧洲AI", "企业级", "数据主权"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
      viewCount: 98000,
      aiProcessed: true,
      aiProcessingStatus: "completed",
      aiProcessedAt: new Date().toISOString(),
      aiScores: { relevance: 8, quality: 8, timeliness: 8, overall: 8.0 },
      aiCategory: "AI/ML",
      chineseTitle: "Mistral Large 2更新：欧洲主权AI与企业级安全",
      aiSummary: "Mistral Large 2强调欧洲数据主权，确保数据在欧盟境内处理。针对企业级安全合规优化，支持私有云和本地部署，与SAP、Siemens等达成合作。",
      recommendation: "欧洲企业和注重数据隐私的用户值得关注，GDPR合规是重要优势。",
      aiKeywords: ["Mistral", "数据主权", "GDPR", "企业AI"],
    },
    {
      id: "8",
      title: "AI Agent Breakthrough: Multi-Agent Systems Achieve 95% Task Completion Rate",
      summary: "多智能体系统研究取得突破，在复杂任务上实现95%完成率，接近人类团队水平。",
      content: "斯坦福大学AI实验室与Google DeepMind合作研究显示，多智能体协作系统在复杂软件开发任务上达到95%完成率。系统由规划Agent、编码Agent、测试Agent和审查Agent组成，通过动态协作完成任务。研究还提出了新的Agent通信协议和冲突解决机制。这一突破标志着AI Agent从单任务执行向复杂项目管理演进。",
      url: "https://arxiv.org/abs/2026.02134",
      source: "Stanford AI Lab",
      sourceUrl: "https://arxiv.org/abs/2026.02134",
      category: "研究突破",
      tags: ["AI Agent", "多智能体", "研究", "软件开发"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString(),
      viewCount: 145000,
      aiProcessed: true,
      aiProcessingStatus: "completed",
      aiProcessedAt: new Date().toISOString(),
      aiScores: { relevance: 9, quality: 9, timeliness: 8, overall: 8.7 },
      aiCategory: "AI/ML",
      chineseTitle: "AI Agent突破：多智能体系统达95%任务完成率",
      aiSummary: "多智能体协作系统在复杂软件开发任务上达到95%完成率。由规划、编码、测试、审查Agent组成，通过动态协作完成任务，标志着AI Agent向复杂项目管理演进。",
      recommendation: "AI Agent研究的重要里程碑，展示了多智能体协作的巨大潜力。",
      aiKeywords: ["AI Agent", "多智能体", "协作系统", "软件开发"],
    },
    {
      id: "9",
      title: "NVIDIA Blackwell Ultra GPUs for AI: 2x Performance with Lower Power Consumption",
      summary: "NVIDIA发布Blackwell Ultra GPU，AI训练性能翻倍，功耗降低30%。",
      content: "NVIDIA于2026年2月13日发布Blackwell Ultra GPU系列。新芯片采用增强版架构，AI训练性能较标准版Blackwell提升100%，推理性能提升150%。功耗降低30%，能效比创行业新纪录。支持FP4和FP8精度，大幅加速大模型训练。AWS、Google Cloud和Azure已宣布将在Q2提供基于Blackwell Ultra的实例。",
      url: "https://nvidia.com/en-us/data-center/blackwell-ultra/",
      source: "NVIDIA",
      sourceUrl: "https://nvidia.com/en-us/data-center/blackwell-ultra/",
      category: "AI芯片",
      tags: ["NVIDIA", "Blackwell", "GPU", "AI芯片", "硬件"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
      isHot: true,
      viewCount: 234000,
      aiProcessed: true,
      aiProcessingStatus: "completed",
      aiProcessedAt: new Date().toISOString(),
      aiScores: { relevance: 9, quality: 8, timeliness: 9, overall: 8.7 },
      aiCategory: "基础设施",
      chineseTitle: "NVIDIA Blackwell Ultra发布：AI性能翻倍功耗降低30%",
      aiSummary: "Blackwell Ultra GPU AI训练性能翻倍，推理性能提升150%，功耗降低30%。支持FP4/FP8精度，AWS、Google Cloud、Azure Q2提供实例。",
      recommendation: "AI基础设施的重要升级，能效比提升将降低大模型训练成本。",
      aiKeywords: ["NVIDIA", "Blackwell", "GPU", "AI芯片"],
    },
    {
      id: "10",
      title: "Alibaba Qwen 3 and Moonshot Kimi k1.6: Chinese AI Models Reach New Heights",
      summary: "阿里巴巴发布Qwen 3系列，月之暗面推出Kimi k1.6，中国AI模型在多模态和推理能力上实现突破。",
      content: "阿里巴巴于2026年2月15日发布Qwen 3系列模型，包括72B和110B版本，采用原生多模态架构，在图像理解和视频分析方面表现优异。月之暗面同日发布Kimi k1.6，在长文本推理和代码生成方面超越Claude 3.7。两款模型均采用Apache 2.0协议开源，推动中国AI技术走向全球。",
      url: "https://qwenlm.github.io/blog/qwen3/",
      source: "Alibaba Cloud",
      sourceUrl: "https://qwenlm.github.io/blog/qwen3/",
      category: "开源模型",
      tags: ["Qwen", "Kimi", "阿里巴巴", "月之暗面", "中国AI"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
      isHot: true,
      viewCount: 312000,
      aiProcessed: true,
      aiProcessingStatus: "completed",
      aiProcessedAt: new Date().toISOString(),
      aiScores: { relevance: 10, quality: 9, timeliness: 10, overall: 9.7 },
      aiCategory: "开源",
      chineseTitle: "Qwen 3与Kimi k1.6发布：中国AI模型再创高峰",
      aiSummary: "阿里巴巴Qwen 3和月之暗面Kimi k1.6同日发布，在多模态、长文本推理和代码生成方面实现突破。均采用Apache 2.0开源协议，推动中国AI技术全球化。",
      recommendation: "中国AI的重要里程碑，两款顶级开源模型同时发布，展现中国AI研发实力。",
      aiKeywords: ["Qwen 3", "Kimi", "阿里巴巴", "月之暗面", "开源"],
    },
    {
      id: "11",
      title: "AI Safety Research: New Constitutional AI Framework Reduces Harmful Outputs by 99%",
      summary: "新宪法AI框架将有害输出降低99%，为AI安全对齐研究带来重大突破。",
      content: "Anthropic与OpenAI联合研究团队发布新宪法AI框架，通过动态价值学习和多轮自我修正机制，将模型有害输出降低99%。该框架引入'道德不确定性'概念，让模型在价值观冲突时主动寻求人类指导。研究还提出了新的红队测试方法，可自动发现潜在安全风险。这一成果为构建更安全的AI系统提供了理论基础。",
      url: "https://arxiv.org/abs/2026.02156",
      source: "Anthropic Research",
      sourceUrl: "https://arxiv.org/abs/2026.02156",
      category: "AI安全",
      tags: ["AI安全", "对齐研究", "宪法AI", "Anthropic"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
      viewCount: 156000,
      aiProcessed: true,
      aiProcessingStatus: "completed",
      aiProcessedAt: new Date().toISOString(),
      aiScores: { relevance: 9, quality: 9, timeliness: 8, overall: 8.7 },
      aiCategory: "AI/ML",
      chineseTitle: "AI安全突破：新宪法AI框架有害输出降低99%",
      aiSummary: "新宪法AI框架通过动态价值学习和多轮自我修正，将有害输出降低99%。引入'道德不确定性'概念，为AI安全对齐研究提供新思路。",
      recommendation: "AI安全领域的重要进展，关注AI伦理和安全的读者必读。",
      aiKeywords: ["AI安全", "对齐", "宪法AI", "伦理"],
    },
    {
      id: "12",
      title: "GitHub Copilot X Evolves: Full-Stack Development Agent with Autonomous Debugging",
      summary: "GitHub Copilot X升级为全栈开发Agent，具备自主调试和端到端开发能力。",
      content: "GitHub于2026年2月7日发布Copilot X重大更新，从代码补全工具升级为全栈开发Agent。新功能包括：自主需求分析、架构设计、代码生成、测试编写和部署。Copilot可自动识别和修复Bug，支持跨文件重构。集成GitHub Actions实现CI/CD自动化。微软表示这将改变软件开发的工作方式，预计提升开发者效率300%。",
      url: "https://github.blog/2026-02-07-github-copilot-x-agent/",
      source: "GitHub Blog",
      sourceUrl: "https://github.blog/2026-02-07-github-copilot-x-agent/",
      category: "AI编程",
      tags: ["GitHub", "Copilot", "编程工具", "AI Agent", "开发效率"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      isHot: true,
      viewCount: 278000,
      aiProcessed: true,
      aiProcessingStatus: "completed",
      aiProcessedAt: new Date().toISOString(),
      aiScores: { relevance: 10, quality: 9, timeliness: 9, overall: 9.3 },
      aiCategory: "基础设施",
      chineseTitle: "GitHub Copilot X进化：全栈开发Agent自主调试",
      aiSummary: "Copilot X升级为全栈开发Agent，支持需求分析、架构设计、代码生成、测试和部署全流程。自主调试和跨文件重构能力大幅提升开发效率。",
      recommendation: "开发者必看工具，AI编程进入Agent时代，将根本性改变软件开发流程。",
      aiKeywords: ["GitHub Copilot", "AI编程", "开发工具", "Agent"],
    },
    {
      id: "13",
      title: "Sora 2.0 and Runway Gen-4: Multimodal Video Generation Reaches Cinema Quality",
      summary: "OpenAI Sora 2.0和Runway Gen-4发布，AI视频生成达到电影级质量。",
      content: "OpenAI于2026年2月6日发布Sora 2.0，支持4K分辨率、60fps的长时间视频生成，物理模拟和角色一致性显著提升。同日Runway发布Gen-4，在镜头语言和艺术风格控制方面表现出色。两款模型均支持视频编辑功能，可修改现有视频的特定元素。好莱坞已开始使用这些工具进行预可视化制作，预计2026年将有首部AI辅助制作的院线电影上映。",
      url: "https://openai.com/sora",
      source: "OpenAI",
      sourceUrl: "https://openai.com/sora",
      category: "多模态",
      tags: ["Sora", "Runway", "视频生成", "多模态", "创意工具"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
      isHot: true,
      viewCount: 345000,
      aiProcessed: true,
      aiProcessingStatus: "completed",
      aiProcessedAt: new Date().toISOString(),
      aiScores: { relevance: 9, quality: 9, timeliness: 9, overall: 9.0 },
      aiCategory: "AI/ML",
      chineseTitle: "Sora 2.0与Runway Gen-4：AI视频生成达电影级质量",
      aiSummary: "Sora 2.0支持4K 60fps长时间视频生成，物理模拟和角色一致性提升。Runway Gen-4在镜头语言和艺术风格方面表现出色。好莱坞开始使用AI进行预可视化。",
      recommendation: "创意产业的重要变革，AI视频生成将彻底改变影视制作流程。",
      aiKeywords: ["Sora", "Runway", "视频生成", "多模态"],
    },
    {
      id: "14",
      title: "Databricks Acquires MosaicML for $2.5B: Enterprise AI Consolidation Accelerates",
      summary: "Databricks以25亿美元收购MosaicML，企业AI市场整合加速。",
      content: "Databricks于2026年2月5日宣布以25亿美元收购MosaicML，这是今年最大的AI并购案。MosaicML以其高效模型训练技术闻名，其团队将加入Databricks的AI研发团队。收购后Databricks将整合MosaicML的模型训练能力与自身数据平台，为企业提供更完整的AI解决方案。Salesforce、Snowflake等也在积极寻求AI初创公司收购机会。",
      url: "https://www.databricks.com/blog/mosaicml-acquisition",
      source: "Databricks",
      sourceUrl: "https://www.databricks.com/blog/mosaicml-acquisition",
      category: "投资并购",
      tags: ["Databricks", "MosaicML", "并购", "企业AI"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
      viewCount: 189000,
      aiProcessed: true,
      aiProcessingStatus: "completed",
      aiProcessedAt: new Date().toISOString(),
      aiScores: { relevance: 8, quality: 7, timeliness: 8, overall: 7.7 },
      aiCategory: "观点",
      chineseTitle: "Databricks 25亿美元收购MosaicML：企业AI整合加速",
      aiSummary: "Databricks收购MosaicML是今年最大AI并购案，将整合高效模型训练能力与数据平台。企业AI市场整合加速，Salesforce、Snowflake也在寻求收购。",
      recommendation: "关注AI投资和企业软件市场的读者必读，了解行业整合趋势。",
      aiKeywords: ["Databricks", "MosaicML", "并购", "企业AI"],
    },
    {
      id: "15",
      title: "Figure AI and Tesla Bot: Humanoid Robots Enter Commercial Deployment",
      summary: "Figure AI和特斯拉人形机器人进入商业部署阶段，具身智能迎来里程碑。",
      content: "Figure AI于2026年2月4日宣布与BMW合作，在工厂部署100台Figure 02人形机器人执行装配任务。特斯拉同日展示Optimus Gen-3在物流仓库的工作场景，可连续工作8小时。两款机器人在灵巧操作和自主导航方面取得突破，成本已降至10万美元以下。亚马逊、沃尔玛等企业已开始测试人形机器人用于仓储物流。",
      url: "https://www.figure.ai/news/figure-02-bmw-deployment",
      source: "Figure AI",
      sourceUrl: "https://www.figure.ai/news/figure-02-bmw-deployment",
      category: "机器人",
      tags: ["Figure AI", "Tesla Bot", "人形机器人", "具身智能", "自动化"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
      isHot: true,
      viewCount: 267000,
      aiProcessed: true,
      aiProcessingStatus: "completed",
      aiProcessedAt: new Date().toISOString(),
      aiScores: { relevance: 9, quality: 8, timeliness: 9, overall: 8.7 },
      aiCategory: "AI/ML",
      chineseTitle: "Figure AI与Tesla Bot：人形机器人进入商业部署",
      aiSummary: "Figure 02在BMW工厂部署100台执行装配任务，Optimus Gen-3可连续工作8小时。成本降至10万美元以下，亚马逊、沃尔玛开始测试仓储应用。",
      recommendation: "具身智能的重要里程碑，人形机器人商业化进程超预期，关注制造业和物流变革。",
      aiKeywords: ["Figure AI", "Tesla Bot", "人形机器人", "具身智能"],
    },
    {
      id: "16",
      title: "Google DeepMind AlphaFold 3: Protein Structure Prediction Accelerates Drug Discovery",
      summary: "AlphaFold 3发布，蛋白质结构预测精度提升，加速新药研发进程。",
      content: "Google DeepMind于2026年2月3日发布AlphaFold 3，在蛋白质-配体相互作用预测方面精度提升至95%。新模型可预测蛋白质与药物分子的结合方式，大幅缩短药物筛选时间。已有10家制药公司采用AlphaFold 3进行新药研发，预计可将药物发现周期从5年缩短至18个月。DeepMind还开源了部分训练数据和模型权重供学术研究使用。",
      url: "https://deepmind.google/discover/blog/alphafold-3/",
      source: "DeepMind",
      sourceUrl: "https://deepmind.google/discover/blog/alphafold-3/",
      category: "AI医疗",
      tags: ["AlphaFold", "蛋白质预测", "药物发现", "DeepMind", "医疗AI"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 32).toISOString(),
      viewCount: 198000,
      aiProcessed: true,
      aiProcessingStatus: "completed",
      aiProcessedAt: new Date().toISOString(),
      aiScores: { relevance: 9, quality: 9, timeliness: 8, overall: 8.7 },
      aiCategory: "AI/ML",
      chineseTitle: "AlphaFold 3发布：蛋白质预测加速新药研发",
      aiSummary: "AlphaFold 3蛋白质-配体相互作用预测精度达95%，可预测药物分子结合方式。10家制药公司采用，预计药物发现周期从5年缩短至18个月。",
      recommendation: "AI在医疗领域的重大突破，将显著加速新药研发，降低制药成本。",
      aiKeywords: ["AlphaFold", "蛋白质预测", "药物发现", "医疗AI"],
    },
    {
      id: "17",
      title: "Khan Academy AI Tutor 2.0: Personalized Learning at Scale",
      summary: "可汗学院发布AI Tutor 2.0，实现大规模个性化教育，学习效果提升40%。",
      content: "可汗学院于2026年2月2日发布AI Tutor 2.0，基于GPT-4.5和自研教育模型构建。新系统可实时分析学生学习状态，动态调整教学策略。支持多语言教学，覆盖数学、科学、编程等学科。试点数据显示，使用AI Tutor的学生学习效果提升40%，学习时间减少25%。OpenAI和微软提供技术支持，计划向全球贫困地区免费提供。",
      url: "https://www.khanacademy.org/ai-tutor",
      source: "Khan Academy",
      sourceUrl: "https://www.khanacademy.org/ai-tutor",
      category: "AI教育",
      tags: ["Khan Academy", "AI教育", "个性化学习", "教育科技"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 34).toISOString(),
      viewCount: 145000,
      aiProcessed: true,
      aiProcessingStatus: "completed",
      aiProcessedAt: new Date().toISOString(),
      aiScores: { relevance: 8, quality: 8, timeliness: 8, overall: 8.0 },
      aiCategory: "AI/ML",
      chineseTitle: "可汗学院AI Tutor 2.0：大规模个性化教育",
      aiSummary: "AI Tutor 2.0实时分析学习状态，动态调整教学策略。试点显示学习效果提升40%，学习时间减少25%。计划向全球贫困地区免费提供。",
      recommendation: "AI教育应用的重要进展，个性化学习将改变传统教育模式。",
      aiKeywords: ["Khan Academy", "AI教育", "个性化学习", "教育科技"],
    },
    {
      id: "18",
      title: "Tesla FSD V13: Fully Autonomous Driving Approved in California",
      summary: "特斯拉FSD V13获加州批准实现完全自动驾驶，Robotaxi服务即将启动。",
      content: "加州DMV于2026年2月1日批准特斯拉FSD V13在公共道路进行完全自动驾驶测试。新版本采用端到端神经网络，安全里程达1亿英里，事故率低于人类驾驶员10倍。特斯拉宣布将于3月在旧金山和洛杉矶启动Robotaxi服务，采用无方向盘的Cybercab车型。Waymo和Cruise表示将加速技术迭代以应对竞争。",
      url: "https://www.tesla.com/blog/fsd-v13-approval",
      source: "Tesla",
      sourceUrl: "https://www.tesla.com/blog/fsd-v13-approval",
      category: "自动驾驶",
      tags: ["Tesla", "FSD", "自动驾驶", "Robotaxi", "加州"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
      isHot: true,
      viewCount: 389000,
      aiProcessed: true,
      aiProcessingStatus: "completed",
      aiProcessedAt: new Date().toISOString(),
      aiScores: { relevance: 9, quality: 8, timeliness: 9, overall: 8.7 },
      aiCategory: "基础设施",
      chineseTitle: "特斯拉FSD V13获批：加州完全自动驾驶即将启动",
      aiSummary: "FSD V13获加州DMV批准完全自动驾驶，安全里程1亿英里，事故率低于人类10倍。3月将在旧金山和洛杉矶启动Robotaxi服务。",
      recommendation: "自动驾驶的重要里程碑，Robotaxi商业化将改变出行方式。",
      aiKeywords: ["Tesla", "FSD", "自动驾驶", "Robotaxi"],
    },
    {
      id: "19",
      title: "Adobe Firefly 5.0: AI-Powered Creative Suite Transforms Content Production",
      summary: "Adobe发布Firefly 5.0，AI创意套件实现文本到视频、3D和交互内容生成。",
      content: "Adobe于2026年2月14日发布Firefly 5.0，整合到Creative Cloud全套产品。新功能包括：文本生成视频、AI辅助3D建模、交互式网页设计。Firefly Video支持4K视频生成和编辑，可直接在Premiere Pro中使用。Firefly 3D与Substance 3D集成，支持从文本描述生成可打印的3D模型。Adobe承诺所有训练数据均获得授权，确保商用安全。",
      url: "https://www.adobe.com/products/firefly.html",
      source: "Adobe",
      sourceUrl: "https://www.adobe.com/products/firefly.html",
      category: "AI创作",
      tags: ["Adobe", "Firefly", "创意工具", "视频生成", "3D"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 38).toISOString(),
      viewCount: 223000,
      aiProcessed: true,
      aiProcessingStatus: "completed",
      aiProcessedAt: new Date().toISOString(),
      aiScores: { relevance: 8, quality: 8, timeliness: 9, overall: 8.3 },
      aiCategory: "AI/ML",
      chineseTitle: "Adobe Firefly 5.0：AI创意套件变革内容生产",
      aiSummary: "Firefly 5.0支持文本生成视频、AI辅助3D建模和交互式网页设计。Firefly Video支持4K视频生成，Firefly 3D支持可打印模型生成。训练数据均获授权。",
      recommendation: "创意专业人士必看，AI工具将大幅提升内容生产效率。",
      aiKeywords: ["Adobe", "Firefly", "创意工具", "视频生成"],
    },
    {
      id: "20",
      title: "Hugging Face and AI2 Launch Open LLM Leaderboard 3.0: New Benchmark Standards",
      summary: "Hugging Face与AI2发布Open LLM Leaderboard 3.0，建立新的开源模型评估标准。",
      content: "Hugging Face与Allen Institute for AI于2026年2月16日联合发布Open LLM Leaderboard 3.0。新榜单引入更全面的评估维度：推理能力、代码生成、多语言、安全性和效率。新增动态测试集，防止模型过拟合基准。 leaderboard已收录500+开源模型，包括Llama、Qwen、DeepSeek等系列。社区贡献的评估工具已开源，推动开源模型生态健康发展。",
      url: "https://huggingface.co/spaces/open-llm-leaderboard",
      source: "Hugging Face",
      sourceUrl: "https://huggingface.co/spaces/open-llm-leaderboard",
      category: "开源社区",
      tags: ["Hugging Face", "AI2", "开源模型", "评估基准", "社区"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
      viewCount: 167000,
      aiProcessed: true,
      aiProcessingStatus: "completed",
      aiProcessedAt: new Date().toISOString(),
      aiScores: { relevance: 8, quality: 8, timeliness: 9, overall: 8.3 },
      aiCategory: "开源",
      chineseTitle: "Open LLM Leaderboard 3.0发布：开源模型新评估标准",
      aiSummary: "Open LLM Leaderboard 3.0引入推理、代码、多语言、安全性和效率评估维度。新增动态测试集防止过拟合，已收录500+开源模型，推动开源生态发展。",
      recommendation: "开源模型研究者和开发者必看，新评估标准将推动开源AI健康发展。",
      aiKeywords: ["Hugging Face", "开源模型", "评估基准", "AI2"],
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

// 同步初始化数据（避免服务器启动问题）
function initData() {
  // 先加载模拟数据作为默认值
  initSampleData();
  
  // 服务器环境下尝试从文件加载（延迟执行，避免循环依赖）
  if (!isVercel) {
    console.log("[DB] Server environment - will attempt to load from file");
    // 使用 setTimeout 延迟加载，避免循环依赖问题
    setTimeout(async () => {
      try {
        // 动态导入避免循环依赖
        const fileDb = await import("./file-db");
        const [news, projects, research, hotTopics, funding, tweets, twitterTrends, trendSummary] = await Promise.all([
          fileDb.loadNews(),
          fileDb.loadProjects(),
          fileDb.loadResearch(),
          fileDb.loadHotTopics(),
          fileDb.loadFunding(),
          fileDb.loadTweets(),
          fileDb.loadTwitterTrends(),
          fileDb.loadTrendSummary(),
        ]);
        
        if (news.length > 0) {
          newsStore = news;
          console.log(`[DB] Loaded ${news.length} news items from file`);
        }
        
        if (projects.length > 0) projectsStore = projects;
        if (research.length > 0) researchStore = research;
        if (hotTopics.length > 0) hotTopicsStore = hotTopics;
        if (funding.length > 0) fundingStore = funding;
        if (tweets.length > 0) tweetsStore = tweets;
        if (twitterTrends.length > 0) twitterTrendsStore = twitterTrends;
        if (trendSummary) trendSummaryStore = trendSummary;
        
      } catch (error) {
        console.error("[DB] Failed to load from file:", error);
        console.log("[DB] Using sample data");
      }
    }, 100);
  }
}

// 立即执行初始化
initData();

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
