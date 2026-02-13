import Link from "next/link";
import { 
  TrendingUp, 
  Clock, 
  Flame, 
  Sparkles, 
  ChevronRight,
  Zap,
  Lightbulb,
  Target,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// 静态数据
const news = [
  {
    id: "1",
    title: "OpenAI 发布 GPT-5 预览版：多模态能力大幅提升",
    summary: "OpenAI 在今日凌晨 surprise 发布了 GPT-5 的预览版本，新模型在代码生成、数学推理和创意写作方面都有显著提升。",
    source: "OpenAI Blog",
    category: "大模型",
    isHot: true,
    isFeatured: true,
    viewCount: 125000,
  },
  {
    id: "2",
    title: "Anthropic 完成 35 亿美元融资，估值突破 600 亿美元",
    source: "TechCrunch",
    category: "融资",
    isHot: true,
    viewCount: 89000,
  },
  {
    id: "3",
    title: "Google DeepMind 发布 Gemini 2.0：原生多模态",
    source: "Google Blog",
    category: "大模型",
    viewCount: 67000,
  },
];

const projects = [
  {
    id: "p1",
    name: "Cursor",
    description: "AI 驱动的代码编辑器，基于 VS Code，内置 GPT-4 代码补全和聊天功能",
    category: "开发工具",
    source: "github",
    stars: 125000,
    url: "https://cursor.sh",
  },
  {
    id: "p2",
    name: "Pika 2.0",
    description: "下一代 AI 视频生成平台，支持文本到视频、图像到视频转换",
    category: "视频生成",
    source: "producthunt",
    upvotes: 8500,
    url: "https://pika.art",
  },
];

const hotTopics = [
  { rank: 1, title: "GPT-5 发布", heat: 985000, change: 125 },
  { rank: 2, title: "AI Agent 爆发", heat: 756000, change: 89 },
  { rank: 3, title: "具身智能", heat: 642000, change: 67 },
];

export default function HomePage() {
  const featuredNews = news[0];
  const newsList = news.slice(1);

  return (
    <div className="min-h-screen">
      {/* Stats */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "今日新闻", value: "1,247", icon: Zap },
              { title: "热门项目", value: "86", icon: Target },
              { title: "创意灵感", value: "234", icon: Lightbulb },
              { title: "融资动态", value: "12", icon: TrendingUp },
            ].map((stat) => (
              <Card key={stat.title}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <stat.icon className="w-5 h-5 text-brand-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured News */}
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-brand-500/20 to-brand-700/20 flex items-center justify-center">
                <span className="text-6xl font-bold text-brand-500/30">N</span>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  {featuredNews.isHot && <Badge variant="destructive">热门</Badge>}
                  <Badge variant="secondary">{featuredNews.category}</Badge>
                </div>
                <h2 className="text-2xl font-bold mb-3">{featuredNews.title}</h2>
                <p className="text-muted-foreground mb-4">{featuredNews.summary}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{featuredNews.source}</span>
                  <span>{featuredNews.viewCount} 阅读</span>
                </div>
              </CardContent>
            </Card>

            {/* News List */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-brand-500" />
                <h2 className="text-xl font-bold">最新资讯</h2>
              </div>

              <div className="space-y-4">
                {newsList.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {item.isHot && <Badge variant="destructive" className="text-xs">热门</Badge>}
                        <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                      </div>
                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{item.source}</span>
                        <span>{item.viewCount} 阅读</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Projects */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-500" />
                  <h2 className="text-xl font-bold">新项目发现</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{project.name}</h3>
                        <a 
                          href={project.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-brand-500"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">{project.category}</Badge>
                        {project.stars && <span className="text-xs text-muted-foreground">⭐ {project.stars}</span>}
                        {project.upvotes && <span className="text-xs text-muted-foreground">👍 {project.upvotes}</span>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Hot Topics */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <CardTitle className="text-lg">热搜榜单</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {hotTopics.map((topic) => (
                    <div key={topic.rank} className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded flex items-center justify-center text-sm font-bold ${
                        topic.rank <= 3 ? 'bg-brand-500 text-white' : 'bg-muted text-muted-foreground'
                      }`}>
                        {topic.rank}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{topic.title}</p>
                        <p className="text-xs text-muted-foreground">{topic.heat.toLocaleString()} 热度</p>
                      </div>
                      <span className={`text-xs ${topic.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {topic.change > 0 ? '+' : ''}{topic.change}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter */}
            <Card className="bg-gradient-to-br from-brand-500/10 to-brand-700/10">
              <CardContent className="p-5">
                <h3 className="font-bold mb-2">订阅 AI 日报</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  每日精选 AI 行业重要资讯
                </p>
                <input
                  type="email"
                  placeholder="输入邮箱地址"
                  className="w-full px-3 py-2 rounded-lg border bg-background text-sm mb-2"
                />
                <Button className="w-full">立即订阅</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
