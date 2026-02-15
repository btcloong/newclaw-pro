"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Sparkles, BarChart3, Tag } from "ucide-react";
import { cn } from "@/lib/utils";

interface TrendSummaryProps {
  className?: string;
}

interface TrendData {
  summary: string;
  keyTrends: string[];
  categoryDistribution: Record<string, number>;
  topKeywords: Array<{ keyword: string; count: number }>;
}

// 分类颜色映射
const categoryColors: Record<string, string> = {
  "AI/ML": "bg-blue-500",
  "安全": "bg-red-500",
  "工程": "bg-green-500",
  "工具": "bg-purple-500",
  "开源": "bg-orange-500",
  "观点": "bg-pink-500",
  "其他": "bg-gray-500",
};

// 关键词云组件
function KeywordCloud({ keywords }: { keywords: Array<{ keyword: string; count: number }> }) {
  const maxCount = Math.max(...keywords.map((k) => k.count));
  const minCount = Math.min(...keywords.map((k) => k.count));

  const getSize = (count: number) => {
    if (maxCount === minCount) return "text-sm";
    const ratio = (count - minCount) / (maxCount - minCount);
    if (ratio > 0.8) return "text-lg font-bold";
    if (ratio > 0.5) return "text-base font-semibold";
    if (ratio > 0.2) return "text-sm";
    return "text-xs";
  };

  return (
    <div className="flex flex-wrap gap-2">
      {keywords.map(({ keyword, count }) => (
        <span
          key={keyword}
          className={cn(
            "px-2 py-1 rounded-full bg-muted hover:bg-accent transition-colors cursor-pointer",
            getSize(count)
          )}
          title={`出现 ${count} 次`}
        >
          {keyword}
        </span>
      ))}
    </div>
  );
}

// 分类分布图表
function CategoryDistribution({ distribution }: { distribution: Record<string, number> }) {
  const total = Object.values(distribution).reduce((a, b) => a + b, 0);
  const sorted = Object.entries(distribution).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-2">
      {sorted.map(([category, count]) => {
        const percentage = total > 0 ? (count / total) * 100 : 0;
        return (
          <div key={category} className="flex items-center gap-2">
            <div className="w-16 text-xs text-muted-foreground truncate">{category}</div>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full", categoryColors[category] || "bg-gray-500")}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="w-8 text-xs text-right">{count}</div>
          </div>
        );
      })}
    </div>
  );
}

export function TrendSummary({ className }: TrendSummaryProps) {
  const [trendData, setTrendData] = useState<TrendData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrends() {
      try {
        const response = await fetch("/api/trends");
        const data = await response.json();
        if (data.success) {
          setTrendData({
            summary: data.summary.summary,
            keyTrends: data.summary.keyTrends,
            categoryDistribution: data.stats.categoryDistribution,
            topKeywords: data.stats.keywordCloud.slice(0, 20),
          });
        }
      } catch (error) {
        console.error("Failed to fetch trends:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTrends();
  }, []);

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-5/6" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!trendData) {
    return null;
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* 今日看点总结 */}
      <Card className="bg-gradient-to-br from-brand-500/5 to-brand-700/5 border-brand-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5 text-brand-500" />
            今日看点
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {trendData.summary}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {trendData.keyTrends.map((trend) => (
              <Badge
                key={trend}
                variant="secondary"
                className="bg-brand-500/10 text-brand-700 hover:bg-brand-500/20"
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                {trend}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 分类分布 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              分类分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryDistribution distribution={trendData.categoryDistribution} />
          </CardContent>
        </Card>

        {/* 关键词云 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Tag className="w-4 h-4 text-muted-foreground" />
              热门关键词
            </CardTitle>
          </CardHeader>
          <CardContent>
            <KeywordCloud keywords={trendData.topKeywords} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
