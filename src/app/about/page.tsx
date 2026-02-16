"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Target, 
  Zap,
  Globe, 
  Users, 
  Github, 
  Twitter, 
  Mail,
  MessageCircle,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b bg-gradient-to-br from-brand-500/5 via-background to-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 text-brand-600 mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">关于 NewClaw</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              New Claw, New World
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              构建最专业的 AI 新闻聚合与投研平台，
              <br />
              让优质 AI 资讯触手可及
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-brand-500" />
                </div>
                <CardTitle>我们的使命</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                在 AI 技术飞速发展的时代，信息爆炸让优质内容被淹没。NewClaw 致力于通过 AI 技术智能聚合、
                筛选和解读全球 AI 资讯，帮助开发者和投资者快速获取有价值的信息，
                把握技术趋势和投资机会。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-blue-500" />
                </div>
                <CardTitle>我们的愿景</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                成为 AI 领域最值得信赖的信息枢纽，连接全球 AI 从业者和爱好者。
                通过技术创新和社区共建，推动 AI 知识的传播和普及，
                助力 AI 生态的繁荣发展。
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Core Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">核心功能</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "AI 快讯",
                description: "聚合 110+ 顶级技术博客和媒体，AI 智能评分筛选，实时追踪 AI 行业动态",
                color: "text-yellow-500",
                bgColor: "bg-yellow-500/10",
              },
              {
                icon: Target,
                title: "投研分析",
                description: "深度解析 AI 行业趋势、技术突破与投资机会，专业研究报告每周更新",
                color: "text-brand-500",
                bgColor: "bg-brand-500/10",
              },
              {
                icon: Sparkles,
                title: "创意孵化",
                description: "发现优质 AI 项目，展示创意灵感，连接开发者和投资者",
                color: "text-purple-500",
                bgColor: "bg-purple-500/10",
              },
            ].map((feature) => (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-16">
          <Card className="bg-gradient-to-br from-brand-500/5 to-blue-500/5">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  { value: "110+", label: "RSS 数据源" },
                  { value: "48", label: "Twitter 账号" },
                  { value: "20+", label: "每日新闻" },
                  { value: "100%", label: "AI 智能处理" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-3xl md:text-4xl font-bold text-brand-500 mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Sources */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">数据来源</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">英文数据源</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-brand-500" />
                    OpenAI Blog, Google AI Blog, Anthropic Research
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-brand-500" />
                    TechCrunch AI, The Verge AI, MIT Technology Review
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-brand-500" />
                    arXiv CS/AI, Hugging Face Blog, DeepMind
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-brand-500" />
                    GitHub Trending, Product Hunt, Hacker News
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">中文数据源</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-brand-500" />
                    机器之心, 量子位, 智东西
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-brand-500" />
                    雷锋网 AI, 36氪 AI, 钛媒体
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-brand-500" />
                    阿里云开发者, 腾讯云开发者, CSDN AI
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-brand-500" />
                    知乎 AI 话题, 掘金 AI 专栏
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">联系我们</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="http://t.me/newclaw" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                Telegram 社区
              </Button>
            </Link>
            <Link href="https://twitter.com/newclaw" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2">
                <Twitter className="w-4 h-4" />
                Twitter
              </Button>
            </Link>
            <Link href="https://github.com/btcloong/newclaw-pro" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2">
                <Github className="w-4 h-4" />
                GitHub
              </Button>
            </Link>
            <Button variant="outline" className="gap-2">
              <Mail className="w-4 h-4" />
              contact@newclaw.com
            </Button>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-gradient-to-br from-brand-500 to-brand-600 text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">加入 NewClaw 社区</h2>
              <p className="text-white/80 mb-6 max-w-xl mx-auto">
                与全球 AI 从业者和爱好者一起，探索人工智能的无限可能
              </p>
              <Link href="http://t.me/newclaw" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="secondary" className="gap-2">
                  <MessageCircle className="w-5 h-5" />
                  加入 Telegram 社区
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
