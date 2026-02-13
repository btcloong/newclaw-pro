import { Suspense } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  Clock, 
  Flame, 
  Sparkles, 
  ChevronRight,
  Zap,
  Lightbulb,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewsCard } from "@/components/news-card";
import { FlashNewsItem } from "@/components/flash-news-item";
import { ProjectCard } from "@/components/project-card";
import { HotTopicsList } from "@/components/hot-topics-list";
import { TrendingTags } from "@/components/trending-tags";
import { StatsCard } from "@/components/stats-card";

// Mock data for demonstration
const featuredNews = {
  id: "1",
  title: "OpenAI 发布 GPT-5 预览版：多模态能力大幅提升，推理能力接近人类水平",
  summary: "OpenAI 在今日凌晨 surprise 发布了 GPT-5 的预览版本，新模型在代码生成、数学推理和创意写作方面都有显著提升。",
  image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
  source: "TechCrunch",
  publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  category: "大模型",
  isHot: true,
  isFeatured: true,
};

const newsList = [
  {
    id: "2",
    title: "Anthropic 完成 35 亿美元融资，估值突破 600 亿美元",
    summary: "Anthropic 宣布完成新一轮融资，由 Lightspeed Venture Partners 领投，资金将用于扩大 Claude 的计算能力。",
    source: "The Information",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    category: "融资",
    isHot: true,
  },
  {
    id: "3",
    title: "Google DeepMind 发布 Gemini 2.0：原生多模态，支持实时视频理解",
    source: "Google Blog",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    category: "大模型",
  },
  {
    id: "4",
    title: "Midjourney V7 发布：图像生成质量再创新高，支持 3D 场景生成",
    source: "Midjourney",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    category: "图像生成",
  },
  {
    id: "5",
    title: "Meta 开源 Llama 4：400B 参数，性能超越 GPT-4",
    source: "Meta AI",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    category: "开源模型",
  },
];

