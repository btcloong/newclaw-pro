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
  url: string;
  logo?: string;
  category: string;
  tags: string[];
  source: "github" | "producthunt" | "other";
  stars?: number;
  forks?: number;
  upvotes?: number;
  createdAt: string;
  isNew?: boolean;
  isTrending?: boolean;
}

// 内存存储
let newsStore: NewsItem[] = [];
let projectsStore: Project[] = [];
let lastCrawlTime: string | null = null;

// 初始化示例数据
function initSampleData() {
  newsStore = [
    {
      id: "1",
      title: "OpenAI 发布 GPT-5 预览版：多模态能力大幅提升",
      summary: "OpenAI 在今日凌晨 surprise 发布了 GPT-5 的预览版本，新模型在代码生成、数学推理和创意写作方面都有显著提升。",
      content: "OpenAI 今日发布了 GPT-5 预览版，这是该公司迄今为止最强大的 AI 模型。新模型在多模态理解、代码生成和复杂推理方面实现了重大突破。\n\n据 OpenAI 介绍，GPT-5 在多项基准测试中超越了人类专家水平，特别是在数学、科学和编程领域。模型还支持更长的上下文窗口，最高可达 200 万 tokens。\n\nGPT-5 的主要特性包括：\n- 原生多模态：支持文本、图像、音频和视频输入\n- 增强推理：在复杂逻辑和数学问题上表现更优\n- 代码能力：支持 100+ 编程语言，代码生成准确率提升 40%\n- 安全性：内置更完善的安全对齐机制",
      url: "https://openai.com/blog/gpt-5-preview",
      source: "OpenAI Blog",
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
      category: "开源模型",
      tags: ["Meta", "Llama", "开源"],
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      viewCount: 48000,
    },
  ];

  projectsStore = [
    {
      id: "p1",
      name: "Cursor",
      description: "AI 驱动的代码编辑器，基于 VS Code，内置 GPT-4 代码补全和聊天功能。支持智能代码重构、自动补全和自然语言编程。",
      url: "https://cursor.sh",
      category: "开发工具",
      tags: ["编程", "IDE", "AI 助手", "VS Code"],
      source: "github",
      stars: 125000,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      isTrending: true,
    },
    {
      id: "p2",
      name: "Pika 2.0",
      description: "下一代 AI 视频生成平台，支持文本到视频、图像到视频转换，生成质量接近专业影视级别。",
      url: "https://pika.art",
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
      url: "https://langchain.com",
      category: "开发框架",
      tags: ["LLM", "框架", "Python", "开发工具"],
      source: "github",
      stars: 98000,
      forks: 15000,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    },
    {
      id: "p4",
      name: "Midjourney Web",
      description: "Midjourney 的 Web 版本，无需 Discord 即可生成图像，支持更友好的用户界面。",
      url: "https://midjourney.com",
      category: "图像生成",
      tags: ["AI 绘画", "设计", "创意工具"],
      source: "producthunt",
      upvotes: 12000,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
      isNew: true,
    },
  ];

  lastCrawlTime = new Date().toISOString();
}

// 确保数据已初始化
initSampleData();

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
      
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      const limit = options?.limit || result.length;
      return result.slice(0, limit);
    },
    findById: (id: string) => projectsStore.find(p => p.id === id),
    count: () => projectsStore.length,
  },
  getStats: () => ({
    newsCount: newsStore.length,
    projectsCount: projectsStore.length,
    lastCrawlTime,
  }),
  // 重新初始化数据（模拟抓取）
  recrawl: () => {
    initSampleData();
    return { success: true, timestamp: lastCrawlTime };
  },
};
