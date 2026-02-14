import Link from "next/link";
import { Github, Twitter, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="font-bold text-xl">NewClaw</span>
            </div>
            <p className="text-sm text-muted-foreground">
              专业的 AI 新闻聚合、投研分析与创意孵化平台
            </p>
            <div className="flex items-center gap-4">
              <Link href="https://github.com" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="w-5 h-5" />
              </Link>
              <Link href="https://twitter.com" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="http://t.me/newclaw" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <MessageCircle className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4">产品</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  AI 快讯
                </Link>
              </li>
              <li>
                <Link href="/research" className="text-muted-foreground hover:text-foreground transition-colors">
                  投研分析
                </Link>
              </li>
              <li>
                <Link href="/incubator" className="text-muted-foreground hover:text-foreground transition-colors">
                  创意孵化
                </Link>
              </li>
              <li>
                <Link href="/hot" className="text-muted-foreground hover:text-foreground transition-colors">
                  热点追踪
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">资源</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/api" className="text-muted-foreground hover:text-foreground transition-colors">
                  API 文档
                </Link>
              </li>
              <li>
                <Link href="/rss" className="text-muted-foreground hover:text-foreground transition-colors">
                  RSS 订阅
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  关于我们
                </Link>
              </li>
            </ul>
          </div>

          {/* Subscribe */}
          <div>
            <h4 className="font-semibold mb-4">订阅更新</h4>
            <p className="text-sm text-muted-foreground mb-4">
              获取每日 AI 行业精选资讯
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="输入邮箱"
                className="flex-1 px-3 py-2 rounded-md border bg-background text-sm"
              />
              <button className="px-4 py-2 bg-brand-600 text-white rounded-md text-sm font-medium hover:bg-brand-700 transition-colors">
                订阅
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2026 NewClaw Pro. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">隐私政策</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">服务条款</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
