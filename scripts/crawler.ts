import { crawlAll } from "../src/lib/crawler";

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
      case "news":
        const { generateHotTopics, generateFundingData, generateResearchReports } = await import("../src/lib/crawler");
        await generateHotTopics();
        await generateFundingData();
        await generateResearchReports();
        result = { success: true, count: 3 };
        break;
      default:
        result = await crawlAll();
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
