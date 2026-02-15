"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp, Star, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { cn, formatDate } from "../../lib/utils";
import type { NewsItem } from "../../lib/db";

interface TodayMustReadProps {
  className?: string;
}

export function TodayMustRead({ className }: TodayMustReadProps) {
  const [topArticles, setTopArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopArticles() {
      try {
        const response = await fetch("/api/news?aiProcessed=true&limit=3");
        const data = await response.json();
        if (data.success) {
          // 按 AI 评分排序
          const sorted = data.data
            .filter((a: NewsItem) => a.aiScores)
            .sort((a: NewsItem, b: NewsItem) =>
              (b.aiScores?.overall || 0) - (a.aiScores?.overall || 0)
            )
            .slice(0, 3);
          setTopArticles(sorted);
        }
      } catch (error) {
        console.error("Failed to fetch top articles:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTopArticles();
  }, []);

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (topArticles.length === 0) {
    return null;
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500">
            <Star className="w-5 h-5 text-white" />
          </div>
          <span>今日必读</span>
          <Badge variant="secondary" className="ml-auto">
            TOP 3
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {topArticles.map((article, index) => (
          <Link
            key={article.id}
            href={`/news/${article.id}`}
            className="group block"
          >
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
              {/* 排名 */}
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0",
                  index === 0
                    ? "bg-yellow-500 text-white"
                    : index === 1
                    ? "bg-gray-400 text-white"
                    : index === 2
                    ? "bg-orange-400 text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {index + 1}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm line-clamp-2 group-hover:text-brand-500 transition-colors">
                  {article.chineseTitle || article.title}
                </h4>
                
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant="outline" className="text-xs">
                    {article.aiCategory || article.category}
                  </Badge>
                  
                  {article.aiScores && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <TrendingUp className="w-3 h-3" />
                      <span>{article.aiScores.overall.toFixed(1)}</span>
                    </div>
                  )}
                  
                  <span className="text-xs text-muted-foreground ml-auto">
                    {formatDate(article.publishedAt)}
                  </span>
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </div>
          </Link>
        ))}

        <Link href="/hot">
          <Button variant="outline" className="w-full" size="sm">
            查看全部热点
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
