import Link from "next/link";
import { db } from "@/lib/db";
import { formatNumber, formatDate } from "@/lib/utils";
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
  Star,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function HomePage() {
  const news = await db.news.findAll({ limit: 10 });
  const topArticles = await db.news.findTopRated(3);
  const projects = await db.projects.findAll({ limit: 4 });
  const hotTopics = await db.hotTopics.findAll();
  const tweets = await db.tweets.findAll({ limit: 3 });
  const twitterTrends = await db.twitterTrends.findAll();
  const trendSummary = await db.trendSummary.get();
  const stats = await db.getStats();

  const newsList = news.slice(3);

  return (
    <div className="min-h-screen">
      {/* Stats */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              { title: "今日新闻", value: stats.newsCount.toString(), icon: Zap },
              { title: "热门项目", value: stats.projectsCount.toString(), icon: Target },
              { title: "推特动态", value: stats.tweetsCount.toString(), icon: Twitter },
              { title: "AI 处理", value: stats.aiProcessedCount.toString(), icon: Sparkles },
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
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
                
                <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12">
                  <div className="max-w-xl">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-brand-500 text-white">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI 驱动
                      </Badge>
                      <Badge variant="outline" className="text-white border-white/30">
                        双语聚合
                      </Badge>
                    </div>
                    
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                      New Claw
                      <br />
                      <span className="text-brand-400">AI Daily</span>
                    </h1>
                    <p className="text-white/80 text-sm md:text-base mb-6">
                      智能聚合全球 90+ 顶级技术博客，AI 评分筛选，中文摘要，让优质内容触手可及
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

            {/* 今日必读 Top 3 */}
            {topArticles.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <h2 className="text-xl font-bold">今日必读</h2>
                  <Badge variant="secondary" className="ml-2">AI 精选</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {topArticles.map((article, index) => (
                    <Card key={article.id} className="overflow-hidden">
                      <div className="relative aspect-video">
                        {article.image ? (
                          <div 
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${article.image})` }}
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 to-brand-700/20" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        
                        <div className="absolute top-3 left-3">
                          <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
                            <TrendingUp className="w-3 h-3" />
                            <span>TOP {index + 1}</span>
                          </div>
                        </div>
                        
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <Link href={`/news/${article.id}`}>
                            <h3 className="text-lg font-bold text-white line-clamp-2 hover:text-brand-300">
                              {article.chineseTitle || article.title}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className="bg-white/20 text-white border-0 text-xs">
                              {article.aiCategory || article.category}
                            </Badge>
                            {article.aiScores && (
                              <span className="text-xs text-yellow-400">★ {article.aiScores.overall.toFixed(1)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {article.aiSummary || article.summary}
                        </p>
                        
                        {article.recommendation && (
                          <div className="mt-3 p-2 bg-brand-500/5 rounded text-xs text-muted-foreground">
                            <span className="text-brand-500">推荐理由: </span>
                            {article.recommendation}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* 今日看点 */}
            {trendSummary && (
              <Card className="bg-gradient-to-br from-brand-500/5 to-brand-700/5 border-brand-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="w-5 h-5 text-brand-500" />
                    今日看点
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {trendSummary.summary}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {trendSummary.keyTrends.map((trend) => (
                      <Badge
                        key={trend}
                        variant="secondary"
                        className="bg-brand-500/10 text-brand-700"
                      >
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {trend}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 最新资讯 */}
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
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          {item.image && (
                            <div 
                              className="w-24 h-24 flex-shrink-0 rounded-lg bg-cover bg-center"
                              style={{ backgroundImage: `url(${item.image})` }}
                            />
                          )}
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {item.isHot && <Badge variant="destructive" className="text-xs">热门</Badge>}
                              <Badge variant="secondary" className="text-xs">{item.aiCategory || item.category}</Badge>
                              {item.aiScores && (
                                <span className="text-xs text-yellow-600">★ {item.aiScores.overall.toFixed(1)}</span>
                              )}
                            </div>
                            
                            <h3 className="font-semibold mb-1 hover:text-brand-500">
                              {item.chineseTitle || item.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {item.aiSummary || item.summary}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <span>{item.source}</span>
                              <span>•</span>
                              <span>{formatDate(item.publishedAt)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>

            {/* 新项目发现 */}
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
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold">{project.name}</h3>
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
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
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold">{tweet.author.name}</span>
                            {tweet.author.verified && <span className="text-blue-500 text-xs">✓</span>}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            @{tweet.author.username} • {formatDate(tweet.publishedAt)}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm mb-3">{tweet.content}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> {formatNumber(tweet.replies)}</span>
                        <span className="flex items-center gap-1"><Repeat2 className="w-4 h-4" /> {formatNumber(tweet.retweets)}</span>
                        <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {formatNumber(tweet.likes)}</span>
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
                  每日精选 AI 行业重要资讯，AI 评分筛选，直达核心内容
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
