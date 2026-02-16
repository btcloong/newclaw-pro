"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Code, 
  Copy, 
  ExternalLink,
  Terminal,
  Globe,
  Key,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

export default function ApiDocsPage() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b bg-gradient-to-br from-brand-500/5 via-background to-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 text-brand-600 mb-6">
              <Code className="w-4 h-4" />
              <span className="text-sm font-medium">API 文档</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              NewClaw API
            </h1>
            <p className="text-lg text-muted-foreground">
              通过 API 获取 AI 新闻、Twitter 动态和热点数据
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Base URL */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-brand-500" />
                </div>
                <CardTitle>基础 URL</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <code className="text-sm">https://newclaw.com/api</code>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-auto"
                  onClick={() => copyToClipboard("https://newclaw.com/api")}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Endpoints */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">API 端点</h2>
            
            {/* GET /api/news */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="font-mono">GET</Badge>
                  <code className="text-lg font-semibold">/api/news</code>
                </div>
                <p className="text-muted-foreground mt-2">获取 AI 新闻列表</p>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div>
                  <h4 className="font-semibold mb-3">参数</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-2">名称</th>
                          <th className="text-left py-2 px-2">类型</th>
                          <th className="text-left py-2 px-2">必需</th>
                          <th className="text-left py-2 px-2">描述</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 px-2 font-mono">limit</td>
                          <td className="py-2 px-2">number</td>
                          <td className="py-2 px-2"><Badge variant="outline" className="text-xs">否</Badge></td>
                          <td className="py-2 px-2">返回数量，默认 20</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 px-2 font-mono">category</td>
                          <td className="py-2 px-2">string</td>
                          <td className="py-2 px-2"><Badge variant="outline" className="text-xs">否</Badge></td>
                          <td className="py-2 px-2">分类筛选</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-2 font-mono">isHot</td>
                          <td className="py-2 px-2">boolean</td>
                          <td className="py-2 px-2"><Badge variant="outline" className="text-xs">否</Badge></td>
                          <td className="py-2 px-2">仅热门，默认 false</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">响应示例</h4>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard('{\n  "success": true,\n  "data": [...]\n}')}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      复制
                    </Button>
                  </div>
                  <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                    <code className="text-sm">{`{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "...",
      "chineseTitle": "...",
      "category": "AI/ML",
      "source": "OpenAI Blog",
      "publishedAt": "2026-02-16T05:24:37.010Z",
      "isHot": true,
      "aiScores": {
        "relevance": 10,
        "quality": 9,
        "timeliness": 10,
        "overall": 9.7
      }
    }
  ]
}`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* GET /api/twitter */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="font-mono">GET</Badge>
                  <code className="text-lg font-semibold">/api/twitter</code>
                </div>
                <p className="text-muted-foreground mt-2">获取 Twitter AI 动态</p>
              </CardHeader>
              <CardContent className="pt-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">响应示例</h4>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard('{\n  "success": true,\n  "tweets": [...]\n}')}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      复制
                    </Button>
                  </div>
                  <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                    <code className="text-sm">{`{
  "success": true,
  "tweets": [
    {
      "id": "tw_1",
      "content": "...",
      "author": {
        "name": "Andrej Karpathy",
        "username": "karpathy",
        "verified": true
      },
      "likes": 15420,
      "publishedAt": "2026-02-16T05:24:37.011Z",
      "aiAnalysis": {
        "chineseSummary": "...",
        "importance": "high"
      }
    }
  ]
}`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* GET /api/sources */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="font-mono">GET</Badge>
                  <code className="text-lg font-semibold">/api/sources</code>
                </div>
                <p className="text-muted-foreground mt-2">获取 RSS 源统计信息</p>
              </CardHeader>
              <CardContent className="pt-6">
                <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                  <code className="text-sm">{`{
  "success": true,
  "stats": {
    "total": 116,
    "english": 79,
    "chinese": 37,
    "highPriority": 21,
    "mediumPriority": 64,
    "lowPriority": 31
  }
}`}</code>
                </pre>
              </CardContent>
            </Card>
          </div>

          {/* Example Usage */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-green-500" />
                </div>
                <CardTitle>使用示例</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">cURL</h4>
                <div className="relative">
                  <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                    <code className="text-sm">curl -X GET &quot;https://newclaw.com/api/news?limit=10&quot;</code>
                  </pre>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard('curl -X GET "https://newclaw.com/api/news?limit=10"')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">JavaScript</h4>
                <div className="relative">
                  <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const response = await fetch('https://newclaw.com/api/news?limit=10');
const data = await response.json();
console.log(data.data);`}</code>
                  </pre>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(`const response = await fetch('https://newclaw.com/api/news?limit=10');
const data = await response.json();
console.log(data.data);`)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* GitHub */}
          <Card className="bg-gradient-to-br from-brand-500/5 to-blue-500/5">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-brand-500/20 flex items-center justify-center">
                  <Code className="w-8 h-8 text-brand-500" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold mb-2">开源项目</h3>
                  <p className="text-muted-foreground">
                    NewClaw 是开源项目，欢迎 Star 和贡献代码
                  </p>
                </div>
                <Link 
                  href="https://github.com/btcloong/newclaw-pro" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button className="gap-2">
                    <ExternalLink className="w-4 h-4" />
                    查看 GitHub
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
