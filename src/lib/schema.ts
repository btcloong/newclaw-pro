import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// 新闻表
export const news = sqliteTable("news", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary"),
  content: text("content"),
  image: text("image"),
  source: text("source").notNull(),
  sourceUrl: text("source_url"),
  category: text("category"),
  tags: text("tags"), // JSON string
  author: text("author"),
  publishedAt: integer("published_at", { mode: "timestamp" }).notNull(),
  fetchedAt: integer("fetched_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  viewCount: integer("view_count").default(0),
  isHot: integer("is_hot", { mode: "boolean" }).default(false),
  isFeatured: integer("is_featured", { mode: "boolean" }).default(false),
});

// 项目表
export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  fullDescription: text("full_description"),
  logo: text("logo"),
  category: text("category").notNull(),
  tags: text("tags"), // JSON string
  source: text("source").notNull(), // github, producthunt, other
  sourceUrl: text("source_url").notNull(),
  stars: integer("stars"),
  forks: integer("forks"),
  upvotes: integer("upvotes"),
  language: text("language"),
  license: text("license"),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
  fetchedAt: integer("fetched_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  isNew: integer("is_new", { mode: "boolean" }).default(false),
  isTrending: integer("is_trending", { mode: "boolean" }).default(false),
});

// 研究报告表
export const research = sqliteTable("research", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary"),
  content: text("content"),
  category: text("category").notNull(),
  tags: text("tags"), // JSON string
  author: text("author"),
  readTime: text("read_time"),
  publishedAt: integer("published_at", { mode: "timestamp" }).notNull(),
  fetchedAt: integer("fetched_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  viewCount: integer("view_count").default(0),
});

// 快讯表
export const flashNews = sqliteTable("flash_news", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  source: text("source").notNull(),
  sourceUrl: text("source_url"),
  isImportant: integer("is_important", { mode: "boolean" }).default(false),
  publishedAt: integer("published_at", { mode: "timestamp" }).notNull(),
  fetchedAt: integer("fetched_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// 热搜话题表
export const hotTopics = sqliteTable("hot_topics", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  heat: integer("heat").notNull(),
  change: integer("change").default(0),
  category: text("category"),
  rank: integer("rank").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// 融资信息表
export const funding = sqliteTable("funding", {
  id: text("id").primaryKey(),
  companyName: text("company_name").notNull(),
  amount: text("amount").notNull(),
  round: text("round").notNull(),
  date: text("date").notNull(),
  investors: text("investors"), // JSON string
  category: text("category"),
  description: text("description"),
  fetchedAt: integer("fetched_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// 抓取日志表
export const crawlLogs = sqliteTable("crawl_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  source: text("source").notNull(),
  status: text("status").notNull(), // success, error
  message: text("message"),
  itemsCount: integer("items_count").default(0),
  startedAt: integer("started_at", { mode: "timestamp" }).notNull(),
  completedAt: integer("completed_at", { mode: "timestamp" }),
});
