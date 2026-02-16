import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, Eye, ExternalLink, BookOpen, History, Tags } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface NewsDetailPageProps {
  params: { id: string };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const article = await db.news.findById(params.id);

  if (!article) {
    notFound();
  }

  const displayTitle = article.chineseTitle || article.title;
  const displayCategory = article.aiCategory || article.category;
  
  // 获取相关新闻
  const relatedNews = article.relatedNews 
    ? await Promise.all(
        article.relatedNews.map(async (id) => {
          const news = await db.news.findById(id);
          return news;
        })
      ).then(results => results.filter(Boolean))
    : [];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {article.isHot && <Badge variant="destructive">热门</Badge>}
              <Badge variant="secondary">{displayCategory}</Badge>
              {article.aiScores && (
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-yellow-500">★</span>
                  <span>{article.aiScores.overall.toFixed(1)}</span>
                  <span className="text-muted-foreground text-xs">
                    (相关性{article.aiScores.relevance} 质量{article.aiScores.quality} 时效{article.aiScores.timeliness})
                  </span>
                </div>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-6">{displayTitle}</h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center">
                  <span className="text-brand-500 font-bold text-sm">
                    {article.source?.charAt(0) || "N"}
                  </span>
                </div>
                <span>{article.source}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              {article.viewCount && (
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{article.viewCount.toLocaleString()} 阅读</span>
                </div>
              )}
            </div>
          </div>

          {article.image && (
            <div 
              className="relative aspect-video rounded-xl overflow-hidden mb-8 bg-cover bg-center"
              style={{ backgroundImage: `url(${article.image})` }}
            />
          )}

          {/* AI 摘要 */}
          {article.aiSummary && (
            <Card className="mb-8 bg-blue-50/50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  AI 摘要
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{article.aiSummary}</p>
              </CardContent>
            </Card>
          )}

          {/* 推荐理由 */}
          {article.recommendation && (
            <Card className="mb-8 bg-yellow-50/50 border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="text-yellow-500">💡</span>
                  推荐理由
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{article.recommendation}</p>
              </CardContent>
            </Card>
          )}

          {/* 前世今生 - 背景信息 */}
          {article.background && (
            <Card className="mb-8 bg-purple-50/50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <History className="w-5 h-5 text-purple-500" />
                  前世今生
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{article.background}</p>
                
                {article.history && article.history.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">发展历程</h4>
                    <ul className="space-y-2">
                      {article.history.map((event, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                          {event}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* 正文内容 */}
          <article className="prose prose-lg max-w-none mb-8">
            <h2 className="text-xl font-bold mb-4">详细内容</h2>
            <p className="text-muted-foreground leading-relaxed">{article.content || article.summary}</p>
          </article>

          {/* 标签 */}
          {(article.aiKeywords || article.tags) && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Tags className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">标签</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(article.aiKeywords || article.tags || []).map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-muted text-sm hover:bg-accent cursor-pointer transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 相关新闻推荐 */}
          {relatedNews.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg">相关新闻推荐</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {relatedNews.map((news) => news && (
                    <Link 
                      key={news.id} 
                      href={`/news/${news.id}`}
                      className="block p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs">{news.aiCategory || news.category}</Badge>
                        <span className="text-xs text-muted-foreground">{formatDate(news.publishedAt)}</span>
                      </div>
                      <p className="font-medium text-sm">{news.chineseTitle || news.title}</p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-wrap items-center gap-4 pt-8 border-t">
            {article.sourceUrl && (
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  访问原文
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
