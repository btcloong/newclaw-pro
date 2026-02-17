"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Twitter, 
  Heart, 
  Repeat2, 
  MessageCircle, 
  Eye, 
  ExternalLink, 
  RefreshCw,
  TrendingUp,
  Clock,
  Filter,
  Sparkles,
  Flame,
  CheckCircle2,
  Zap,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

// 推文类型定义
interface Tweet {
  id: string;
  content: string;
  author: {
    name: string;
    username: string;
    avatar?: string;
    verified?: boolean;
  };
  publishedAt: string;
  likes: number;
  retweets: number;
  replies: number;
  views?: number;
  hashtags: string[];
  mentions: string[];
  urls: string[];
  isHot?: boolean;
  sentiment?: "positive" | "neutral" | "negative";
  aiAnalysis?: {
    chineseSummary: string;
    keyPoints: string[];
    importance: "high" | "medium" | "low";
    category: string;
  };
}

interface TwitterTrend {
  id: string;
  name: string;
  query: string;
  tweetVolume: number;
  rank: number;
  category?: string;
}

interface TweetStats {
  totalTweets: number;
  hotTweets: number;
  positiveTweets: number;
  negativeTweets: number;
  neutralTweets: number;
  totalLikes: number;
  totalRetweets: number;
  lastUpdate: string | null;
}

const ITEMS_PER_PAGE = 20;

// 格式化数字
function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

// 获取重要性颜色
function getImportanceColor(importance?: string): string {
  switch (importance) {
    case "high": return "bg-red-500/10 text-red-600 border-red-200";
    case "medium": return "bg-amber-500/10 text-amber-600 border-amber-200";
    case "low": return "bg-blue-500/10 text-blue-600 border-blue-200";
    default: return "bg-gray-500/10 text-gray-600 border-gray-200";
  }
}

// 获取重要性标签
function getImportanceLabel(importance?: string): string {
  switch (importance) {
    case "high": return "高重要性";
    case "medium": return "中等重要性";
    case "low": return "一般";
    default: return "未评级";
  }
}

