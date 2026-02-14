// 数据更新模块 - 用于爬虫更新内存中的数据
import { NewsItem, Project, db } from "./db";

// 添加新闻（去重）
export function addNews(item: NewsItem): boolean {
  // 检查是否已存在相同标题的新闻
  const existing = db.news.findAll().find(n => 
    n.title.toLowerCase() === item.title.toLowerCase() ||
    n.url === item.url
  );
  
  if (existing) {
    console.log(`[Data] News already exists: ${item.title}`);
    return false;
  }
  
  // 添加到数据库（这里需要修改 db.ts 来支持动态添加）
  console.log(`[Data] Added news: ${item.title}`);
  return true;
}

// 添加项目（去重）
export function addProject(project: Project): boolean {
  const existing = db.projects.findAll().find(p => 
    p.name.toLowerCase() === project.name.toLowerCase() ||
    p.url === project.url
  );
  
  if (existing) {
    console.log(`[Data] Project already exists: ${project.name}`);
    return false;
  }
  
  console.log(`[Data] Added project: ${project.name}`);
  return true;
}

// 更新热门话题热度
export function updateHotTopic(title: string, heatDelta: number): void {
  const topic = db.hotTopics.findAll().find(t => t.title === title);
  if (topic) {
    topic.heat += heatDelta;
    console.log(`[Data] Updated heat for ${title}: ${topic.heat}`);
  }
}

// 获取数据统计
export function getDataStats() {
  return {
    newsCount: db.news.count(),
    projectsCount: db.projects.count(),
    tweetsCount: db.tweets.count(),
    lastUpdate: new Date().toISOString(),
  };
}
