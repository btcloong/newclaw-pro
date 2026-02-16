import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, FileText, Cookie, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "隐私政策 - NewClaw",
  description: "了解 NewClaw 如何收集、使用和保护您的个人信息。",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 text-brand-600 mb-6">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">隐私政策</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              隐私政策
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
                NewClaw（"我们"、"我们的"或"本平台"）高度重视用户的隐私保护。
                本隐私政策旨在向您说明我们如何收集、使用、存储和保护您的个人信息。
                使用我们的服务即表示您同意本隐私政策的条款。
              </p>
            </CardContent>
          </Card>

          {/* Sections */}
          {[
            {
              icon: Eye,
              title: "信息收集",
              content: [
                {
                  subtitle: "自动收集的信息",
                  text: "当您访问我们的网站时，我们可能会自动收集某些信息，包括您的IP地址、浏览器类型、操作系统、访问时间、浏览的页面以及引荐来源。",
                },
                {
                  subtitle: "您提供的信息",
                  text: "当您订阅我们的邮件列表、加入社区或联系我们时，我们可能会收集您的邮箱地址、姓名和其他您自愿提供的信息。",
                },
                {
                  subtitle: "Cookie 和类似技术",
                  text: "我们使用 Cookie 和类似技术来增强用户体验、分析网站使用情况并个性化内容。您可以通过浏览器设置管理 Cookie 偏好。",
                },
              ],
            },
            {
              icon: FileText,
              title: "信息使用",
              content: [
                {
                  subtitle: "服务提供",
                  text: "我们使用收集的信息来提供、维护和改进我们的服务，包括个性化内容推荐和发送订阅邮件。",
                },
                {
                  subtitle: "分析和研究",
                  text: "我们分析用户行为以了解网站使用情况，优化用户体验，并进行市场研究。",
                },
                {
                  subtitle: "沟通",
                  text: "我们可能会使用您的联系信息向您发送服务更新、新闻通讯和营销信息（您可以随时退订）。",
                },
              ],
            },
            {
              icon: Lock,
              title: "信息保护",
              content: [
                {
                  subtitle: "安全措施",
                  text: "我们采取适当的技术和组织措施来保护您的个人信息，防止未经授权的访问、使用或泄露。",
                },
                {
                  subtitle: "数据存储",
                  text: "您的数据存储在安全的服务器上，我们使用加密技术保护敏感信息的传输。",
                },
                {
                  subtitle: "数据保留",
                  text: "我们仅在必要的期限内保留您的个人信息，以实现本隐私政策中描述的目的。",
                },
              ],
            },
            {
              icon: Shield,
              title: "信息共享",
              content: [
                {
                  subtitle: "第三方服务提供商",
                  text: "我们可能会与可信赖的第三方服务提供商共享信息，以协助我们运营网站和提供服务。这些提供商有义务保护您的信息。",
                },
                {
                  subtitle: "法律要求",
                  text: "我们可能会在法律要求或为了保护我们的权利、财产或安全时披露您的信息。",
                },
                {
                  subtitle: "业务转让",
                  text: "如果发生合并、收购或资产出售，您的信息可能会作为交易的一部分被转让。",
                },
              ],
            },
            {
              icon: Cookie,
              title: "您的权利",
              content: [
                {
                  subtitle: "访问和更正",
                  text: "您有权访问我们持有的关于您的个人信息，并要求更正任何不准确的信息。",
                },
                {
                  subtitle: "删除",
                  text: "在某些情况下，您可以要求删除您的个人信息。",
                },
                {
                  subtitle: "退订",
                  text: "您可以随时退订我们的邮件列表，通过邮件中的退订链接或联系我们。",
                },
              ],
            },
          ].map((section) => (
            <Card key={section.title}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-brand-500" />
                  </div>
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.content.map((item) => (
                  <div key={item.subtitle}>
                    <h4 className="font-semibold mb-1">{item.subtitle}</h4>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </div>
                ))}
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
                如果您对本隐私政策有任何疑问或 concerns，请通过以下方式联系我们：
              </p>
              <ul className="space-y-2 text-sm">
                <li>邮箱：privacy@newclaw.com</li>
                <li>Telegram：http://t.me/newclaw</li>
                <li>地址：[您的公司地址]</li>
              </ul>
            </CardContent>
          </Card>

          {/* Updates */}
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">
                我们可能会不时更新本隐私政策。任何更改将在本页面发布，重大变更我们会通过邮件通知您。
                建议您定期查看本页面以了解最新的隐私保护措施。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
