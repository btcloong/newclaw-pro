import { crawlAll } from "../src/lib/crawler";
import { crawlTwitter } from "../src/lib/twitter-crawler";

async function main() {
  const args = process.argv.slice(2);
  const sourceArg = args.find(arg => arg.startsWith("--source="));
  const source = sourceArg ? sourceArg.replace("--source=", "") : "all";

  console.log(`🚀 Starting crawler for source: ${source}\n`);

  try {
    let result;
    
    switch (source) {
      case "rss":
        const { crawlRSS } = await import("../src/lib/crawler");
        result = await crawlRSS();
        break;
      case "github":
        const { crawlGitHub } = await import("../src/lib/crawler");
        result = await crawlGitHub();
        break;
      case "producthunt":
        const { crawlProductHunt } = await import("../src/lib/crawler");
        result = await crawlProductHunt();
        break;
      case "twitter":
        result = await crawlTwitter();
        break;
      case "news":
        const { generateHotTopics, generateFundingData, generateResearchReports } = await import("../src/lib/crawler");
        await generateHotTopics();
        await generateFundingData();
        await generateResearchReports();
        result = { success: true, count: 3 };
        break;
      default:
        // 运行所有爬虫
        const results = await Promise.all([
          crawlAll(),
          crawlTwitter(),
        ]);
        result = {
          main: results[0],
          twitter: results[1],
        };
    }

    console.log("\n✨ Crawl complete!");
    console.log(result);
    process.exit(0);
  } catch (error) {
    console.error("❌ Crawl failed:", error);
    process.exit(1);
  }
}

main();
