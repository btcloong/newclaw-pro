/**
 * 爬虫 CLI 入口
 * 用于 GitHub Actions 执行
 */

import { 
  crawlAllRSS, 
  crawlByPriority, 
  crawlAuto, 
  processPendingArticles,
  initCrawler,
  getCrawlerStats 
} from "./crawler-new";

async function main() {
  const command = process.argv[2] || "auto";
  
  console.log(`[Crawler] Starting: ${command}`);
  console.log(`[Crawler] Time: ${new Date().toISOString()}`);
  
  try {
    // 初始化
    await initCrawler();
    
    switch (command) {
      case "full":
        console.log("[Crawler] Running FULL crawl (all sources)...");
        const fullResult = await crawlAllRSS();
        console.log("[Crawler] Full crawl completed:", JSON.stringify(fullResult, null, 2));
        process.exit(fullResult.success ? 0 : 1);
        
      case "high":
        console.log("[Crawler] Running HIGH priority crawl...");
        const highResult = await crawlByPriority("high");
        console.log("[Crawler] High priority crawl completed:", JSON.stringify(highResult, null, 2));
        process.exit(highResult.success ? 0 : 1);
        
      case "medium":
        console.log("[Crawler] Running MEDIUM priority crawl...");
        const mediumResult = await crawlByPriority("medium");
        console.log("[Crawler] Medium priority crawl completed:", JSON.stringify(mediumResult, null, 2));
        process.exit(mediumResult.success ? 0 : 1);
        
      case "low":
        console.log("[Crawler] Running LOW priority crawl...");
        const lowResult = await crawlByPriority("low");
        console.log("[Crawler] Low priority crawl completed:", JSON.stringify(lowResult, null, 2));
        process.exit(lowResult.success ? 0 : 1);
        
      case "ai":
        console.log("[Crawler] Processing pending AI articles...");
        const limit = parseInt(process.argv[3] || "10", 10);
        const aiResult = await processPendingArticles(limit);
        console.log("[Crawler] AI processing completed:", JSON.stringify(aiResult, null, 2));
        process.exit(0);
        
      case "stats":
        console.log("[Crawler] Getting stats...");
        const stats = await getCrawlerStats();
        console.log("[Crawler] Stats:", JSON.stringify(stats, null, 2));
        process.exit(0);
        
      case "auto":
      default:
        console.log("[Crawler] Running AUTO crawl...");
        const autoResult = await crawlAuto();
        console.log("[Crawler] Auto crawl completed:", JSON.stringify(autoResult, null, 2));
        
        // 自动处理 AI
        if (autoResult.high.crawled || autoResult.medium.crawled) {
          console.log("[Crawler] Processing AI for new articles...");
          const aiResult = await processPendingArticles(5);
          console.log("[Crawler] AI processing completed:", JSON.stringify(aiResult, null, 2));
        }
        
        process.exit(0);
    }
  } catch (error) {
    console.error("[Crawler] Error:", error);
    process.exit(1);
  }
}

main();
