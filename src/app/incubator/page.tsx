"use client";

import { Lightbulb, Wrench, BookOpen, Zap, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ideas = [
  {
    id: "i1",
    title: "AI 个人知识管家",
    description: "构建一个基于 LLM 的个人知识管理系统，自动整理笔记、文章、书签。",
    category: "创意",
    tags: ["知识管理", "LLM"],
    difficulty: "进阶",
    likes: 234,
  },
  {
    id: "i2",
    title: "AI 辅助代码审查工具",
    description: "开发 VS Code 插件，利用 AI 自动检测代码问题、安全漏洞。",
    category: "工具",
    tags: ["开发工具", "代码质量"],
    difficulty: "高级",
    likes: 189,
  },
];

export default function IncubatorPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-amber-500/10">
            <Lightbulb className="w-8 h-8 text-amber-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">AI 创意孵化</h1>
            <p className="text-muted-foreground">发现灵感、学习工具、展示作品</p>
          </div>
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

          <TabsContent value="ideas">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ideas.map((idea) => (
                <Card key={idea.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{idea.title}</CardTitle>
                      <Badge>{idea.difficulty}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{idea.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {idea.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-1 rounded-full bg-muted">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tools">
            <div className="text-center py-12 text-muted-foreground">
              工具推荐内容即将上线
            </div>
          </TabsContent>

          <TabsContent value="showcase">
            <div className="text-center py-12 text-muted-foreground">
              案例展示内容即将上线
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
