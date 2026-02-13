import { db } from "../src/lib/db";
import { 
  crawlAll, 
  crawlRSS, 
  crawlGitHub, 
  crawlProductHunt,
  generateHotTopics,
  generateFundingData,
  generateResearchReports
} from "../src/lib/crawler";

async function init() {
  console.log("🚀 Initializing database and crawling initial data...\n");

  try {
    // 生成热搜话题
    console.log("📊 Generating hot topics...");
    const topicsResult = await generateHotTopics();
    console.log(topicsResult.success ? `✅ ${topicsResult.count} topics` : `❌ ${topicsResult.error}`);

    // 生成融资数据
    console.log("💰 Generating funding data...");
    const fundingResult = await generateFundingData();
    console.log(fundingResult.success ? `✅ ${fundingResult.count} funding records` : `❌ ${fundingResult.error}`);

    // 生成研究报告
    console.log("📚 Generating research reports...");
    const researchResult = await generateResearchReports();
    console.log(researchResult.success ? `✅ ${researchResult.count} reports` : `❌ ${researchResult.error}`);

    // 抓取 GitHub 项目
    console.log("\n🔧 Crawling GitHub projects...");
    const githubResult = await crawlGitHub();
    console.log(githubResult.success ? `✅ ${githubResult.count} repos` : `❌ ${githubResult.error}`);

    // 抓取 Product Hunt
    console.log("\n🚀 Crawling Product Hunt...");
    const phResult = await crawlProductHunt();
    console.log(phResult.success ? `✅ ${phResult.count} products` : `❌ ${phResult.error}`);

    // 抓取 RSS 新闻
    console.log("\n📰 Crawling RSS feeds...");
    const rssResult = await crawlRSS();
    console.log(rssResult.success ? `✅ ${rssResult.count} articles` : `❌ ${rssResult.error}`);

    console.log("\n✨ Initialization complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Initialization failed:", error);
    process.exit(1);
  }
}

init();
