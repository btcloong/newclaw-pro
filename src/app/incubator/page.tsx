"use client";

import { useState } from "react";
import { Lightbulb, Wrench, BookOpen, Zap, Plus, Filter, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { IdeaCard } from "@/components/idea-card";

const ideas = [
  {
    id: "i1",
    title: "AI 个人知识管家",
    description: "构建一个基于 LLM 的个人知识管理系统，自动整理笔记、文章、书签，支持智能搜索和知识关联。",
    category: "创意" as const,
    tags: ["知识管理", "LLM", "生产力"],
    difficulty: "进阶" as const,
    estimatedTime: "2-3 周",
    likes: 234,
  },
  {
    id: "i2",
    title: "AI 辅助代码审查工具",
    description: "开发 VS Code 插件，利用 AI 自动检测代码问题、安全漏洞，并提供修复建议。",
    category: "工具" as const,
    tags: ["开发工具", "代码质量", "安全"],
    difficulty: "高级" as const,
    estimatedTime: "1-2 月",
    likes: 189,
  },
  {
    id: "i3",
    title: "多模态内容生成器",
    description: "一站式内容创作平台，支持文本、图像、视频、音频的 AI 辅助生成和编辑。",
    category: "创意" as const,
    tags: ["AIGC", "多模态", "创作工具"],
    difficulty: "高级" as const,
    estimatedTime: "2-3 月",
    likes: 156,
  },
  {
    id: "i4",
    title: "AI 客服智能体",
    description: "基于大语言模型的智能客服系统，支持多轮对话、情感分析和自动工单创建。",
    category: "工具" as const,
    tags: ["客服", "Agent", "自动化"],
    difficulty: "进阶" as const,
    estimatedTime: "3-4 周",
    likes: 142,
  },
  {
    id: "i5",
    title: "个性化学习助手",
    description: "根据用户学习风格和进度，自动生成个性化学习计划和内容推荐。",
    category: "创意" as const,
    tags: ["教育", "个性化", "推荐系统"],
    difficulty: "入门" as const,
    estimatedTime: "1-2 周",
    likes: 128,
  },
  {
    id: "i6",
    title: "AI 数据分析助手",
    description: "自然语言查询数据库，自动生成图表和洞察报告，降低数据分析门槛。",
    category: "工具" as const,
    tags: ["数据分析", "可视化", "BI"],
    difficulty: "进阶" as const,
    estimatedTime: "2-4 周",
    likes: 115,
  },
];

const tools = [
  {
    id: "t1",
    name: "Cursor",
    description: "AI 驱动的代码编辑器，内置 GPT-4 代码补全",
    category: "开发工具",
    tags: ["IDE", "编程", "AI 助手"],
    url: "https://cursor.sh",
    isFree: false,
  },
  {
    id: "t2",
    name: "Claude",
    description: "Anthropic 开发的 AI 助手，擅长长文本处理",
    category: "AI 助手",
    tags: ["聊天", "写作", "分析"],
    url: "https://claude.ai",
    isFree: true,
  },
  {
    id: "t3",
    name: "Midjourney",
    description: "业界领先的 AI 图像生成工具",
    category: "图像生成",
    tags: ["AI 绘画", "设计", "创意"],
    url: "https://midjourney.com",
    isFree: false,
  },
  {
    id: "t4",
    name: "LangChain",
    description: "构建 LLM 应用的开发框架",
    category: "开发框架",
    tags: ["Python", "LLM", "开源"],
    url: "https://langchain.com",
    isFree: true,
  },
  {
    id: "t5",
    name: "Poe",
    description: "聚合多个 AI 模型的聊天平台",
    category: "AI 助手",
    tags: ["聊天", "多模型", "移动端"],
    url: "https://poe.com",
    isFree: true,
  },
  {
    id: "t6",
    name: "Runway",
    description: "AI 视频生成和编辑工具",
    category: "视频生成",
    tags: ["视频", "AI 生成", "创意"],
    url: "https://runwayml.com",
    isFree: false,
  },
];

const showcases = [
  {
    id: "s1",
    title: "AI 驱动的个人博客系统",
    description: "使用 Next.js + OpenAI API 构建的智能博客，支持自动标签、摘要生成和 SEO 优化。",
    author: "张三",
    tags: ["Next.js", "OpenAI", "博客"],
    likes: 89,
    views: 1205,
  },
  {
    id: "s2",
    title: "智能客服机器人",
    description: "基于 RAG 技术的企业客服解决方案，支持多语言和多渠道接入。",
    author: "李四",
    tags: ["RAG", "客服", "企业应用"],
    likes: 76,
    views: 982,
  },
  {
    id: "s3",
    title: "AI 辅助写作工具",
    description: "专为自媒体创作者设计的写作助手，提供选题建议、内容优化和风格调整。",
    author: "王五",
    tags: ["写作", "自媒体", "内容创作"],
    likes: 65,
    views: 756,
  },
];

export default function IncubatorPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         idea.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || idea.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
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
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
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
          </TabsList>

          <TabsContent value="ideas" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="搜索创意..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                {["创意", "工具", "案例"].map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Ideas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIdeas.map((idea) => (
                <IdeaCard key={idea.id} {...idea} />
              ))}
            </div>

            {filteredIdeas.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                没有找到匹配的创意
              </div>
            )}
          </TabsContent>

          <TabsContent value="tools">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.map((tool) => (
                <Card key={tool.id} className="card-hover">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{tool.category}</p>
                      </div>
                      {tool.isFree ? (
                        <Badge variant="success">免费</Badge>
                      ) : (
                        <Badge variant="secondary">付费</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {tool.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full bg-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" className="w-full">访问官网</Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="showcase">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {showcases.map((showcase) => (
                <Card key={showcase.id} className="card-hover">
                  <CardHeader>
                    <CardTitle className="text-lg">{showcase.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {showcase.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {showcase.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full bg-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>作者: {showcase.author}</span>
                      <div className="flex items-center gap-4">
                        <span>❤️ {showcase.likes}</span>
                        <span>👁️ {showcase.views}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