const flashNews = [
  {
    id: "f1",
    title: "马斯克：xAI 将在下周开源 Grok-2 模型权重",
    publishedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    isImportant: true,
  },
  {
    id: "f2",
    title: "Stability AI 发布 Stable Diffusion 3.5，生成速度提升 3 倍",
    publishedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: "f3",
    title: "NVIDIA 发布 H200 GPU，专为 AI 训练和推理优化",
    publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    isImportant: true,
  },
  {
    id: "f4",
    title: "Character.AI 被 Google 以 25 亿美元收购",
    publishedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "f5",
    title: "Perplexity 推出 Pages 功能，可将搜索结果转为结构化文章",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
];

const hotTopics = [
  { rank: 1, title: "GPT-5 发布", heat: 985000, change: 125, category: "大模型" },
  { rank: 2, title: "AI Agent", heat: 756000, change: 45, category: "应用" },
  { rank: 3, title: "Sora 视频生成", heat: 642000, change: -12, category: "视频" },
  { rank: 4, title: "Claude 3.5", heat: 534000, change: 23, category: "大模型" },
  { rank: 5, title: "AI 编程助手", heat: 423000, change: 67, category: "工具" },
  { rank: 6, title: "具身智能", heat: 389000, change: 89, category: "机器人" },
  { rank: 7, title: "AI 芯片", heat: 312000, change: 15, category: "硬件" },
  { rank: 8, title: "多模态模型", heat: 298000, change: 34, category: "技术" },
];

const trendingTags = [
  { name: "GPT-5", count: 12500, trend: "up" as const },
  { name: "Claude", count: 8900, trend: "up" as const },
  { name: "AI Agent", count: 7600, trend: "up" as const },
  { name: "开源模型", count: 5400, trend: "neutral" as const },
  { name: "视频生成", count: 4800, trend: "down" as const },
  { name: "具身智能", count: 4200, trend: "up" as const },
  { name: "AI 编程", count: 3800, trend: "up" as const },
  { name: "多模态", count: 3200, trend: "neutral" as const },
];

const newProjects = [
  {
    id: "p1",
    name: "Cursor",
    description: "AI 驱动的代码编辑器，基于 VS Code，内置 GPT-4 代码补全和聊天功能",
    category: "开发工具",
    tags: ["编程", "IDE", "AI 助手"],
    stars: 125000,
    source: "github" as const,
    url: "https://cursor.sh",
    isTrending: true,
  },
  {
    id: "p2",
    name: "Pika 2.0",
    description: "下一代 AI 视频生成平台，支持文本到视频、图像到视频转换",
    category: "视频生成",
    tags: ["AI 视频", "生成式 AI"],
    upvotes: 8500,
    source: "producthunt" as const,
    url: "https://pika.art",
    isNew: true,
  },
  {
    id: "p3",
    name: "LangChain",
    description: "构建 LLM 应用的框架，支持多种模型和工具链集成",
    category: "开发框架",
    tags: ["LLM", "框架", "Python"],
    stars: 98000,
    forks: 15000,
    source: "github" as const,
    url: "https://langchain.com",
  },
  {
    id: "p4",
    name: "Midjourney Web",
    description: "Midjourney 的 Web 版本，无需 Discord 即可生成图像",
    category: "图像生成",
    tags: ["AI 绘画", "设计"],
    upvotes: 12000,
    source: "producthunt" as const,
    url: "https://midjourney.com",
    isNew: true,
  },
];

const stats = [
  { title: "今日新闻", value: "1,247", change: 12.5, icon: <Zap className="w-5 h-5" /> },
  { title: "热门项目", value: "86", change: 8.3, icon: <Target className="w-5 h-5" /> },
  { title: "创意灵感", value: "234", change: 23.1, icon: <Lightbulb className="w-5 h-5" /> },
  { title: "融资动态", value: "12", change: -5.2, icon: <TrendingUp className="w-5 h-5" /> },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Stats */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <StatsCard key={stat.title} {...stat} />
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured News */}
            <section>
              <NewsCard {...featuredNews} />
            </section>

            {/* News Tabs */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-brand-500" />
                  <h2 className="text-xl font-bold">最新资讯</h2>
                </div>
                <Tabs defaultValue="all">
                  <TabsList>
                    <TabsTrigger value="all">全部</TabsTrigger>
                    <TabsTrigger value="news">新闻</TabsTrigger>
                    <TabsTrigger value="twitter">推特</TabsTrigger>
                    <TabsTrigger value="github">GitHub</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="space-y-4">
                {newsList.map((news) => (
                  <NewsCard key={news.id} {...news} />
                ))}
              </div>

              <div className="mt-6 text-center">
                <Button variant="outline" className="gap-2">
                  查看更多
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </section>

            {/* New Projects */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-500" />
                  <h2 className="text-xl font-bold">新项目发现</h2>
                </div>
                <Link 
                  href="/projects" 
                  className="text-sm text-brand-500 hover:underline flex items-center gap-1"
                >
                  全部项目
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {newProjects.map((project) => (
                  <ProjectCard key={project.id} {...project} />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Flash News */}
            <section className="p-5 rounded-xl bg-card border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-brand-500" />
                  <h3 className="font-bold">快讯</h3>
                </div>
                <Link href="/flash" className="text-sm text-brand-500 hover:underline">
                  更多
                </Link>
              </div>

              <div className="space-y-0">
                {flashNews.map((news) => (
                  <FlashNewsItem key={news.id} {...news} />
                ))}
              </div>
            </section>

            {/* Hot Topics */}
            <section className="p-5 rounded-xl bg-card border">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold">热搜榜单</h3>
              </div>

              <HotTopicsList topics={hotTopics} />
            </section>

            {/* Trending Tags */}
            <section className="p-5 rounded-xl bg-card border">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <h3 className="font-bold">热门标签</h3>
              </div>

              <TrendingTags tags={trendingTags} />
            </section>

            {/* Newsletter */}
            <section className="p-5 rounded-xl bg-gradient-to-br from-brand-500/10 to-brand-700/10 border border-brand-500/20">
              <h3 className="font-bold mb-2">订阅 AI 日报</h3>
              <p className="text-sm text-muted-foreground mb-4">
                每日精选 AI 行业重要资讯，直接发送到您的邮箱
              </p>
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="输入邮箱地址"
                  className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
                />
                <Button className="w-full">立即订阅</Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
