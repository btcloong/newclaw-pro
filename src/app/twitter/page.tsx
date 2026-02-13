import { Twitter, TrendingUp, Clock, Flame } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TweetCard } from "@/components/tweet-card";
import { TwitterTrendsList } from "@/components/twitter-trends-list";
import { db } from "@/lib/db";

export default async function TwitterPage() {
  const tweets = await db.tweets.findAll({ limit: 20 });
  const hotTweets = await db.tweets.findAll({ isHot: true, limit: 10 });
  const trends = await db.twitterTrends.findAll();

  // 统计数据
  const totalTweets = tweets.length;
  const totalHotTweets = hotTweets.length;
  const totalEngagement = tweets.reduce((sum, t) => sum + t.likes + t.retweets + t.replies, 0);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-blue-500/10">
            <Twitter className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Twitter AI 洞察</h1>
            <p className="text-muted-foreground">追踪 AI 领域最新推文和话题趋势</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Twitter className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">总推文</p>
                  <p className="text-xl font-bold">{totalTweets}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Flame className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">热门推文</p>
                  <p className="text-xl font-bold">{totalHotTweets}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">总互动</p>
                  <p className="text-xl font-bold">{(totalEngagement / 1000).toFixed(1)}K</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-brand-500" />
                <div>
                  <p className="text-sm text-muted-foreground">更新频率</p>
                  <p className="text-xl font-bold">15分钟</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">全部推文</TabsTrigger>
                <TabsTrigger value="hot" className="gap-2">
                  <Flame className="w-4 h-4" /
                  热门推文
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {tweets.map((tweet) => (
                  <TweetCard key={tweet.id} tweet={tweet} />
                ))}
              </TabsContent>

              <TabsContent value="hot" className="space-y-4">
                {hotTweets.map((tweet) => (
                  <TweetCard key={tweet.id} tweet={tweet} />
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trends */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  <CardTitle className="text-lg">AI 话题趋势</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <TwitterTrendsList trends={trends} />
              </CardContent>
            </Card>

            {/* Data Sources */}
            <Card className="bg-gradient-to-br from-blue-500/5 to-blue-700/5">
              <CardContent className="p-5">
                <h3 className="font-semibold mb-2">数据来源</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  追踪 AI 领域重要人物和机构的最新动态
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">追踪账号</span>
                    <span className="font-medium">10+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">更新频率</span>
                    <span className="font-medium">每 15 分钟</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">覆盖话题</span>
                    <span className="font-medium">50+</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracked Accounts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">追踪账号</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Sam Altman", handle: "@sama", category: "OpenAI" },
                    { name: "Andrej Karpathy", handle: "@karpathy", category: "AI研究" },
                    { name: "Yann LeCun", handle: "@ylecun", category: "Meta AI" },
                    { name: "吴恩达", handle: "@AndrewYNg", category: "AI教育" },
                    { name: "李飞飞", handle: "@drfeifei", category: "AI研究" },
                  ].map((account) => (
                    <div key={account.handle} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <span className="text-blue-500 font-bold text-xs">
                          {account.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{account.name}</p>
                        <p className="text-xs text-muted-foreground">{account.handle}</p>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                        {account.category}
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