// 推文卡片组件
function TweetCard({ tweet, expanded, onToggle }: { 
  tweet: Tweet; 
  expanded: boolean;
  onToggle: () => void;
}) {
  const tweetUrl = tweet.urls[0] || `https://twitter.com/${tweet.author.username}/status/${tweet.id}`;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-lg transition-shadow"
    >
      {/* 头部：作者信息 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            {tweet.author.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-gray-900 dark:text-white">
                {tweet.author.name}
              </span>
              {tweet.author.verified && (
                <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500" />
              )}
              {tweet.isHot && (
                <Flame className="w-4 h-4 text-orange-500" />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>@{tweet.author.username}</span>
              <span>·</span>
              <span title={new Date(tweet.publishedAt).toLocaleString()}>
                {formatDistanceToNow(new Date(tweet.publishedAt), { 
                  addSuffix: true,
                  locale: zhCN 
                })}
              </span>
            </div>
          </div>
        </div>
        
        {/* 重要性标签 */}
        {tweet.aiAnalysis?.importance && (
          <Badge variant="outline" className={getImportanceColor(tweet.aiAnalysis.importance)}>
            {getImportanceLabel(tweet.aiAnalysis.importance)}
          </Badge>
        )}
      </div>

      {/* 推文内容 */}
      <div className="mb-4">
        <p className="text-gray-800 dark:text-gray-200 text-[15px] leading-relaxed whitespace-pre-wrap">
          {tweet.content}
        </p>
        
        {/* 话题标签 */}
        {tweet.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {tweet.hashtags.map((tag, i) => (
              <span key={i} className="text-blue-500 hover:underline cursor-pointer text-sm">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* AI 解读区域 */}
      {tweet.aiAnalysis && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-lg p-4 mb-4 border border-purple-100 dark:border-purple-900">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="font-medium text-purple-900 dark:text-purple-300 text-sm">AI 解读</span>
            {tweet.aiAnalysis.category && (
              <Badge variant="secondary" className="text-xs">
                {tweet.aiAnalysis.category}
              </Badge>
            )}
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
            {tweet.aiAnalysis.chineseSummary}
          </p>
          
          {/* 关键信息点 */}
          {tweet.aiAnalysis.keyPoints.length > 0 && (
            <div className={expanded ? "" : "hidden"}>
              <div className="text-xs font-medium text-gray-500 mb-1.5">关键信息：</div>
              <ul className="space-y-1">
                {tweet.aiAnalysis.keyPoints.map((point, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <button 
            onClick={onToggle}
            className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1 mt-2"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-3 h-3" /> 收起
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" /> 展开详情
              </>
            )}
          </button>
        </div>
      )}

      {/* 互动数据 */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors cursor-pointer">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">{formatNumber(tweet.likes)}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tweet.likes.toLocaleString()} 点赞</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 text-gray-500 hover:text-green-500 transition-colors cursor-pointer">
                  <Repeat2 className="w-4 h-4" />
                  <span className="text-sm">{formatNumber(tweet.retweets)}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tweet.retweets.toLocaleString()} 转发</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors cursor-pointer">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">{formatNumber(tweet.replies)}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tweet.replies.toLocaleString()} 回复</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {tweet.views && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">{formatNumber(tweet.views)}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tweet.views.toLocaleString()} 浏览</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        {/* 原文链接 */}
        <a 
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors text-sm"
        >
          <ExternalLink className="w-4 h-4" />
          查看原文
        </a>
      </div>
    </motion.div>
  );
}

// 趋势卡片组件
function TrendCard({ trend }: { trend: TwitterTrend }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
      <div className="flex items-center gap-3">
        <span className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded text-sm font-semibold text-gray-700 dark:text-gray-300">
          {trend.rank}
        </span>
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{trend.name}</div>
          {trend.category && (
            <div className="text-xs text-gray-500">{trend.category}</div>
          )}
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {formatNumber(trend.tweetVolume)}
        </div>
        <div className="text-xs text-gray-500">推文</div>
      </div>
    </div>
  );
}

// 主页面组件
export default function TwitterPage() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [trends, setTrends] = useState<TwitterTrend[]>([]);
  const [stats, setStats] = useState<TweetStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<"time" | "popularity">("time");
  const [filterImportance, setFilterImportance] = useState<"all" | "high" | "medium" | "low">("all");
  const [expandedTweets, setExpandedTweets] = useState<Set<string>>(new Set());
  
  // 分页相关状态
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 获取数据
  const fetchData = async (force = false) => {
    try {
      if (force) setRefreshing(true);
      
      // 获取推文 - 获取更多数据以支持分页
      const tweetsRes = await fetch(`/api/twitter?sortBy=${sortBy}&limit=100`);
      const tweetsData = await tweetsRes.json();
      
      // 获取趋势
      const trendsRes = await fetch('/api/twitter/trends');
      const trendsData = await trendsRes.json();
      
      // 获取统计
      const statsRes = await fetch('/api/twitter/stats');
      const statsData = await statsRes.json();
      
      if (tweetsData.tweets) setTweets(tweetsData.tweets);
      if (trendsData.trends) setTrends(trendsData.trends);
      if (statsData.stats) setStats(statsData.stats);
    } catch (error) {
      console.error("Failed to fetch Twitter data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 刷新数据
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const res = await fetch('/api/twitter/refresh', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await fetchData(true);
        setDisplayCount(ITEMS_PER_PAGE);
      }
    } catch (error) {
      console.error("Failed to refresh:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // 切换展开状态
  const toggleExpanded = (tweetId: string) => {
    setExpandedTweets(prev => {
      const next = new Set(prev);
      if (next.has(tweetId)) {
        next.delete(tweetId);
      } else {
        next.add(tweetId);
      }
      return next;
    });
  };

  // 过滤推文
  const filteredTweets = useMemo(() => {
    return tweets.filter(tweet => {
      if (filterImportance === "all") return true;
      return tweet.aiAnalysis?.importance === filterImportance;
    });
  }, [tweets, filterImportance]);

  // 当前显示的推文
  const displayedTweets = useMemo(() => {
    return filteredTweets.slice(0, displayCount);
  }, [filteredTweets, displayCount]);

  // 是否还有更多数据
  const hasMore = displayCount < filteredTweets.length;

  // 重置显示数量当筛选条件改变时
  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [filterImportance, sortBy]);

  // 加载更多
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayCount(prev => prev + ITEMS_PER_PAGE);
      setIsLoadingMore(false);
    }, 300);
  }, [isLoadingMore, hasMore]);

  // 无限滚动监听
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, loadMore]);

  // 初始加载
  useEffect(() => {
    fetchData();
    // 每分钟自动刷新
    const interval = setInterval(() => fetchData(), 60000);
    return () => clearInterval(interval);
  }, [sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
          <span className="text-gray-600">加载中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <a 
                href="/" 
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                ← 返回首页
              </a>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <Twitter className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Twitter 动态</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {stats && (
                <div className="hidden md:flex items-center gap-4 text-sm text-gray-500">
                  <span>{stats.totalTweets} 条推文</span>
                  <span>{stats.hotTweets} 条热门</span>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                {refreshing ? "更新中..." : "刷新"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧：推文列表 */}
          <div className="lg:col-span-3 space-y-6">
            {/* 筛选和排序 */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">筛选：</span>
                </div>
                <Tabs value={filterImportance} onValueChange={(v) => setFilterImportance(v as any)}>
                  <TabsList className="h-8">
                    <TabsTrigger value="all" className="text-xs">全部</TabsTrigger>
                    <TabsTrigger value="high" className="text-xs">高重要性</TabsTrigger>
                    <TabsTrigger value="medium" className="text-xs">中等</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">排序：</span>
                </div>
                <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                  <TabsList className="h-8">
                    <TabsTrigger value="time" className="text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 最新
                    </TabsTrigger>
                    <TabsTrigger value="popularity" className="text-xs flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> 热度
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* 推文列表 */}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {displayedTweets.length > 0 ? (
                  <>
                    {displayedTweets.map((tweet) => (
                      <TweetCard
                        key={tweet.id}
                        tweet={tweet}
                        expanded={expandedTweets.has(tweet.id)}
                        onToggle={() => toggleExpanded(tweet.id)}
                      />
                    ))}

                    {/* 加载更多区域 */}
                    <div ref={loadMoreRef} className="py-4">
                      {isLoadingMore && (
                        <div className="flex items-center justify-center gap-2 text-gray-500">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>加载中...</span>
                        </div>
                      )}
                      
                      {!isLoadingMore && hasMore && (
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={loadMore}
                        >
                          加载更多 ({filteredTweets.length - displayCount} 条)
                        </Button>
                      )}
                      
                      {!hasMore && displayedTweets.length > 0 && (
                        <p className="text-center text-sm text-gray-500 py-4">
                          已显示全部 {filteredTweets.length} 条推文
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800"
                  >
                    <Twitter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">暂无符合条件的推文</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={handleRefresh}
                    >
                      刷新数据
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 右侧：侧边栏 */}
          <div className="space-y-6">
            {/* 统计卡片 */}
            {stats && (
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  数据统计
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">总推文</span>
                    <span className="font-medium">{stats.totalTweets}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">热门推文</span>
                    <span className="font-medium text-orange-500">{stats.hotTweets}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">积极情感</span>
                    <span className="font-medium text-green-500">{stats.positiveTweets}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">总点赞</span>
                    <span className="font-medium">{formatNumber(stats.totalLikes)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">总转发</span>
                    <span className="font-medium">{formatNumber(stats.totalRetweets)}</span>
                  </div>
                </div>
                {stats.lastUpdate && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400">
                    最后更新：{formatDistanceToNow(new Date(stats.lastUpdate), { addSuffix: true, locale: zhCN })}
                  </div>
                )}
              </div>
            )}

            {/* 热门趋势 */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-red-500" />
                热门话题
              </h3>
              <div className="space-y-2">
                {trends.slice(0, 8).map((trend) => (
                  <TrendCard key={trend.id} trend={trend} />
                ))}
              </div>
            </div>

            {/* 关于 */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl border border-blue-100 dark:border-blue-900 p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                关于 AI Twitter
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                聚合 25 个高质量 AI 领域 Twitter 账号，
                通过 AI 智能分析生成中文摘要，帮助你快速了解 AI 行业动态。
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">实时更新</Badge>
                <Badge variant="secondary" className="text-xs">AI 解读</Badge>
                <Badge variant="secondary" className="text-xs">高质量源</Badge>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
