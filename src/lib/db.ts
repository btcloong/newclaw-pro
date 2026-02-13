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

// 初始化示例数据
function initSampleData() {
  // 新闻数据
  newsStore = [
    {
      id: "1",
      title: "OpenAI 发布 GPT-5 预览版：多模态能力大幅提升",
      summary: "OpenAI 在今日凌晨 surprise 发布了 GPT-5 的预览版本，新模型在代码生成、数学推理和创意写作方面都有显著提升。",
      content: "OpenAI 今日发布了 GPT-5 预览版，这是该公司迄今为止最强大的 AI 模型。新模型在多模态理解、代码生成和复杂推理方面实现了重大突破。据 OpenAI 介绍，GPT-5 在多项基准测试中超越了人类专家水平，特别是在数学、科学和编程领域。模型还支持更长的上下文窗口，最高可达 200 万 tokens。",
      url: "https://openai.com/blog/gpt-5-preview",
      source: "OpenAI Blog",
      sourceUrl: "https://openai.com/blog/gpt-5-preview",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
      category: "大模型",
      tags: ["OpenAI", "GPT-5", "多模态", "AI"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      isHot: true,
      isFeatured: true,
      viewCount: 125000,
    },
    {
      id: "2",
      title: "Anthropic 完成 35 亿美元融资，估值突破 600 亿美元",
      summary: "Anthropic 宣布完成新一轮融资，由 Lightspeed Venture Partners 领投，资金将用于扩大 Claude 的计算能力。",
      url: "https://www.anthropic.com/news/funding",
      source: "TechCrunch",
      sourceUrl: "https://www.anthropic.com/news/funding",
      category: "融资",
      tags: ["Anthropic", "Claude", "融资", "AI"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      isHot: true,
      viewCount: 89000,
    },
    {
      id: "3",
      title: "Google DeepMind 发布 Gemini 2.0：原生多模态，支持实时视频理解",
      summary: "Gemini 2.0 是 Google 最新一代 AI 模型，具备强大的多模态理解和实时交互能力。",
      url: "https://deepmind.google/gemini-2",
      source: "Google Blog",
      sourceUrl: "https://deepmind.google/gemini-2",
      category: "大模型",
      tags: ["Google", "Gemini", "多模态"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      viewCount: 67000,
    },
    {
      id: "4",
      title: "Midjourney V7 发布：图像生成质量再创新高，支持 3D 场景生成",
      summary: "Midjourney V7 带来革命性的图像生成能力，支持 3D 场景和物理模拟。",
      url: "https://www.midjourney.com/v7",
      source: "Midjourney",
      sourceUrl: "https://www.midjourney.com/v7",
      category: "图像生成",
      tags: ["Midjourney", "AI绘画", "3D"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      viewCount: 54000,
    },
    {
      id: "5",
      title: "Meta 开源 Llama 4：400B 参数，性能超越 GPT-4",
      summary: "Meta 发布 Llama 4，这是目前最大的开源语言模型，性能媲美 GPT-4。",
      url: "https://ai.meta.com/llama4",
      source: "Meta AI",
      sourceUrl: "https://ai.meta.com/llama4",
      category: "开源模型",
      tags: ["Meta", "Llama", "开源"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      viewCount: 48000,
    },
  ];

  // 项目数据
  projectsStore = [
    {
      id: "p1",
      name: "Cursor",
      description: "AI 驱动的代码编辑器，基于 VS Code，内置 GPT-4 代码补全和聊天功能。支持智能代码重构、自动补全和自然语言编程。",
      fullDescription: "Cursor 是一款革命性的 AI 代码编辑器，基于 VS Code 构建，深度集成了 GPT-4 等大语言模型。它不仅能提供智能代码补全，还能理解整个代码库的上下文，帮助开发者更高效地编写、理解和重构代码。",
      url: "https://cursor.sh",
      sourceUrl: "https://cursor.sh",
      category: "开发工具",
      tags: ["编程", "IDE", "AI 助手", "VS Code"],
      source: "github",
      stars: 125000,
      language: "TypeScript",
      license: "MIT",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      isTrending: true,
    },
    {
      id: "p2",
      name: "Pika 2.0",
      description: "下一代 AI 视频生成平台，支持文本到视频、图像到视频转换，生成质量接近专业影视级别。",
      fullDescription: "Pika 2.0 是一款先进的 AI 视频生成工具，用户只需输入文字描述或上传图片，即可生成高质量的视频内容。支持多种风格和特效，是内容创作者的强大工具。",
      url: "https://pika.art",
      sourceUrl: "https://pika.art",
      category: "视频生成",
      tags: ["AI 视频", "生成式 AI", "创意工具"],
      source: "producthunt",
      upvotes: 8500,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      isNew: true,
    },
    {
      id: "p3",
      name: "LangChain",
      description: "构建 LLM 应用的框架，支持多种模型和工具链集成，提供完整的 RAG、Agent 开发工具。",
      fullDescription: "LangChain 是一个用于开发由语言模型驱动的应用程序的框架。它提供了一系列组件和工具，帮助开发者构建复杂的 LLM 应用，包括 RAG、Agent、链式调用等。",
      url: "https://langchain.com",
      sourceUrl: "https://github.com/langchain-ai/langchain",
      category: "开发框架",
      tags: ["LLM", "框架", "Python", "开发工具"],
      source: "github",
      stars: 98000,
      forks: 15000,
      language: "Python",
      license: "MIT",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    },
    {
      id: "p4",
      name: "Midjourney Web",
      description: "Midjourney 的 Web 版本，无需 Discord 即可生成图像，支持更友好的用户界面。",
      fullDescription: "Midjourney Web 是 Midjourney 的官方网页版，提供更直观的图像生成界面，支持更精细的参数控制和图像管理功能。",
      url: "https://midjourney.com",
      sourceUrl: "https://midjourney.com",
      category: "图像生成",
      tags: ["AI 绘画", "设计", "创意工具"],
      source: "producthunt",
      upvotes: 12000,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
      isNew: true,
    },
  ];

  // 研究报告数据
  researchStore = [
    {
      id: "r1",
      title: "2026 AI 投资趋势报告：Agent 赛道成为新宠",
      summary: "本报告分析了 2026 年 Q1 AI 领域的投资趋势，AI Agent 赛道融资额同比增长 128%。",
      content: "详细报告内容...",
      category: "投资",
      tags: ["投资", "趋势", "Agent"],
      author: "NewClaw Research",
      readTime: "15 分钟",
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "r2",
      title: "大模型商业化深度分析：从 API 到垂直应用",
      summary: "探讨大模型厂商的商业模式演进，以及垂直领域应用的机会与挑战。",
      content: "详细报告内容...",
      category: "商业化",
      tags: ["大模型", "商业化", "B2B"],
      author: "NewClaw Research",
      readTime: "20 分钟",
      publishedAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: "r3",
      title: "具身智能：下一个万亿级市场",
      summary: "人形机器人与具身智能的技术进展、市场规模预测和投资机会分析。",
      content: "详细报告内容...",
      category: "机器人",
      tags: ["机器人", "具身智能", "硬件"],
      author: "NewClaw Research",
      readTime: "25 分钟",
      publishedAt: new Date(Date.now() - 259200000).toISOString(),
    },
  ];

  // 热搜话题数据
  hotTopicsStore = [
    { id: "ht1", title: "GPT-5 发布", heat: 985000, change: 125, category: "大模型", rank: 1 },
    { id: "ht2", title: "AI Agent 爆发", heat: 756000, change: 89, category: "应用", rank: 2 },
    { id: "ht3", title: "Character.AI 收购", heat: 642000, change: 67, category: "并购", rank: 3 },
    { id: "ht4", title: "H200 芯片", heat: 534000, change: 45, category: "硬件", rank: 4 },
    { id: "ht5", title: "Grok-2 开源", heat: 423000, change: 34, category: "开源", rank: 5 },
    { id: "ht6", title: "具身智能", heat: 389000, change: 78, category: "机器人", rank: 6 },
    { id: "ht7", title: "Sora 商用", heat: 312000, change: 23, category: "视频", rank: 7 },
    { id: "ht8", title: "Midjourney V7", heat: 298000, change: 56, category: "图像", rank: 8 },
    { id: "ht9", title: "AI 编程助手", heat: 276000, change: 12, category: "工具", rank: 9 },
    { id: "ht10", title: "多模态模型", heat: 234000, change: 28, category: "技术", rank: 10 },
  ];

  // 融资数据
  fundingStore = [
    {
      id: "f1",
      companyName: "Anthropic",
      amount: "35亿美元",
      round: "E轮",
      date: "2026-02-12",
      investors: ["Lightspeed", "Amazon", "Google"],
      category: "大模型",
      description: "Claude 开发商，专注于 AI 安全和对齐研究",
    },
    {
      id: "f2",
      companyName: "Character.AI",
      amount: "25亿美元",
      round: "收购",
      date: "2026-02-10",
      investors: ["Google"],
      category: "AI 对话",
      description: "AI 角色扮演和对话平台，拥有超过 2000 万用户",
    },
    {
      id: "f3",
      companyName: "Perplexity",
      amount: "5亿美元",
      round: "C轮",
      date: "2026-02-08",
      investors: ["IVP", "NEA", "NVIDIA"],
      category: "AI 搜索",
      description: "AI 驱动的搜索引擎，月活用户突破 5000 万",
    },
    {
      id: "f4",
      companyName: "Figure AI",
      amount: "6.75亿美元",
      round: "B轮",
      date: "2026-02-05",
      investors: ["Microsoft", "OpenAI", "NVIDIA"],
      category: "机器人",
      description: "人形机器人公司，专注于具身智能研究",
    },
  ];

  // Twitter 推文数据
  tweetsStore = [
    {
      id: "t1",
      content: "GPT-5 的推理能力简直令人惊叹。刚刚测试了它在复杂数学问题上的表现，准确率比 GPT-4 提升了 40% 以上。AI 的发展速度真的超出了所有人的预期。",
      author: {
        name: "Andrej Karpathy",
        username: "karpathy",
        verified: true,
      },
      publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      likes: 15420,
      retweets: 3421,
      replies: 892,
      views: 456000,
      hashtags: ["AI", "GPT5", "OpenAI"],
      mentions: [],
      urls: [],
      isHot: true,
      sentiment: "positive",
    },
    {
      id: "t2",
      content: "刚刚体验了 Claude 3.5 的新功能，代码生成质量有了质的飞跃。特别是对于复杂架构设计，它的理解能力让我印象深刻。",
      author: {
        name: "吴恩达",
        username: "AndrewYNg",
        verified: true,
      },
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      likes: 12300,
      retweets: 2800,
      replies: 650,
      views: 320000,
      hashtags: ["Claude", "AI", "Coding"],
      mentions: [],
      urls: [],
      isHot: true,
      sentiment: "positive",
    },
    {
      id: "t3",
      content: "AI Agent 赛道今年融资额已经突破 50 亿美元。从自主浏览器到编程助手，这个领域的创新速度令人瞩目。",
      author: {
        name: "Elad Gil",
        username: "eladgil",
        verified: true,
      },
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      likes: 8900,
      retweets: 2100,
      replies: 420,
      views: 280000,
      hashtags: ["AIAgent", "VentureCapital", "Startup"],
      mentions: [],
      urls: [],
      isHot: false,
      sentiment: "positive",
    },
    {
      id: "t4",
      content: "具身智能的突破正在加速。Figure AI 的最新演示显示，他们的机器人已经能够完成复杂的装配任务。这比我们预期的要快得多。",
      author: {
        name: "李飞飞",
        username: "drfeifei",
        verified: true,
      },
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      likes: 15600,
      retweets: 3800,
      replies: 920,
      views: 520000,
      hashtags: ["Robotics", "EmbodiedAI", "FigureAI"],
      mentions: [],
      urls: [],
      isHot: true,
      sentiment: "positive",
    },
    {
      id: "t5",
      content: "Midjourney V7 的 3D 场景生成能力让我震惊。输入一段文字描述，几秒钟就能生成可用于游戏开发的 3D 场景。创意产业的变革正在加速。",
      author: {
        name: "Sam Altman",
        username: "sama",
        verified: true,
      },
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      likes: 22100,
      retweets: 5600,
      replies: 1200,
      views: 780000,
      hashtags: ["Midjourney", "AI", "3D"],
      mentions: [],
      urls: [],
      isHot: true,
      sentiment: "positive",
    },
    {
      id: "t6",
      content: "开源模型正在迎头赶上。Llama 4 的性能在某些基准测试上已经超过了 GPT-4，这对于整个 AI 生态系统来说是一个巨大的胜利。",
      author: {
        name: "Yann LeCun",
        username: "ylecun",
        verified: true,
      },
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      likes: 18900,
      retweets: 4300,
      replies: 1100,
      views: 650000,
      hashtags: ["Llama", "OpenSource", "AI"],
      mentions: [],
      urls: [],
      isHot: false,
      sentiment: "positive",
    },
  ];

  // Twitter 趋势数据
  twitterTrendsStore = [
    { id: "tt1", name: "GPT-5", query: "GPT-5", tweetVolume: 985000, rank: 1, category: "AI模型" },
    { id: "tt2", name: "AI Agent", query: "AIAgent", tweetVolume: 756000, rank: 2, category: "应用" },
    { id: "tt3", name: "Claude 3.5", query: "Claude", tweetVolume: 642000, rank: 3, category: "AI模型" },
    { id: "tt4", name: "具身智能", query: "EmbodiedAI", tweetVolume: 534000, rank: 4, category: "机器人" },
    { id: "tt5", name: "Midjourney V7", query: "Midjourney", tweetVolume: 423000, rank: 5, category: "图像生成" },
    { id: "tt6", name: "Sora", query: "Sora", tweetVolume: 389000, rank: 6, category: "视频生成" },
    { id: "tt7", name: "Llama 4", query: "Llama4", tweetVolume: 312000, rank: 7, category: "开源" },
    { id: "tt8", name: "AI编程", query: "AICoding", tweetVolume: 298000, rank: 8, category: "开发工具" },
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
