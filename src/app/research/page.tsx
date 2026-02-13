import { Sparkles, TrendingUp, FileText, BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FundingCard } from "@/components/funding-card";
import { StatsCard } from "@/components/stats-card";

const fundingData = [
  {
    id: "f1",
    companyName: "Anthropic",
    amount: "35亿",
    round: "E轮",
    date: "2026-02-12",
    investors: ["Lightspeed", "Amazon", "Google"],
    category: "大模型",
    description: "Claude 开发商，专注于 AI 安全和对齐研究",
  },
  {
    id: "f2",
    companyName: "Character.AI",
    amount: "25亿",
    round: "收购",
    date: "2026-02-10",
    investors: ["Google"],
    category: "AI 对话",
    description: "AI 角色扮演和对话平台，拥有超过 2000 万用户",
  },
  {
    id: "f3",
    companyName: "Perplexity",
    amount: "5亿",
    round: "C轮",
    date: "2026-02-08",
    investors: ["IVP", "NEA", "NVIDIA"],
    category: "AI 搜索",
    description: "AI 驱动的搜索引擎，月活用户突破 5000 万",
  },
  {
    id: "f4",
    companyName: "Figure AI",
    amount: "6.75亿",
    round: "B轮",
    date: "2026-02-05",
    investors: ["Microsoft", "OpenAI", "NVIDIA"],
    category: "机器人",
    description: "人形机器人公司，专注于具身智能研究",
  },
];

const sectorTrends = [
  {
    sector: "大模型",
    investment: "$12.5B",
    growth: 45,
    deals: 23,
    topCompanies: ["OpenAI", "Anthropic", "Cohere"],
  },
  {
    sector: "AI Agent",
    investment: "$8.3B",
    growth: 128,
    deals: 67,
    topCompanies: ["AutoGPT", "LangChain", "CrewAI"],
  },
  {
    sector: "具身智能",
    investment: "$4.2B",
    growth: 89,
    deals: 34,
    topCompanies: ["Figure AI", "1X", "Apptronik"],
  },
  {
    sector: "AI 芯片",
    investment: "$6.8B",
    growth: 23,
    deals: 18,
    topCompanies: ["Cerebras", "SambaNova", "Groq"],
  },
  {
    sector: "视频生成",
    investment: "$2.1B",
    growth: 156,
    deals: 28,
    topCompanies: ["Runway", "Pika", "HeyGen"],
  },
];

const researchReports = [
  {
    id: "r1",
    title: "2026 AI 投资趋势报告：Agent 赛道成为新宠",
    summary: "本报告分析了 2026 年 Q1 AI 领域的投资趋势，AI Agent 赛道融资额同比增长 128%。",
    date: "2026-02-13",
    readTime: "15 分钟",
    tags: ["投资", "趋势", "Agent"],
  },
  {
    id: "r2",
    title: "大模型商业化深度分析：从 API 到垂直应用",
    summary: "探讨大模型厂商的商业模式演进，以及垂直领域应用的机会与挑战。",
    date: "2026-02-10",
    readTime: "20 分钟",
    tags: ["大模型", "商业化", "B2B"],
  },
  {
    id: "r3",
    title: "具身智能：下一个万亿级市场",
    summary: "人形机器人与具身智能的技术进展、市场规模预测和投资机会分析。",
    date: "2026-02-08",
    readTime: "25 分钟",
    tags: ["机器人", "具身智能", "硬件"],
  },
];

const stats = [
  { title: "本月融资总额", value: "$28.5B", change: 34.2, icon: <TrendingUp className="w-5 h-5" /> },
  { title: "融资事件数", value: "156", change: 12.8, icon: <FileText className="w-5 h-5" /> },
  { title: "平均单笔融资", value: "$183M", change: 18.5, icon: <BarChart3 className="w-5 h-5" /> },
  { title: "活跃投资机构", value: "89", change: 5.3, icon: <Sparkles className="w-5 h-5" /> },
];

export default function ResearchPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-brand-500/10">
            <Sparkles className="w-8 h-8 text-brand-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">AI 投研</h1>
            <p className="text-muted-foreground">深度分析 AI 行业投资趋势、赛道研究和项目评估</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>

        <Tabs defaultValue="funding" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="funding">融资动态</TabsTrigger>
            <TabsTrigger value="sectors">赛道趋势</TabsTrigger>
            <TabsTrigger value="reports">研究报告</TabsTrigger>
          </TabsList>

          <TabsContent value="funding" className="space-y-6">
            <h2 className="text-xl font-bold">最新融资</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fundingData.map((funding) => (
                <FundingCard key={funding.id} {...funding} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sectors">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sectorTrends.map((sector) => (
                <Card key={sector.sector} className="card-hover">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{sector.sector}</CardTitle>
                      <span
                        className={`text-sm font-medium ${
                          sector.growth > 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {sector.growth > 0 ? "+" : ""}
                        {sector.growth}%
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">投资总额</span>
                      <span className="font-semibold">{sector.investment}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">交易数量</span>
                      <span className="font-semibold">{sector.deals}</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">头部公司</span>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {sector.topCompanies.map((company) => (
                          <span
                            key={company}
                            className="text-xs px-2 py-0.5 rounded-full bg-muted"
                          >
                            {company}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <div className="space-y-4">
              {researchReports.map((report) => (
                <Card key={report.id} className="card-hover cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{report.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {report.summary}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{report.date}</span>
                          <span>⏱️ {report.readTime}</span>
                          <div className="flex gap-2">
                            {report.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-2 py-0.5 rounded-full bg-muted"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
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
