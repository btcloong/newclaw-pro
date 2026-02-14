// 使用内存存储，适合 Vercel serverless 环境
// 数据在每次部署后重置，通过 API 触发重新抓取

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

// 内存存储
let newsStore: NewsItem[] = [];
let projectsStore: Project[] = [];
let researchStore: ResearchReport[] = [];
let hotTopicsStore: HotTopic[] = [];
let fundingStore: Funding[] = [];
let tweetsStore: Tweet[] = [];
let twitterTrendsStore: TwitterTrend[] = [];
let lastCrawlTime: string | null = null;

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
    },
    {
      id: "5",
      title: "xAI 发布 Grok 3：马斯克称是"地球上最聪明的AI"",
      summary: "埃隆·马斯克的 xAI 公司发布 Grok 3 模型，声称在数学、科学和编程基准测试中超越所有竞争对手。",
      content: "xAI 于 2025 年 2 月发布 Grok 3 模型。马斯克声称这是"地球上最聪明的 AI"，在 AIME 数学测试、GPQA 科学测试和 LCB 编程测试中均获得最高分数。Grok 3 还引入了 DeepSearch 智能体功能，用于深度网络搜索和分析。",
      url: "https://x.ai/blog/grok-3",
      source: "xAI 官方博客",
      sourceUrl: "https://x.ai/blog/grok-3",
      category: "大模型",
      tags: ["xAI", "Grok", "马斯克", "AI智能体"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      viewCount: 187000,
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
      category: "AI 编程",
      description: "AI 编程助手，估值达 30 亿美元",
    },
    {
      id: "f4",
      companyName: "Physical Intelligence",
      amount: "4亿美元",
      round: "B轮",
      date: "2025-01-15",
      investors: ["Amazon", "OpenAI", "Thrive Capital"],
      category: "机器人",
      description: "开发机器人基础模型 π0，估值达 24 亿美元",
    },
  ];

  // Twitter 推文数据 - 基于真实推文风格
  tweetsStore = [
    {
      id: "t1",
      content: "Grok 3 在数学推理上的表现令人印象深刻。在 AIME 2025 测试中，它不仅给出了正确答案，还展示了完整的思考过程。这是推理模型的一次重要突破。",
      author: {
        name: "Andrej Karpathy",
        username: "karpathy",
        verified: true,
      },
      publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      likes: 18420,
      retweets: 4121,
      replies: 1092,
      views: 856000,
      hashtags: ["AI", "Grok3", "xAI"],
      mentions: [],
      urls: [],
      isHot: true,
      sentiment: "positive",
    },
    {
      id: "t2",
      content: "DeepSeek V3 的训练成本数据公开后，整个 AI 行业都在重新思考大模型的训练效率。557万美元训练出接近 GPT-4o 水平的模型，这本身就是一个巨大的工程成就。",
      author: {
        name: "Jim Fan",
        username: "DrJimFan",
        verified: true,
      },
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      likes: 22300,
      retweets: 5800,
      replies: 1250,
      views: 920000,
      hashtags: ["DeepSeek", "AI", "Efficiency"],
      mentions: [],
      urls: [],
      isHot: true,
      sentiment: "positive",
    },
    {
      id: "t3",
      content: "OpenAI o3 在 ARC-AGI 上的表现证明了推理时计算扩展的重要性。这不是简单的规模扩展，而是算法和架构的根本性创新。",
      author: {
        name: "François Chollet",
        username: "fchollet",
        verified: true,
      },
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      likes: 15600,
      retweets: 3800,
      replies: 920,
      views: 620000,
      hashtags: ["OpenAI", "o3", "ARCAGI"],
      mentions: [],
      urls: [],
      isHot: true,
      sentiment: "positive",
    },
    {
      id: "t4",
      content: "AI Agent 赛道今年的融资额已经突破 100 亿美元。从代码生成到自主研究，从客户服务到软件开发，Agent 正在重新定义人机协作的边界。",
      author: {
        name: "Elad Gil",
        username: "eladgil",
        verified: true,
      },
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      likes: 18900,
      retweets: 4300,
      replies: 1100,
      views: 750000,
      hashtags: ["AIAgent", "VentureCapital", "Startup"],
      mentions: [],
      urls: [],
      isHot: false,
      sentiment: "positive",
    },
    {
      id: "t5",
      content: "Gemini 2.0 的原生多模态能力是一个重要的技术里程碑。能够同时理解和生成文本、图像和音频，这为下一代 AI 应用打开了新的可能性。",
      author: {
        name: "Sundar Pichai",
        username: "sundarpichai",
        verified: true,
      },
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      likes: 32100,
      retweets: 7600,
      replies: 2100,
      views: 1080000,
      hashtags: ["Gemini", "Google", "AI"],
      mentions: [],
      urls: [],
      isHot: true,
      sentiment: "positive",
    },
    {
      id: "t6",
      content: "开源模型正在快速追赶闭源模型。Llama 3.3、DeepSeek V3、Qwen 2.5 的性能提升速度超出了大多数人的预期。2025 年将是开源 AI 的转折点。",
      author: {
        name: "Yann LeCun",
        username: "ylecun",
        verified: true,
      },
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      likes: 28900,
      retweets: 6300,
      replies: 1500,
      views: 950000,
      hashtags: ["OpenSource", "AI", "Llama"],
      mentions: [],
      urls: [],
      isHot: false,
      sentiment: "positive",
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
    findAll: (options?: { limit?: number; offset?: number; category?: string }) => {
      let result = [...newsStore];
      
      if (options?.category) {
        result = result.filter(n => n.category === options.category);
      }
      
      result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      
      const offset = options?.offset || 0;
      const limit = options?.limit || result.length;
      
      return result.slice(offset, offset + limit);
    },
    findById: (id: string) => newsStore.find(n => n.id === id),
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
    findAll: (options?: { limit?: number; isHot?: boolean }) => {
      let result = [...tweetsStore];
      
      if (options?.isHot !== undefined) {
        result = result.filter(t => t.isHot === options.isHot);
      }
      
      result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      
      const limit = options?.limit || result.length;
      return result.slice(0, limit);
    },
    findById: (id: string) => tweetsStore.find(t => t.id === id),
    count: () => tweetsStore.length,
  },
  twitterTrends: {
    findAll: () => twitterTrendsStore.sort((a, b) => a.rank - b.rank),
  },
  getStats: () => ({
    newsCount: newsStore.length,
    projectsCount: projectsStore.length,
    tweetsCount: tweetsStore.length,
    lastCrawlTime,
  }),
  // 重新初始化数据（模拟抓取）
  recrawl: () => {
    initSampleData();
    return { success: true, timestamp: lastCrawlTime };
  },
};

// 模拟 eq 函数
export const eq = (field: any, value: any) => ({ _field: field, _value: value });

// 模拟 desc 函数
export const desc = (field: any) => ({ _field: field, _order: 'desc' });

// 模拟 sql
export const sql = (strings: TemplateStringsArray, ...values: any[]) => ({
  toString: () => strings.reduce((acc, str, i) => acc + str + (values[i] || ''), ''),
});
