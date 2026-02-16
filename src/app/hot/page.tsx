import { db } from "@/lib/db";
import HotPageClient from "./HotPageClient";

export default async function HotPage() {
  // 获取50条新闻用于热点页
  const news = await db.news.findAll({ limit: 50 });
  const hotTopics = await db.hotTopics.findAll();

  return <HotPageClient news={news} hotTopics={hotTopics} />;
}
