"use client";

import { useEffect, useState } from "react";
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
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewsCard } from "@/components/news-card";
import { FlashNewsItem } from "@/components/flash-news-item";
import { ProjectCard } from "@/components/project-card";
import { HotTopicsList } from "@/components/hot-topics-list";
import { TrendingTags } from "@/components/trending-tags";
import { StatsCard } from "@/components/stats-card";

interface News {
  id: string;
  title: string;
  summary: string | null;
  image: string | null;
  source: string;
  publishedAt: string;
  category: string | null;
  isHot: boolean | null;
  isFeatured: boolean | null;
  viewCount: number | null;
}

interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string | null;
  stars: number | null;
  forks: number | null;
  upvotes: number | null;
  source: string;
  sourceUrl: string;
  isNew: boolean | null;
  isTrending: boolean | null;
}

interface HotTopic {
  rank: number;
  title: string;
  heat: number;
  change: number;
  category: string | null;
}

export default function HomePage() {
  const [news, setNews] = useState<News[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [hotTopics, setHotTopics] = useState<HotTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // 并行获取数据
        const [newsRes, projectsRes, topicsRes] = await Promise.all([
          fetch("/api/news?limit=10"),
          fetch("/api/projects?limit=8"),
          fetch("/api/hot-topics"),
        ]);

        const newsData = await newsRes.json();
        const projectsData = await projectsRes.json();
        const topicsData = await topicsRes.json();

        if (newsData.success) setNews(newsData.data);
        if (projectsData.success) setProjects(projectsData.data);
        if (topicsData.success) setHotTopics(topicsData.data);

        setError(null);
      } catch (err) {
        setError("数据加载失败，请稍后重试");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const featuredNews = news.find(n => n.isFeatured) || news[0];
  const newsList = news.filter(n => n.id !== featuredNews?.id).slice(0, 5);
  
  const stats = [
    { title: "今日新闻", value: news.length.toString(), change: 12.5, icon: <Zap className="w-5 h-5" /> },
    { title: "热门项目", value: projects.length.toString(), change: 8.3, icon: <Target className="w-5 h-5" /> },
    { title: "创意灵感", value: "234", change: 23.1, icon: <Lightbulb className="w-5 h-5" /> },
    { title: "融资动态", value: "12", change: -5.2, icon: <TrendingUp className="w-5 h-5" /> },
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

  const flashNews = [
    {
      id: "f1",
      title: "AI 行业动态持续更新中...",
      publishedAt: new Date().toISOString(),
      isImportant: true,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()}>重试</Button>
        </div>
      </div>
    );
  }

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
            {featuredNews && (
              <section>
                <NewsCard {...featuredNews} isFeatured={true} />
              </section>
            )}

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
                {newsList.length > 0 ? (
                  newsList.map((item) => (
                    <NewsCard key={item.id} {...item} />
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    暂无新闻数据
                  </p>
                )}
              </div>

              <div className="mt-6 text-center">
                <Button variant="outline" className="gap-2" asChild>
                  <Link href="/hot">
                    查看更多
                    <ChevronRight className="w-4 h-4" />
                  </Link>
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
                {projects.length > 0 ? (
                  projects.slice(0, 4).map((project) => (
                    <ProjectCard 
                      key={project.id} 
                      {...project}
                      id={project.id}
                      tags={Array.isArray(project.tags) ? project.tags : []}
                    />
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8 col-span-2">
                    暂无项目数据
                  </p>
                )}
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
                {flashNews.map((item) => (
                  <FlashNewsItem key={item.id} {...item} />
                ))}
              </div>
            </section>

            {/* Hot Topics */}
            <section className="p-5 rounded-xl bg-card border">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold">热搜榜单</h3>
              </div>

              {hotTopics.length > 0 ? (
                <HotTopicsList topics={hotTopics} />
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  暂无热搜数据
                </p>
              )}
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
