import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, Mail } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "服务条款 - NewClaw",
  description: "了解使用 NewClaw 服务的条款和条件。",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 text-brand-600 mb-6">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">服务条款</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              服务条款
            </h1>
            <p className="text-muted-foreground">
              最后更新日期：2026年2月16日
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Introduction */}
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground leading-relaxed">
                欢迎使用 NewClaw！本服务条款（"条款"）约束您对新claw.com网站及相关服务（统称"服务"）的访问和使用。
                使用我们的服务即表示您同意受这些条款的约束。如果您不同意这些条款，请勿使用我们的服务。
              </p>
            </CardContent>
          </Card>

          {/* Sections */}
          {[
            {
              title: "服务描述",
              content: `NewClaw 是一个 AI 新闻聚合与投研平台，提供以下内容：

• AI 行业新闻聚合与筛选
• Twitter AI 动态追踪
• 投研分析报告
• 创意项目展示
• 邮件订阅服务

我们保留随时修改、暂停或终止服务的权利，恕不另行通知。`,
            },
            {
              title: "用户责任",
              content: `使用我们的服务时，您同意：

• 提供准确、完整的信息
• 维护您账户的安全
• 不从事任何非法或未经授权的活动
• 不干扰或破坏服务的正常运行
• 不滥用、骚扰或伤害他人
• 不上传或传播恶意软件、病毒或有害代码

违反这些规定可能导致您的访问权限被终止。`,
            },
            {
              title: "知识产权",
              content: `内容所有权：

• NewClaw 的品牌、标识、界面设计和软件代码归我们所有
• 聚合的新闻内容版权归原作者所有
• AI 生成的摘要和分析归 NewClaw 所有

使用许可：

• 我们授予您有限的、非独占的、不可转让的许可来使用我们的服务
• 您可以分享链接和引用内容，但需注明来源
• 未经书面许可，不得复制、修改或商业化我们的内容`,
            },
            {
              title: "第三方内容",
              content: `我们的服务包含来自第三方的内容：

• 新闻文章链接到原始来源
• Twitter 内容来自公开账号
• 项目信息来自 GitHub 和 Product Hunt

我们不保证第三方内容的准确性、完整性或时效性。
点击外部链接即表示您离开我们的服务，受第三方网站条款的约束。`,
            },
            {
              title: "免责声明",
              content: `我们的服务按"原样"提供，不作任何明示或暗示的保证：

• 我们不保证服务不会中断或无错误
• 我们不保证内容的准确性或可靠性
• 投资建议仅供参考，不构成专业金融建议
• 使用我们的服务的风险由您自行承担

在任何情况下，我们不对因使用或无法使用服务而导致的任何间接、
附带、特殊或后果性损害负责。`,
            },
            {
              title: "条款修改",
              content: `我们保留随时修改这些条款的权利。

• 重大变更将通过邮件或网站公告通知
• 继续使用服务即表示接受修改后的条款
• 建议您定期查看本页面`,
            },
          ].map((section) => (
            <Card key={section.title}>
              <CardHeader>
                <CardTitle className="text-xl">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground whitespace-pre-line">
                  {section.content}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Contact */}
          <Card className="bg-gradient-to-br from-brand-500/5 to-blue-500/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-brand-500" />
                </div>
                <CardTitle className="text-xl">联系我们</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                如果您对这些条款有任何疑问，请通过以下方式联系我们：
              </p>
              <ul className="space-y-2 text-sm">
                <li>邮箱：legal@newclaw.com</li>
                <li>Telegram：http://t.me/newclaw</li>
              </ul>
            </CardContent>
          </Card>

          {/* Agreement */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  使用 NewClaw 服务即表示您已阅读、理解并同意受这些服务条款的约束。
                  如果您代表组织使用服务，您表示有权代表该组织接受这些条款。
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
