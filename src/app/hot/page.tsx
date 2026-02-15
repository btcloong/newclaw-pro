import { Flame, Clock, Calendar, TrendingUp } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function HotPage() {
  const news = await db.news.findAll({ limit: 20 });
  const hotTopics = await db.hotTopics.findAll();

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
                      <Clock className="w-4 h-4" />
                      24小时
                    </TabsTrigger>
                    <TabsTrigger value="7d" className="gap-2">
                      <Calendar className="w-4 h-4" />
                      7天
                    </TabsTrigger>
                    <TabsTrigger value="30d" className="gap-2">
                      <TrendingUp className="w-4 h-4" />
                      30天
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="space-y-4">
                {news.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
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
                            {item.isHot && <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">热门</span>}
                            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">{item.aiCategory || item.category}</span>
                            {item.aiScores && (
                              <span className="text-xs text-yellow-600">★ {item.aiScores.overall.toFixed(1)}</span>
                            )}
                          </div>
                          <h3 className="font-semibold mb-1">{item.chineseTitle || item.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{item.aiSummary || item.summary}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <span>{item.source}</span>
                            <span>•</span>
                            <span>{formatDate(item.publishedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <CardTitle className="text-xl">热搜榜单</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {hotTopics.slice(0, 10).map((topic) => (
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
          </div>
        </div>
      </div>
    </div>
  );
}
