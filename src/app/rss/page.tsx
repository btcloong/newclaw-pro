"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rss, Copy, ExternalLink, Bell, Mail, MessageCircle, Github } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RssPage() {
  const feeds = [
    {
      title: "全部新闻",
      description: "获取所有 AI 新闻，包括热门和最新资讯",
      url: "https://newclaw.com/rss/news.xml",
      icon: Rss,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "热门新闻",
      description: "仅获取评分 8.5 以上的热门 AI 新闻",
      url: "https://newclaw.com/rss/hot.xml",
      icon: Bell,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      title: "投研报告",
      description: "获取最新的 AI 投研分析报告",
      url: "https://newclaw.com/rss/research.xml",
      icon: ExternalLink,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Twitter 精选",
      description: "AI 领域 Twitter 大咖的精选推文",
      url: "https://newclaw.com/rss/twitter.xml",
      icon: MessageCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  const readers = [
    { name: "Feedly", url: "https://feedly.com" },
    { name: "Inoreader", url: "https://www.inoreader.com" },
    { name: "Reeder", url: "https://reederapp.com" },
    { name: "NetNewsWire", url: "https://netnewswire.com" },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b bg-gradient-to-br from-orange-500/5 via-background to-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-600 mb-6">
              <Rss className="w-4 h-4" />
              <span className="text-sm font-medium">RSS 订阅</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              订阅 NewClaw 更新
            </h1>
            <p className="text-lg text-muted-foreground">
              通过 RSS 获取最新的 AI 新闻、投研报告和热点追踪
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* RSS Feeds */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {feeds.map((feed) => (
              <Card key={feed.title} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${feed.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <feed.icon className={`w-6 h-6 ${feed.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold mb-1">{feed.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {feed.description}
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2"
                          onClick={() => {
                            navigator.clipboard.writeText(feed.url);
                          }}
                        >
                          <Copy className="w-4 h-4" />
                          复制链接
                        </Button>
                        <Link href={feed.url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="gap-2">
                            <ExternalLink className="w-4 h-4" />
                            查看
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* How to Subscribe */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>如何订阅</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    step: "1",
                    title: "选择阅读器",
                    description: "选择一个 RSS 阅读器应用或网站",
                  },
                  {
                    step: "2",
                    title: "复制订阅链接",
                    description: "点击上方卡片中的复制链接按钮",
                  },
                  {
                    step: "3",
                    title: "添加订阅",
                    description: "在阅读器中添加新的 RSS 源，粘贴链接",
                  },
                ].map((item) => (
                  <div key={item.step} className="text-center">
                    <div className="w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold mx-auto mb-3">
                      {item.step}
                    </div>
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommended Readers */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>推荐的 RSS 阅读器</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {readers.map((reader) => (
                  <Link 
                    key={reader.name}
                    href={reader.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <span className="font-medium">{reader.name}</span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* JSON Feed */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>JSON Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                我们也提供 JSON Feed 格式，方便开发者集成：
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "全部新闻", url: "https://newclaw.com/api/news" },
                  { label: "Twitter", url: "https://newclaw.com/api/twitter" },
                  { label: "热点", url: "https://newclaw.com/api/trends" },
                ].map((api) => (
                  <Link 
                    key={api.label}
                    href={api.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="gap-2">
                      <Github className="w-4 h-4" />
                      {api.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Email Newsletter */}
          <Card className="bg-gradient-to-br from-brand-500/10 to-blue-500/10">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-brand-500/20 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-brand-500" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold mb-2">更喜欢邮件订阅？</h3>
                  <p className="text-muted-foreground">
                    订阅我们的 AI 日报，每日精选重要资讯直接发送到您的邮箱
                  </p>
                </div>
                <Link href="/">
                  <Button className="gap-2">
                    <Bell className="w-4 h-4" />
                    立即订阅
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
