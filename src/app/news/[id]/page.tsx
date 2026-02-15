import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, Eye, ExternalLink } from "lucide-react";
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

          {article.aiSummary && (
            <Card className="mb-8 bg-blue-50/50">
              <CardContent className="p-6">
                <h2 className="font-semibold mb-2">AI 摘要</h2>
                <p className="text-muted-foreground">{article.aiSummary}</p>
              </CardContent>
            </Card>
          )}

          {article.recommendation && (
            <Card className="mb-8 bg-yellow-50/50">
              <CardContent className="p-6">
                <h2 className="font-semibold mb-2">推荐理由</h2>
                <p className="text-muted-foreground">{article.recommendation}</p>
              </CardContent>
            </Card>
          )}

          <article className="prose prose-lg max-w-none mb-8">
            <p className="text-muted-foreground">{article.content || article.summary}</p>
          </article>

          {article.aiKeywords && article.aiKeywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {article.aiKeywords.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-muted text-sm hover:bg-accent cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
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
