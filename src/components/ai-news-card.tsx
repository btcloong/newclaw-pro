"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, TrendingUp, Sparkles, ArrowRight, Clock, Bookmark, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn, formatDate } from "@/lib/utils";
import type { NewsItem } from "@/lib/db";

interface AINewsCardProps {
  article: NewsItem;
  variant?: "featured" | "top" | "default";
  className?: string;
}

// AI 评分展示组件
function AIScoreBadge({ scores }: { scores?: { relevance: number; quality: number; timeliness: number; overall: number } }) {
  if (!scores) return null;

  const getScoreColor = (score: number) => {
    if (score >= 9) return "bg-green-500";
    if (score >= 7) return "bg-blue-500";
    if (score >= 5) return "bg-yellow-500";
    return "bg-gray-500";
  };

  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="flex items-center gap-1">
        <Star className="w-3 h-3 text-yellow-500" />
        <span className="font-medium">{scores.overall.toFixed(1)}</span>
      </div>
      <div className="flex gap-1">
        <div className={`w-1.5 h-1.5 rounded-full ${getScoreColor(scores.relevance)}`} title={`相关性: ${scores.relevance}`} />
        <div className={`w-1.5 h-1.5 rounded-full ${getScoreColor(scores.quality)}`} title={`质量: ${scores.quality}`} />
        <div className={`w-1.5 h-1.5 rounded-full ${getScoreColor(scores.timeliness)}`} title={`时效性: ${scores.timeliness}`} />
      </div>
    </div>
  );
}

// 详细 AI 评分展示
function AIScoreDetail({ scores }: { scores?: { relevance: number; quality: number; timeliness: number; overall: number } }) {
  if (!scores) return null;

  return (
    <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">AI 综合评分</span>
        <span className="text-lg font-bold text-brand-500">{scores.overall.toFixed(1)}</span>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-12">相关性</span>
          <Progress value={scores.relevance * 10} className="h-1.5 flex-1" />
          <span className="text-xs w-6 text-right">{scores.relevance}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-12">质量</span>
          <Progress value={scores.quality * 10} className="h-1.5 flex-1" />
          <span className="text-xs w-6 text-right">{scores.quality}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-12">时效性</span>
          <Progress value={scores.timeliness * 10} className="h-1.5 flex-1" />
          <span className="text-xs w-6 text-right">{scores.timeliness}</span>
        </div>
      </div>
    </div>
  );
}

export function AINewsCard({ article, variant = "default", className }: AINewsCardProps) {
  const [expanded, setExpanded] = useState(false);

  const displayTitle = article.chineseTitle || article.title;
  const displaySummary = article.aiSummary || article.summary;
  const displayCategory = article.aiCategory || article.category;
  const displayKeywords = article.aiKeywords || article.tags;

  // 特色卡片（今日必读 Top 3）
  if (variant === "top") {
    return (
      <Card className={cn("overflow-hidden group hover:shadow-lg transition-all duration-300", className)}>
        <div className="relative">
          {/* 排名标识 */}
          <div className="absolute top-3 left-3 z-10">
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
              <TrendingUp className="w-4 h-4" />
              <span>今日必读</span>
            </div>
          </div>

          {/* 图片 */}
          <div className="relative aspect-[16/9] overflow-hidden">
            {article.image ? (
              <Image
                src={article.image}
                alt={displayTitle}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-brand-500/20 to-brand-700/20 flex items-center justify-center">
                <Sparkles className="w-16 h-16 text-brand-500/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            {/* 分类标签 */}
            <div className="absolute top-3 right-3">
              <Badge className="bg-white/20 backdrop-blur-sm text-white border-0">
                {displayCategory}
              </Badge>
            </div>

            {/* 底部内容 */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <Link href={`/news/${article.id}`}>
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-brand-300 transition-colors">
                  {displayTitle}
                </h3>
              </Link>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-white/70 text-sm">
                  <span>{article.source}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(article.publishedAt)}
                  </span>
                </div>
                <AIScoreBadge scores={article.aiScores} />
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          {/* AI 摘要 */}
          <p className="text-sm text-muted-foreground line-clamp-3">
            {displaySummary}
          </p>

          {/* 推荐理由 */}
          {article.recommendation && (
            <div className="p-3 bg-brand-500/5 rounded-lg border border-brand-500/10">
              <div className="flex items-center gap-1.5 text-brand-600 text-xs font-medium mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI 推荐理由</span>
              </div>
              <p className="text-sm text-muted-foreground">{article.recommendation}</p>
            </div>
          )}

          {/* 关键词 */}
          {displayKeywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {displayKeywords.slice(0, 4).map((keyword) => (
                <span
                  key={keyword}
                  className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground hover:bg-accent transition-colors cursor-pointer"
                >
                  #{keyword}
                </span>
              ))}
            </div>
          )}

          {/* AI 评分详情 */}
          <AIScoreDetail scores={article.aiScores} />

          {/* 操作按钮 */}
          <div className="flex items-center gap-2 pt-2">
            <Link href={`/news/${article.id}`} className="flex-1">
              <Button className="w-full" size="sm">
                阅读全文
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Button variant="outline" size="icon" className="shrink-0">
              <Bookmark className="w-4 h-4" />
            </Button>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
            >
              <Button variant="outline" size="icon">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 默认卡片
  return (
    <Card className={cn("group hover:shadow-md transition-all duration-300", className)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* 图片 */}
          {article.image && (
            <div className="relative w-24 h-24 md:w-32 md:h-24 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={article.image}
                alt={displayTitle}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            {/* 分类和评分 */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {article.isHot && (
                  <Badge variant="destructive" className="text-xs">热门</Badge>
                )}
                <Badge variant="secondary" className="text-xs">
                  {displayCategory}
                </Badge>
              </div>
              <AIScoreBadge scores={article.aiScores} />
            </div>
            
            {/* 标题 */}
            <Link href={`/news/${article.id}`}>
              <h3 className="font-semibold text-base line-clamp-2 mb-2 group-hover:text-brand-500 transition-colors">
                {displayTitle}
              </h3>
            </Link>
            
            {/* 摘要 */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {displaySummary}
            </p>
            
            {/* 元信息 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{article.source}</span>
                <span>•</span>
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              
              {/* 关键词 */}
              {displayKeywords.length > 0 && (
                <div className="flex gap-1">
                  {displayKeywords.slice(0, 2).map((keyword) => (
                    <span
                      key={keyword}
                      className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                    >
                      #{keyword}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
