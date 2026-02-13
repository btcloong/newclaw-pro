import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { db, research } from "@/lib/db";
import { eq } from "drizzle-orm";

interface ResearchDetailPageProps {
  params: { id: string };
}

async function getResearchDetail(id: string) {
  try {
    const result = await db.select().from(research).where(eq(research.id, id));
    return result.length > 0 ? result[0] : null;
  } catch {
    return null;
  }
}

export default async function ResearchDetailPage({ params }: ResearchDetailPageProps) {
  const report = await getResearchDetail(params.id);

  if (!report) {
    notFound();
  }

  const tags = report.tags ? JSON.parse(report.tags) : [];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/research"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          返回投研
        </Link>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="secondary">{report.category}</Badge>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-6">{report.title}</h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              {report.author && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{report.author}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(report.publishedAt).toLocaleDateString("zh-CN")}
                </span>
              </div>
              {report.readTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{report.readTime}</span>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          {report.summary && (
            <div className="p-6 rounded-xl bg-muted/50 mb-8">
              <h2 className="text-lg font-semibold mb-2">摘要</h2>
              <p className="text-muted-foreground">{report.summary}</p>
            </div>
          )}

          {/* Content */}
          <article className="prose prose-lg max-w-none mb-8">
            {report.content ? (
              <div dangerouslySetInnerHTML={{ __html: report.content }} />
            ) : (
              <p className="text-muted-foreground">
                报告内容正在整理中，敬请期待。
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
            <Button variant="outline">下载 PDF</Button>
            <Button variant="outline">分享报告</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
