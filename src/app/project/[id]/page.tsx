import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  Star, 
  GitFork, 
  ExternalLink, 
  Calendar,
  Code,
  Tag,
  TrendingUp,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";

interface ProjectDetailPageProps {
  params: { id: string };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const project = await db.projects.findById(params.id);

  if (!project) {
    notFound();
  }

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

        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-muted">
                {project.logo ? (
                  <Image
                    src={project.logo}
                    alt={project.name}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-brand-500/10">
                    <span className="text-3xl font-bold text-brand-500">
                      {project.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {project.isNew && <Badge variant="success">NEW</Badge>}
                {project.isTrending && <Badge variant="warning">🔥 趋势</Badge>}
                <Badge variant="secondary">{project.category}</Badge>
                <span className={sourceConfig[project.source].color + " text-xs px-2 py-0.5 rounded-full"}>
                  {sourceConfig[project.source].label}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.name}</h1>

              <p className="text-lg text-muted-foreground mb-6">
                {project.fullDescription || project.description}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={project.sourceUrl || project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="gap-2">
                    <ExternalLink className="w-4 h-4" />
                    访问项目
                  </Button>
                </a>
                <Button variant="outline">收藏项目</Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {project.stars !== undefined && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Stars</p>
                      <p className="text-xl font-bold">{project.stars.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {project.forks !== undefined && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <GitFork className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Forks</p>
                      <p className="text-xl font-bold">{project.forks.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {project.upvotes !== undefined && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Upvotes</p>
                      <p className="text-xl font-bold">{project.upvotes.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {project.language && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">语言</p>
                      <p className="text-xl font-bold">{project.language}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="md:col-span-2 space-y-6">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>项目介绍</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </CardContent>
              </Card>

              {/* Tags */}
              {project.tags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="w-5 h-5" />
                      标签
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 rounded-full bg-muted text-sm hover:bg-accent cursor-pointer transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Meta Info */}
              <Card>
                <CardHeader>
                  <CardTitle>项目信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {project.createdAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">创建时间</span>
                      <span className="text-sm">
                        {new Date(project.createdAt).toLocaleDateString("zh-CN")}
                      </span>
                    </div>
                  )}

                  {project.updatedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">更新时间</span>
                      <span className="text-sm">
                        {new Date(project.updatedAt).toLocaleDateString("zh-CN")}
                      </span>
                    </div>
                  )}

                  {project.license && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">许可证</span>
                      <span className="text-sm">{project.license}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">来源</span>
                    <span className="text-sm capitalize">{project.source}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Related Projects */}
              <Card className="bg-gradient-to-br from-brand-500/5 to-brand-700/5">
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-2">发现更多项目</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    浏览更多 {project.category} 类别的优秀项目
                  </p>
                  <Link href="/">
                    <Button variant="outline" className="w-full">
                      查看全部
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
