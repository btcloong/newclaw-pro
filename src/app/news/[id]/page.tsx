import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Eye, Share2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface NewsDetailPageProps {
  params: { id: string };
}

async function getNewsDetail(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/news/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.data : null;
  } catch {
    return null;
  }
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const news = await getNewsDetail(params.id);

  if (!news) {
    notFound();
  }

  const tags = news.tags ? JSON.parse(news.tags) : [];

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
              {news.isHot && <Badge variant="danger">热门</Badge>}
              {news.category && <Badge variant="secondary">{news.category}</Badge>}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-6">{news.title}</h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center">
                  <span className="text-brand-500 font-bold">
                    {news.source?.charAt(0) || "N"}
                  </span>
                </div>
                <span>{news.source}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDate(news.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{news.viewCount || 0} 阅读</span>
              </div>
              {news.author && (
                <span>作者: {news.author}</span>
              )}
            </div>
          </div>

          {/* Featured Image */}
          {news.image && (
            <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <article className="prose prose-lg max-w-none mb-8">
            {news.summary && (
              <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                {news.summary}
              </p>
            )}
            {news.content ? (
              <div dangerouslySetInnerHTML={{ __html: news.content }} />
            ) : (
              <p className="text-muted-foreground">
                暂无详细内容，请访问原文查看完整信息。
              </p>
            )}
          </article>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-muted text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-8 border-t">
            {news.sourceUrl && (
              <a
                href={news.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="gap-2">
                  阅读原文
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            )}
            <Button variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" />
              分享
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
