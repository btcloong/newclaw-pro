import { Lightbulb, Wrench, BookOpen, Zap, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { IdeaCard } from "@/components/idea-card";
import { ProjectCard } from "@/components/project-card";

const ideas = [
  {
    id: "i1",
    title: "AI 个人知识管家",
    description: "构建一个基于 LLM 的个人知识管理系统，自动整理笔记、文章、书签，并支持自然语言查询。",
    category: "创意" as const,
    tags: ["知识管理", "LLM", "个人效率"],
    difficulty: "进阶" as const,
    estimatedTime: "2-3 周",
    likes: 234,
  },
  {
    id: "i2",
    title: "AI 辅助代码审查工具",
    description: "开发一个 VS Code 插件，利用 AI 自动检测代码中的潜在问题、安全漏洞和性能瓶颈。",
    category: "工具" as const,
    tags: ["开发工具", "代码质量", "安全"],
    difficulty: "高级" as const,
    estimatedTime: "1-2 月",
    likes: 189,
  },
  {
    id: "i3",
    title: "AI 播客生成器",
    description: "将长篇文章或文档自动转换为播客脚本，并使用 TTS 技术生成音频。",
    category: "案例" as const,
    tags: ["内容创作", "TTS", "音频"],
    difficulty: "入门" as const,
    estimatedTime: "1 周",
    likes: 156,
  },
  {
    id: "i4",
    title: "多 Agent 协作工作流",
    description: "设计一个多 Agent 系统，让不同专长的 AI Agent 协作完成复杂任务。",
    category: "教程" as const,
    tags: ["Agent", "工作流", "系统设计"],
    difficulty: "高级" as const,
    estimatedTime: "3-4 周",
    likes: 312,
  },
  {
    id: "i5",
    title: "AI 驱动的客户支持系统",
    description: "构建智能客服系统，支持多轮对话、情感分析和自动工单生成。",
    category: "案例" as const,
    tags: ["客服", "对话系统", "企业应用"],
    difficulty: "进阶" as const,
    estimatedTime: "2-3 周",
    likes: 178,
  },
  {
    id: "i6",
    title: "AI 数据可视化助手",
    description: "自然语言描述数据需求，自动生成图表和洞察报告。",
    category: "工具" as const,
    tags: ["数据可视化", "分析", "BI"],
    difficulty: "进阶" as const,
    estimatedTime: "2 周",
    likes: 145,
  },
];

const recommendedTools = [
  {
    id: "t1",
    name: "LangChain",
    description: "构建 LLM 应用的首选框架，支持链式调用、记忆管理和工具集成",
    category: "开发框架",
    tags: ["Python", "JavaScript", "LLM"],
    stars: 98000,
    source: "github" as const,
    url: "https://langchain.com",
  },
  {
    id: "t2",
    name: "LlamaIndex",
    description: "数据框架，用于将私有数据连接到 LLM",
    category: "开发框架",
    tags: ["RAG", "向量数据库", "Python"],
    stars: 45000,
    source: "github" as const,
    url: "https://llamaindex.ai",
  },
  {
    id: "t3",
    name: "CrewAI",
    description: "多 Agent 协作框架，轻松构建 Agent 团队",
    category: "Agent 框架",
    tags: ["Agent", "协作", "自动化"],
    stars: 23000,
    source: "github" as const,
    url: "https://crewai.io",
  },
  {
    id: "t4",
    name: "Vercel AI SDK",
    description: "构建 AI 驱动流式 UI 的 Toolkit",
    category: "UI 框架",
    tags: ["React", "流式", "UI"],
    stars: 12000,
    source: "github" as const,
    url: "https://sdk.vercel.ai",
  },
];

const showcaseProjects = [
  {
    id: "s1",
    name: "AI 写作助手",
    description: "基于 GPT-4 的长文写作助手，支持大纲生成、段落扩展和风格调整",
    category: "内容创作",
    tags: ["写作", "GPT-4", "生产力"],
    upvotes: 3200,
    source: "producthunt" as const,
    url: "#",
    isTrending: true,
  },
  {
    id: "s2",
    name: "智能会议纪要",
    description: "自动转录会议录音，生成结构化纪要和行动项",
    category: "生产力",
    tags: ["会议", "语音", "自动化"],
    upvotes: 2800,
    source: "producthunt" as const,
    url: "#",
  },
  {
    id: "s3",
    name: "AI 面试官",
    description: "模拟技术面试，提供实时反馈和改进建议",
    category: "教育",
    tags: ["面试", "学习", "编程"],
    upvotes: 2100,
    source: "producthunt" as const,
    url: "#",
  },
];

export default function IncubatorPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-500/10">
              <Lightbulb className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">AI 创意孵化</h1>
              <p className="text-muted-foreground">发现灵感、学习工具、展示作品</p>
            </div>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            提交创意
          </Button>
        </div>

        <Tabs defaultValue="ideas" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
            <TabsTrigger value="ideas" className="gap-2">
              <Lightbulb className="w-4 h-4" />
              创意库
            </TabsTrigger>
            <TabsTrigger value="tools" className="gap-2">
              <Wrench className="w-4 h-4" />
              工具推荐
            </TabsTrigger>
            <TabsTrigger value="showcase" className="gap-2">
              <Zap className="w-4 h-4" />
              案例展示
            </TabsTrigger>
            <TabsTrigger value="tutorials" className="gap-2">
              <BookOpen className="w-4 h-4" />
              教程
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ideas">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ideas.map((idea) => (
                <IdeaCard key={idea.id} {...idea} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tools">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedTools.map((tool) => (
                <ProjectCard key={tool.id} {...tool} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="showcase">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {showcaseProjects.map((project) => (
                <ProjectCard key={project.id} {...project} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tutorials">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ideas
                .filter((i) => i.category === "教程")
                .map((tutorial) => (
                  <IdeaCard key={tutorial.id} {...tutorial} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
