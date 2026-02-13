import { Flame, Clock, Calendar, TrendingUp } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewsCard } from "@/components/news-card";
import { HotTopicsList } from "@/components/hot-topics-list";

const hotNews24h = [
  {
    id: "h1",
    title: "GPT-5 发布引发全球 AI 圈震动，各大厂商紧急应对",
    summary: "OpenAI 凌晨发布 GPT-5，在多项基准测试中超越人类专家水平，Google、Anthropic 等竞争对手股价大幅波动。",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
    source: "TechCrunch",
    publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    category: "大模型",
    isHot: true,
    viewCount: 125000,
  },
  {
    id: "h2",
    title: "Character.AI 被 Google 收购，创始人加入 DeepMind",
    summary: "这笔 25 亿美元的交易标志着 AI 对话领域的重大整合，Noam Shazeer 将领导 Google 的对话 AI 团队。",
    source: "The Information",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    category: "并购",
    isHot: true,
    viewCount: 89000,
  },
  {
    id: "h3",
    title: "NVIDIA H200 芯片发布，推理性能提升 90%",
    source: "NVIDIA Blog",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    category: "硬件",
    viewCount: 67000,
  },
  {
    id: "h4",
    title: "Midjourney V7 发布：支持 3D 场景和物理模拟",
    source: "Midjourney",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    category: "图像生成",
    viewCount: 54000,
  },
  {
    id: "h5",
    title: "xAI 开源 Grok-2，性能超越 Llama 3",
    source: "xAI",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    category: "开源模型",
    viewCount: 48000,
  },
];

const hotNews7d = [
  {
    id: "w1",
    title: "AI Agent 赛道爆发：单月融资超 50 亿美元",
    summary: "从自主浏览器到编程助手，AI Agent 成为 2026 年最热门的投资赛道。",
    source: "VentureBeat",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    category: "投资",
    viewCount: 156000,
  },
  {
    id: "w2",
    title: "具身智能突破：Figure AI 机器人学会自主装配",
    source: "Figure AI",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    category: "机器人",
    viewCount: 134000,
  },
  {
    id: "w3",
    title: "Sora 正式开放：OpenAI 视频生成进入商用阶段",
    source: "OpenAI",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    category: "视频生成",
    viewCount: 198000,
  },
];

const hotTopics = [
  { rank: 1, title: "GPT-5 发布", heat: 985000, change: 125, category: "大模型" },
  { rank: 2, title: "AI Agent 爆发", heat: 756000, change: 89, category: "应用" },
  { rank: 3, title: "Character.AI 收购", heat: 642000, change: 67, category: "并购" },
  { rank: 4, title: "H200 芯片", heat: 534000, change: 45, category: "硬件" },
  { rank: 5, title: "Grok-2 开源", heat: 423000, change: 34, category: "开源" },
  { rank: 6, title: "具身智能", heat: 389000, change: 78, category: "机器人" },
  { rank: 7, title: "Sora 商用", heat: 312000, change: 23, category: "视频" },
  { rank: 8, title: "Midjourney V7", heat: 298000, change: 56, category: "图像" },
  { rank: 9, title: "AI 编程助手", heat: 276000, change: 12, category: "工具" },
  { rank: 10, title: "多模态模型", heat: 234000, change: 28, category: "技术" },
];

export default function HotPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-orange-500/10">
            <Flame className="w-8 h-8 text-orange-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">热点追踪</h1>
            <p className="text-muted-foreground">实时追踪 AI 行业最热话题和趋势</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <div className="flex items-center justify-between mb-6">
                <Tabs defaultValue="24h">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="24h" className="gap-2">
                      <Clock className="w-4 h-4" /
                      24小时
                    </TabsTrigger>
                    <TabsTrigger value="7d" className="gap-2">
                      <Calendar className="w-4 h-4" /
                      7天
                    </TabsTrigger>
                    <TabsTrigger value="30d" className="gap-2">
                      <TrendingUp className="w-4 h-4" /
                      30天
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="space-y-4">
                {hotNews24h.map((news) => (
                  <NewsCard key={news.id} {...news} />
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="p-6 rounded-xl bg-card border">
              <div className="flex items-center gap-2 mb-6">
                <Flame className="w-5 h-5 text-orange-500" />
                <h2 className="text-xl font-bold">热搜榜单</h2>
              </div>

              <HotTopicsList topics={hotTopics} />
            </section>

            <section className="p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20">
              <h3 className="font-bold mb-2">🔥 实时热度监控</h3>
              <p className="text-sm text-muted-foreground mb-4">
                基于全网社交媒体、搜索引擎和新闻媒体的实时数据分析
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">数据来源</span>
                  <span className="text-sm font-medium">12+ 平台</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">更新频率</span>
                  <span className="text-sm font-medium">每 5 分钟</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">覆盖话题</span>
                  <span className="text-sm font-medium">50,000+</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
