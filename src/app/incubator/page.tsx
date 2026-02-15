"use client";

import { useState } from "react";
import { Lightbulb, Wrench, Zap, Plus, Search } from "lucide-react";
import Link from "next/link";

export default function IncubatorPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
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
        </div>
        
        <div className="text-center py-12">
          <p className="text-muted-foreground">创意孵化功能正在升级中...</p>
          <Link href="/" className="text-brand-500 hover:underline mt-4 inline-block">
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
