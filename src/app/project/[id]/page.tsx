import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ExternalLink, 
  Github, 
  Star, 
  ArrowLeft,
  Users,
  Calendar,
  Tag,
  Globe,
  MessageCircle
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const projectsData: Record<string, {
  name: string;
  description: string;
  fullDescription: string;
  category: string;
  tags: string[];
  stars: number;
  forks: number;
  author: string;
  authorAvatar: string;
  stage: string;
  createdAt: string;
  website?: string;
  github?: string;
  demo?: string;
  features: string[];
  techStack: string[];
  screenshots: string[];
} > = {
  p1: {
    name: "Cursor",
    description: "AI 驱动的代码编辑器，基于 VS Code，内置 Claude 和 GPT-4 代码补全和聊天功能。",
    fullDescription: `Cursor 是一款基于 VS Code 的 AI 驱动代码编辑器，深度集成了 Claude 和 GPT-4 等大语言模型。

它不仅仅是一个代码编辑器，更是你的 AI 编程助手。Cursor 可以理解你的代码库，回答关于代码的问题，
帮助你重构代码，甚至自动生成完整的函数和类。

主要特点：
- 智能代码补全：基于上下文的代码建议
- AI 聊天：直接在编辑器中与 AI 对话
- 代码解释：选中代码让 AI 解释其功能
- 自动生成：根据注释自动生成代码
- 代码重构：智能重构建议和执行`,
    category: "开发工具",
    tags: ["代码编辑器", "AI", "开发工具", "VS Code"],
    stars: 185000,
    forks: 5200,
    author: "Cursor Inc",
    authorAvatar: "C",
    stage: "已发布",
    createdAt: "2023-03-15",
    website: "https://cursor.sh",
    github: "https://github.com/getcursor/cursor",
    demo: "https://cursor.sh/demo",
    features: [
      "AI 代码补全和生成",
      "智能代码解释",
      "自然语言编辑",
      "代码库问答",
      "多模型支持 (Claude, GPT-4)",
      "VS Code 插件兼容",
    ],
    techStack: ["TypeScript", "Electron", "OpenAI API", "Anthropic API"],
    screenshots: [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800",
    ],
  },
  p2: {
    name: "LangChain",
    description: "构建 LLM 应用的框架，支持多种模型和工具链集成，提供完整的 RAG、Agent 开发工具。",
    fullDescription: `LangChain 是一个用于开发由语言模型驱动的应用程序的框架。

它提供了丰富的组件和工具，帮助开发者构建复杂的 AI 应用，包括：
- 检索增强生成 (RAG)
- AI Agent 和工具使用
- 记忆和上下文管理
- 链式调用和流程编排

LangChain 支持 Python 和 JavaScript/TypeScript，与主流 LLM 提供商无缝集成。`,
    category: "开发框架",
    tags: ["LLM", "框架", "RAG", "Agent"],
    stars: 98000,
    forks: 15600,
    author: "LangChain AI",
    authorAvatar: "L",
    stage: "已发布",
    createdAt: "2022-10-01",
    website: "https://langchain.com",
    github: "https://github.com/langchain-ai/langchain",
    features: [
      "多模型支持",
      "检索增强生成",
      "Agent 框架",
      "记忆管理",
      "工具集成",
      "链式调用",
    ],
    techStack: ["Python", "TypeScript", "OpenAI", "Vector DB"],
    screenshots: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
    ],
  },
  p3: {
    name: "Ollama",
    description: "在本地运行大语言模型的最简单方式，支持 Llama、Mistral、DeepSeek 等模型。",
    fullDescription: `Ollama 让你能够在本地轻松运行大语言模型。

无需复杂的配置，一条命令即可下载和运行模型。支持多种开源模型，包括：
- Llama 2/3
- Mistral
- DeepSeek
- Qwen
- 以及更多

Ollama 提供了简洁的 CLI 和 REST API，方便集成到各种应用中。`,
    category: "开发工具",
    tags: ["本地模型", "开源", "LLM", "工具"],
    stars: 105000,
    forks: 8200,
    author: "Ollama Inc",
    authorAvatar: "O",
    stage: "已发布",
    createdAt: "2023-06-01",
    website: "https://ollama.com",
    github: "https://github.com/ollama/ollama",
    features: [
      "一键运行模型",
      "本地部署",
      "REST API",
      "模型管理",
      "多平台支持",
      "Docker 支持",
    ],
    techStack: ["Go", "C++", "CUDA", "Docker"],
    screenshots: [
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800",
    ],
  },
  p4: {
    name: "ComfyUI",
    description: "基于节点的 Stable Diffusion 图形界面，支持复杂的工作流和自定义节点。",
    fullDescription: `ComfyUI 是一个基于节点的 Stable Diffusion 图形界面。

它使用节点和连接的方式来构建图像生成工作流，提供了极高的灵活性和可定制性：
- 可视化工作流编辑
- 支持自定义节点
- 低显存优化
- 批量生成
- 工作流保存和分享

ComfyUI 适合高级用户和研究者，可以实现复杂的图像生成流程。`,
    category: "图像生成",
    tags: ["Stable Diffusion", "图像生成", "工作流", "UI"],
    stars: 72000,
    forks: 7800,
    author: "comfyanonymous",
    authorAvatar: "C",
    stage: "已发布",
    createdAt: "2023-01-15",
    website: "https://comfyanonymous.github.io/ComfyUI",
    github: "https://github.com/comfyanonymous/ComfyUI",
    features: [
      "节点式工作流",
      "自定义节点",
      "低显存支持",
      "批量生成",
      "工作流分享",
      "插件生态",
    ],
    techStack: ["Python", "PyTorch", "JavaScript", "CSS"],
    screenshots: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
    ],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = projectsData[id];
  
  if (!project) {
    return {
      title: "项目未找到 - NewClaw",
    };
  }

  return {
    title: `${project.name} - NewClaw`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const project = projectsData[id];

  if (!project) {
    notFound();
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start gap-6 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-3xl">{project.authorAvatar}</span>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <Badge className="bg-brand-500 text-white">{project.category}</Badge>
              <Badge variant="secondary">{project.stage}</Badge>
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
            <p className="text-muted-foreground text-lg mb-4">{project.description}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {project.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                创建于 {project.createdAt}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                {formatNumber(project.stars)} stars
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {project.website && (
              <Link href={project.website} target="_blank" rel="noopener noreferrer">
                <Button className="gap-2">
                  <Globe className="w-4 h-4" />
                  访问网站
                </Button>
              </Link>
            )}
            {project.github && (
              <Link href={project.github} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  <Github className="w-4 h-4" />
                  GitHub
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Screenshots */}
            <Card>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                  {project.screenshots.map((screenshot, index) => (
                    <div 
                      key={index}
                      className="aspect-video rounded-lg bg-cover bg-center"
                      style={{ backgroundImage: `url(${screenshot})` }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>项目介绍</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {project.fullDescription.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="text-muted-foreground mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>主要功能</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {project.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tech Stack */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">技术栈</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">标签</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">统计数据</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Stars</span>
                    <span className="font-semibold">{formatNumber(project.stars)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Forks</span>
                    <span className="font-semibold">{formatNumber(project.forks)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">开发阶段</span>
                    <Badge variant="secondary">{project.stage}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="bg-gradient-to-br from-brand-500 to-brand-600 text-white">
              <CardContent className="p-6">
                <h3 className="font-bold mb-2">喜欢这个项目的 idea？</h3>
                <p className="text-sm text-white/80 mb-4">
                  加入 NewClaw 社区，发现更多 AI 创意项目
                </p>
                <Link href="http://t.me/newclaw" target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" className="w-full gap-2">
                    <MessageCircle className="w-4 h-4" />
                    加入社区
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
