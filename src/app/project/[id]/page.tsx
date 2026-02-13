import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, GitFork, ExternalLink, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatNumber, formatDate } from "@/lib/utils";

interface ProjectDetailPageProps {
  params: { id: string };
}

async function getProjectDetail(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/projects/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.data : null;
  } catch {
    return null;
  }
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const project = await getProjectDetail(params.id);

  if (!project) {
    notFound();
  }

  const tags = project.tags ? JSON.parse(project.tags) : [];

  const sourceConfig = {
    github: { label: "GitHub", color: "bg-gray-900 text-white" },
    producthunt: { label: "Product Hunt", color: "bg-orange-500 text-white" },
    other: { label: "其他", color: "bg-muted text-muted-foreground" },
  };

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
          <div className="flex items-start gap-6 mb-8">
            {project.logo && (
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                <img
                  src={project.logo}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{project.name}</h1>
                {project.isNew && <Badge variant="success">NEW</Badge>}
                {project.isTrending && <Badge variant="warning">🔥 趋势</Badge>}
              </div>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary">{project.category}</Badge>
                <span className={`text-xs px-2 py-0.5 rounded-full ${sourceConfig[project.source as keyof typeof sourceConfig]?.color || sourceConfig.other.color}`}>
                  {sourceConfig[project.source as keyof typeof sourceConfig]?.label || "其他"}
                </span>
                {project.language && (
                  <span className="text-sm text-muted-foreground">
                    {project.language}
                  </span>
                )}
              </div>

              <p className="text-lg text-muted-foreground">
                {project.description}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {project.stars !== null && (
              <div className="p-4 rounded-xl bg-card border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Star className="w-4 h-4" />
                  <span className="text-sm">Stars</span>
                </div>
                <p className="text-2xl font-bold">{formatNumber(project.stars)}</p>
              </div>
            )}
            {project.forks !== null && (
              <div className="p-4 rounded-xl bg-card border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <GitFork className="w-4 h-4" />
                  <span className="text-sm">Forks</span>
                </div>
                <p className="text-2xl font-bold">{formatNumber(project.forks)}</p>
              </div>
            )}
            {project.upvotes !== null && (
              <div className="p-4 rounded-xl bg-card border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Star className="w-4 h-4" />
                  <span className="text-sm">Upvotes</span>
                </div>
                <p className="text-2xl font-bold">{formatNumber(project.upvotes)}</p>
              </div>
            )}
            {project.createdAt && (
              <div className="p-4 rounded-xl bg-card border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">创建于</span>
                </div>
                <p className="text-2xl font-bold">{formatDate(project.createdAt)}</p>
              </div>
            )}
          </div>

          {/* Description */}
          {project.fullDescription && (
            <div className="prose prose-lg max-w-none mb-8">
              <h2 className="text-xl font-bold mb-4">项目介绍</h2>
              <p>{project.fullDescription}</p>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">标签</h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-muted text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* License */}
          {project.license && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-2">许可证</h2>
              <p className="text-muted-foreground">{project.license}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-8 border-t">
            {project.sourceUrl && (
              <a
                href={project.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="gap-2">
                  访问项目
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
