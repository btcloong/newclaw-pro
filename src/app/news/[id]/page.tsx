"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Eye, Share2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface News {
  id: string;
  title: string;
  summary?: string;
  content?: string;
  url?: string;
  source?: string;
  sourceUrl?: string;
  image?: string;
  category?: string;
  tags?: string[];
  publishedAt?: string;
  isHot?: boolean;
  isFeatured?: boolean;
  viewCount?: number;
  author?: string;
}

export default function NewsDetailPage({ params }: { params: { id: string } }) {
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/news/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setNews(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!news) {
    notFound();
  }

  const tags = Array.isArray(news.tags) ? news.tags : [];

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
                <span>{formatDate(news.publishedAt || "")}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{news.viewCount || 0} 阅读</span>
              </div>
              {news.author && <span>作者: {news.author}</span>}
            </div>
          </div>

          {news.image && (
            <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
              <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
            </div>
          )}

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

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-muted text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 pt-8 border-t">
            {news.sourceUrl && (
              <a href={news.sourceUrl} target="_blank" rel="noopener noreferrer">
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
