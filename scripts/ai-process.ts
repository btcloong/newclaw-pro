/**
 * AI 处理脚本
 * 用于手动触发 AI 处理待处理的文章
 */

import { processPendingArticles } from "../src/lib/crawler";

async function main() {
  console.log("🤖 Starting AI processing...");
  
  const limit = process.argv.includes("--limit")
    ? parseInt(process.argv[process.argv.indexOf("--limit") + 1], 10)
    : 10;
  
  const results = await processPendingArticles(limit);
  
  console.log("\n📊 AI Processing Summary:");
  console.log(`   Processed: ${results.processed}`);
  console.log(`   Success: ${results.success}`);
  console.log(`   Failed: ${results.failed}`);
  
  process.exit(0);
}

main().catch((error) => {
  console.error("❌ AI processing failed:", error);
  process.exit(1);
});
