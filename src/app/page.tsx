import Link from "next/link";
import { 
  TrendingUp, 
  Clock, 
  Flame, 
  Sparkles, 
  Zap,
  Lightbulb,
  Target,
  ExternalLink,
  Twitter,
  MessageCircle,
  Heart,
  Repeat2,
  Hash,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { formatNumber, formatDate } from "@/lib/utils";

export default async function HomePage() {
  // 从数据库获取数据
  const news = await db.news.findAll({ limit: 5 });
  const projects = await db.projects.findAll({ limit: 4 });
  const hotTopics = await db.hotTopics.findAll();
  const tweets = await db.tweets.findAll({ limit: 3 });
  const twitterTrends = await db.twitterTrends.findAll();
  const stats = await db.getStats();

  const featuredNews = news[0];
  const newsList = news.slice(1);

  return (
    <div className="min-h-screen">
      {/* Stats */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { title: "今日新闻", value: stats.newsCount.toString(), icon: Zap },
              { title: "热门项目", value: stats.projectsCount.toString(), icon: Target },
              { title: "推特动态", value: stats.tweetsCount.toString(), icon: Twitter },
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
            {/* Hero Banner */}
            <Card className="overflow-hidden relative">
              <div 
                className="aspect-[21/9] bg-cover bg-center relative"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1920&q=80')`,
                }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12">
                  <div className="max-w-xl">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                      New Claw
                      <br />
                      <span className="text-brand-400">New World</span>
                    </h1>
                    <p className="text-white/80 text-sm md:text-base mb-6">
                      探索 AI 的无限可能，发现下一个改变世界的机会
                    </p>
                    <div className="flex gap-3">
                      <Link href="http://t.me/newclaw" target="_blank" rel="noopener noreferrer">
                        <Button className="bg-brand-500 hover:bg-brand-600 text-white">
                          加入社区
                        </Button>
                      </Link>
                      <Link href="/hot">
                        <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                          探索热点
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Featured News */}
            {featuredNews && (
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {featuredNews.isHot && <Badge variant="destructive">热门</Badge>}
                    <Badge variant="secondary">{featuredNews.category}</Badge>
                  </div>
                  <Link href={`/news/${featuredNews.id}`}>
                    <h2 className="text-2xl font-bold mb-3 hover:text-brand-500 transition-colors">{featuredNews.title}</h2>
                  </Link>
                  <p className="text-muted-foreground mb-4">{featuredNews.summary}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{featuredNews.source}</span>
                    <span>{featuredNews.viewCount?.toLocaleString()} 阅读</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* News List */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-brand-500" />
                  <h2 className="text-xl font-bold">最新资讯</h2>
                </div>
                <Link href="/hot" className="text-sm text-brand-500 hover:underline">
                  查看全部
                </Link>
              </div>

              <div className="space-y-4">
                {newsList.map((item) => (
                  <Link key={item.id} href={`/news/${item.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          {item.isHot && <Badge variant="destructive" className="text-xs">热门</Badge>}
                          <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                        </div>
                        <h3 className="font-semibold mb-2">{item.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{item.source}</span>
                          <span>{formatDate(item.publishedAt)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
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
                  <Link key={project.id} href={`/project/${project.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold">{project.name}</h3>
                          <Link 
                            href={project.url}
                            className="text-muted-foreground hover:text-brand-500"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">{project.category}</Badge>
                          {project.stars && <span className="text-xs text-muted-foreground">⭐ {formatNumber(project.stars)}</span>}
                          {project.upvotes && <span className="text-xs text-muted-foreground">👍 {formatNumber(project.upvotes)}</span>}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>

            {/* Twitter Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Twitter className="w-5 h-5 text-blue-500" />
                  <h2 className="text-xl font-bold">Twitter AI 动态</h2>
                </div>
                <Link href="/twitter" className="text-sm text-blue-500 hover:underline">
                  查看全部
                </Link>
              </div>

              <div className="space-y-4">
                {tweets.map((tweet) => (
                  <Card key={tweet.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">{tweet.author.name.charAt(0)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold truncate">{tweet.author.name}</span>
                            {tweet.author.verified && <span className="text-blue-500 text-xs">✓</span>}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            @{tweet.author.username} • {formatDate(tweet.publishedAt)}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-foreground mb-3 line-clamp-3">{tweet.content}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{formatNumber(tweet.replies)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Repeat2 className="w-4 h-4" />
                          <span>{formatNumber(tweet.retweets)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{formatNumber(tweet.likes)}</span>
                        </div>
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
                  {hotTopics.slice(0, 8).map((topic) => (
                    <div key={topic.id} className="flex items-center gap-3">
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

            {/* Twitter Trends */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Hash className="w-5 h-5 text-blue-500" />
                  <CardTitle className="text-lg">Twitter AI 话题</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {twitterTrends.slice(0, 5).map((trend) => (
                    <div key={trend.id} className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded flex items-center justify-center text-sm font-bold ${
                        trend.rank <= 3 ? 'bg-blue-500 text-white' : 'bg-muted text-muted-foreground'
                      }`}>
                        {trend.rank}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-sm">#{trend.name}</p>
                        <p className="text-xs text-muted-foreground">{formatNumber(trend.tweetVolume)} 推文</p>
                      </div>
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
