import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, TrendingUp, BarChart3, Lightbulb } from "lucide-react";

export default function ResearchPage() {
  const reports = db.research.findAll();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 border-b">
        <div className="container mx-auto px-4 py-8">
          <a 
            href="/" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 inline-flex items-center gap-1"
          >
            ← 返回首页
          </a>
          <h1 className="text-3xl font-bold mb-2">投研分析</h1>
          <p className="text-muted-foreground">深度解析 AI 行业趋势、技术突破与投资机会</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{reports.length}</p>
                <p className="text-xs text-muted-foreground">研究报告</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">50+</p>
                <p className="text-xs text-muted-foreground">覆盖项目</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">$40B</p>
                <p className="text-xs text-muted-foreground">追踪融资</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">Weekly</p>
                <p className="text-xs text-muted-foreground">更新频率</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["全部", "投资", "技术分析", "行业分析", "市场洞察", "项目评测"].map((cat) => (
            <Badge 
              key={cat} 
              variant={cat === "全部" ? "default" : "secondary"}
              className="cursor-pointer hover:bg-primary/90"
            >
              {cat}
            </Badge>
          ))}
        </div>

        {/* Reports Grid */}
        <div className="grid gap-6">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{report.category}</Badge>
                      {report.tags?.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <CardTitle className="text-xl leading-tight hover:text-blue-500 cursor-pointer transition-colors">
                      {report.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {report.summary}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {report.author || "NewClaw Research"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {report.readTime || "10 分钟"}
                    </span>
                  </div>
                  <span>{new Date(report.publishedAt).toLocaleDateString('zh-CN')}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {reports.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">暂无研究报告</h3>
            <p className="text-muted-foreground">我们正在准备高质量的投研内容，敬请期待...</p>
          </div>
        )}
      </div>
    </div>
  );
}
