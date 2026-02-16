import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  Rocket, 
  Users, 
  Zap,
  ExternalLink,
  Github,
  Star,
  ArrowRight,
  Sparkles,
  Target,
  TrendingUp,
  MessageCircle
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "创意孵化 - NewClaw",
  description: "发现 AI 创意项目，展示你的作品，连接开发者和投资者。",
};

export default function IncubatorPage() {
  const categories = [
    { name: "全部", count: 24, active: true },
    { name: "开发工具", count: 8, active: false },
    { name: "AI 应用", count: 6, active: false },
    { name: "创意项目", count: 5, active: false },
    { name: "开源项目", count: 5, active: false },
  ];

  const projects = [
    {
      id: 1,
      name: "AI Code Reviewer",
      description: "基于大语言模型的智能代码审查工具，支持多种编程语言，能够自动检测代码缺陷、安全漏洞和性能问题。",
      category: "开发工具",
      tags: ["代码审查", "AI", "开发者工具"],
      stars: 1280,
      author: "@dev_ai",
      stage: "已发布",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400",
    },
    {
      id: 2,
      name: "ChatPDF Pro",
      description: "让 AI 帮你阅读和理解 PDF 文档，支持多语言、多文档对比分析，学术研究者的得力助手。",
      category: "AI 应用",
      tags: ["PDF", "文档处理", "学术研究"],
      stars: 856,
      author: "@pdf_master",
      stage: "Beta",
      image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=400",
    },
    {
      id: 3,
      name: "VoiceClone Studio",
      description: "开源的声音克隆工具，只需几秒钟的音频样本即可克隆声音，支持实时语音转换和文本转语音。",
      category: "开源项目",
      tags: ["语音克隆", "TTS", "开源"],
      stars: 2340,
      author: "@voice_ai",
      stage: "已发布",
      image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400",
    },
    {
      id: 4,
      name: "AI Story Generator",
      description: "创作助手，帮助作家生成故事情节、角色设定和对话，支持多种文学风格和题材。",
      category: "创意项目",
      tags: ["创作", "故事", "写作助手"],
      stars: 567,
      author: "@story_ai",
      stage: "内测",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400",
    },
    {
      id: 5,
      name: "Smart Meeting Notes",
      description: "自动记录和总结会议内容，提取行动项和关键决策，与主流会议软件无缝集成。",
      category: "AI 应用",
      tags: ["会议", "生产力", "自动化"],
      stars: 923,
      author: "@meeting_ai",
      stage: "已发布",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400",
    },
    {
      id: 6,
      name: "Prompt Engineering Hub",
      description: "提示词工程学习和实践平台，提供丰富的提示词模板、优化技巧和最佳实践案例。",
      category: "开发工具",
      tags: ["Prompt", "学习", "工具"],
      stars: 1543,
      author: "@prompt_master",
      stage: "已发布",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
    },
  ];

  const resources = [
    {
      title: "项目提交指南",
      description: "了解如何提交你的 AI 项目到 NewClaw 孵化平台",
      icon: Rocket,
      link: "#",
    },
    {
      title: "开发者社区",
      description: "加入 Telegram 社区，与其他开发者交流经验",
      icon: Users,
      link: "http://t.me/newclaw",
    },
    {
      title: "投资对接",
      description: "寻找投资机会，连接 AI 领域的投资人",
      icon: TrendingUp,
      link: "#",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b bg-gradient-to-br from-purple-500/5 via-background to-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 mb-6">
              <Lightbulb className="w-4 h-4" />
              <span className="text-sm font-medium">创意孵化</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              发现下一个 AI 独角兽
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              展示你的 AI 创意项目，连接开发者和投资者，
              <br />
              让好想法变成现实
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="gap-2">
                <Rocket className="w-4 h-4" />
                提交项目
              </Button>
              <Link href="http://t.me/newclaw" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  <MessageCircle className="w-4 h-4" />
                  加入社区
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { value: "24", label: "孵化项目", icon: Lightbulb },
            { value: "8", label: "已发布", icon: Rocket },
            { value: "156", label: "开发者", icon: Users },
            { value: "$2.5M", label: "获得投资", icon: Zap },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6 text-center">
                <stat.icon className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <Button
              key={cat.name}
              variant={cat.active ? "default" : "outline"}
              size="sm"
            >
              {cat.name}
              <span className="ml-2 text-xs opacity-60">{cat.count}</span>
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${project.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-purple-500 text-white">
                    {project.category}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {project.stage}
                  </Badge>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-bold text-white mb-1">{project.name}</h3>
                  <p className="text-sm text-white/80">{project.author}</p>
                </div>
              </div>
              
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {project.stars}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Github className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Submit CTA */}
        <Card className="bg-gradient-to-br from-purple-500 to-brand-600 text-white mb-12">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                <Rocket className="w-8 h-8" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2">有 AI 项目想要展示？</h2>
                <p className="text-white/80">
                  提交你的项目到 NewClaw 孵化平台，获得曝光、反馈和潜在投资机会
                </p>
              </div>
              <Button size="lg" variant="secondary" className="gap-2">
                提交项目
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resources */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <Link key={resource.title} href={resource.link}>
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                    <resource.icon className="w-6 h-6 text-purple-500" />
                  </div>
                  <h3 className="font-bold mb-2">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
