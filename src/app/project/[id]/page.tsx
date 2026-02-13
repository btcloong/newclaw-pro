"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Star, GitFork, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatNumber } from "@/lib/utils";

interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  logo?: string;
  category: string;
  tags: string[];
  source: "github" | "producthunt" | "other";
  stars?: number;
  forks?: number;
  upvotes?: number;
  createdAt: string;
  isNew?: boolean;
  isTrending?: boolean;
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProject(data.data);
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

  if (!project) {
    notFound();
  }

  const tags = Array.isArray(project.tags) ? project.tags : [];

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
          <div className="flex items-start gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
              {project.logo ? (
                <img src={project.logo} alt={project.name} className="w-12 h-12 rounded" />
              ) : (
                <span className="text-3xl font-bold text-brand-500">
                  {project.name.charAt(0)}
                </span>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{project.name}</h1>
                {project.isNew && <Badge variant="success">NEW</Badge>}
                {project.isTrending && <Badge variant="warning">🔥 趋势</Badge>}
              </div>
              
              <p className="text-muted-foreground mb-4">{project.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <Badge variant="secondary">{project.category}</Badge>
                <span className="text-muted-foreground">
                  来源: {project.source === "github" ? "GitHub" : "Product Hunt"}
                </span>
                <span className="text-muted-foreground">
                  收录时间: {formatDate(project.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {project.stars !== undefined && (
              <div className="p-4 rounded-xl bg-card border text-center">
                <Star className="w-5 h-5 mx-auto mb-2 text-yellow-500" />
                <div className="text-2xl font-bold">{formatNumber(project.stars)}</div>
                <div className="text-sm text-muted-foreground">Stars</div>
              </div>
            )}
            {project.forks !== undefined && (
              <div className="p-4 rounded-xl bg-card border text-center">
                <GitFork className="w-5 h-5 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">{formatNumber(project.forks)}</div>
                <div className="text-sm text-muted-foreground">Forks</div>
              </div>
            )}
            {project.upvotes !== undefined && (
              <div className="p-4 rounded-xl bg-card border text-center">
                <Users className="w-5 h-5 mx-auto mb-2 text-orange-500" />
                <div className="text-2xl font-bold">{formatNumber(project.upvotes)}</div>
                <div className="text-sm text-muted-foreground">Upvotes</div>
              </div>
            )}
          </div>

          {tags.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold mb-3">标签</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-muted text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 pt-8 border-t">
            <a href={project.url} target="_blank" rel="noopener noreferrer">
              <Button className="gap-2">
                访问项目
                <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
