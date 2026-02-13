import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Eye, Share2, Bookmark, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

interface NewsDetailPageProps {
  params: { id: string };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const article = await db.news.findById(params.id);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {article.isHot && <Badge variant="destructive">热门</Badge>}
              {article.category && <Badge variant="secondary">{article.category}</Badge>}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-6">{article.title}</h1>

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

          {/* Featured Image */}
          {article.image && (
            <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Summary */}
          {article.summary && (
            <div className="p-6 rounded-xl bg-muted/50 mb-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {article.summary}
              </p>
            </div>
          )}

          {/* Content */}
          <article className="prose prose-lg max-w-none mb-8">
            {article.content ? (
              <div 
                className="text-foreground leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: article.content }} 
              />
            ) : (
              <div className="text-muted-foreground space-y-4">
                <p>
                  本文内容正在整理中。请访问原始来源获取完整信息。
                </p>
                {article.sourceUrl && (
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-brand-500 hover:underline"
                  >
                    阅读原文
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </article>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {article.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-muted text-sm hover:bg-accent cursor-pointer transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-8 border-t">
            <Button variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" />
              分享
            </Button>
            <Button variant="outline" className="gap-2">
              <Bookmark className="w-4 h-4" />
              收藏
            </Button>
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
