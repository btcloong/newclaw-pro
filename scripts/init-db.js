const { createClient } = require("@libsql/client");
const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "data", "newclaw.db");

// 确保数据目录存在
if (!fs.existsSync(path.dirname(DB_PATH))) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

const client = createClient({
  url: `file:${DB_PATH}`,
});

const initSQL = `
-- 创建新闻表
CREATE TABLE IF NOT EXISTS news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  image TEXT,
  source TEXT NOT NULL,
  source_url TEXT,
  category TEXT,
  tags TEXT,
  author TEXT,
  published_at INTEGER NOT NULL,
  fetched_at INTEGER DEFAULT (unixepoch()),
  view_count INTEGER DEFAULT 0,
  is_hot INTEGER DEFAULT 0,
  is_featured INTEGER DEFAULT 0
);

-- 创建项目表
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  full_description TEXT,
  logo TEXT,
  category TEXT NOT NULL,
  tags TEXT,
  source TEXT NOT NULL,
  source_url TEXT NOT NULL,
  stars INTEGER,
  forks INTEGER,
  upvotes INTEGER,
  language TEXT,
  license TEXT,
  created_at INTEGER,
  updated_at INTEGER,
  fetched_at INTEGER DEFAULT (unixepoch()),
  is_new INTEGER DEFAULT 0,
  is_trending INTEGER DEFAULT 0
);

-- 创建研究报告表
CREATE TABLE IF NOT EXISTS research (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  category TEXT NOT NULL,
  tags TEXT,
  author TEXT,
  read_time TEXT,
  published_at INTEGER NOT NULL,
  fetched_at INTEGER DEFAULT (unixepoch()),
  view_count INTEGER DEFAULT 0
);

-- 创建快讯表
CREATE TABLE IF NOT EXISTS flash_news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  source TEXT NOT NULL,
  source_url TEXT,
  is_important INTEGER DEFAULT 0,
  published_at INTEGER NOT NULL,
  fetched_at INTEGER DEFAULT (unixepoch())
);

-- 创建热搜话题表
CREATE TABLE IF NOT EXISTS hot_topics (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  heat INTEGER NOT NULL,
  change INTEGER DEFAULT 0,
  category TEXT,
  rank INTEGER NOT NULL,
  updated_at INTEGER DEFAULT (unixepoch())
);

-- 创建融资信息表
CREATE TABLE IF NOT EXISTS funding (
  id TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  amount TEXT NOT NULL,
  round TEXT NOT NULL,
  date TEXT NOT NULL,
  investors TEXT,
  category TEXT,
  description TEXT,
  fetched_at INTEGER DEFAULT (unixepoch())
);

-- 创建抓取日志表
CREATE TABLE IF NOT EXISTS crawl_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source TEXT NOT NULL,
  status TEXT NOT NULL,
  message TEXT,
  items_count INTEGER DEFAULT 0,
  started_at INTEGER NOT NULL,
  completed_at INTEGER
);
`;

const seedSQL = `
-- 插入示例新闻数据
INSERT OR IGNORE INTO news (id, title, summary, source, published_at, category, is_hot, is_featured, view_count) VALUES
('news_001', 'OpenAI 发布 GPT-5 预览版：多模态能力大幅提升', 'OpenAI 在今日凌晨 surprise 发布了 GPT-5 的预览版本，新模型在代码生成、数学推理和创意写作方面都有显著提升。', 'TechCrunch', ${Math.floor(Date.now()/1000) - 1800}, '大模型', 1, 1, 12500),
('news_002', 'Anthropic 完成 35 亿美元融资，估值突破 600 亿美元', 'Anthropic 宣布完成新一轮融资，由 Lightspeed Venture Partners 领投，资金将用于扩大 Claude 的计算能力。', 'The Information', ${Math.floor(Date.now()/1000) - 7200}, '融资', 1, 0, 8900),
('news_003', 'Google DeepMind 发布 Gemini 2.0：原生多模态', 'Google DeepMind 发布 Gemini 2.0，支持实时视频理解', 'Google Blog', ${Math.floor(Date.now()/1000) - 14400}, '大模型', 0, 0, 6700),
('news_004', 'Midjourney V7 发布：图像生成质量再创新高', 'Midjourney V7 支持 3D 场景生成', 'Midjourney', ${Math.floor(Date.now()/1000) - 21600}, '图像生成', 0, 0, 5400),
('news_005', 'Meta 开源 Llama 4：400B 参数', 'Meta 开源 Llama 4，性能超越 GPT-4', 'Meta AI', ${Math.floor(Date.now()/1000) - 28800}, '开源模型', 0, 0, 4800);

-- 插入示例项目数据
INSERT OR IGNORE INTO projects (id, name, description, category, source, source_url, stars, forks, is_trending) VALUES
('gh_1', 'LangChain', '构建 LLM 应用的框架，支持多种模型和工具链集成', '开发框架', 'github', 'https://github.com/langchain-ai/langchain', 98000, 15000, 1),
('gh_2', 'LlamaIndex', '数据框架，用于将私有数据连接到 LLM', '开发框架', 'github', 'https://github.com/run-llama/llama_index', 45000, 5200, 0),
('gh_3', 'CrewAI', '多 Agent 协作框架，轻松构建 Agent 团队', 'Agent 框架', 'github', 'https://github.com/joaomdmoura/crewAI', 23000, 3100, 1),
('gh_4', 'AutoGPT', '让 GPT-4 完全自主的实验性开源项目', 'AI Agent', 'github', 'https://github.com/Significant-Gravitas/AutoGPT', 167000, 44000, 1);

-- 插入热搜话题
INSERT OR IGNORE INTO hot_topics (id, title, heat, change, category, rank) VALUES
('ht_1', 'GPT-5', 985000, 125, '大模型', 1),
('ht_2', 'AI Agent', 756000, 45, '应用', 2),
('ht_3', 'Claude 3.5', 642000, 23, '大模型', 3),
('ht_4', 'Sora', 534000, -12, '视频', 4),
('ht_5', '具身智能', 423000, 89, '机器人', 5),
('ht_6', 'AI 编程', 389000, 67, '工具', 6),
('ht_7', '多模态', 312000, 34, '技术', 7),
('ht_8', 'AI 芯片', 298000, 15, '硬件', 8);

-- 插入融资数据
INSERT OR IGNORE INTO funding (id, company_name, amount, round, date, investors, category, description) VALUES
('fund_1', 'Anthropic', '35亿美元', 'E轮', '2026-02-12', '["Lightspeed", "Amazon", "Google"]', '大模型', 'Claude 开发商，专注于 AI 安全和对齐研究'),
('fund_2', 'Perplexity', '5亿美元', 'C轮', '2026-02-08', '["IVP", "NEA", "NVIDIA"]', 'AI 搜索', 'AI 驱动的搜索引擎，月活用户突破 5000 万'),
('fund_3', 'Figure AI', '6.75亿美元', 'B轮', '2026-02-05', '["Microsoft", "OpenAI", "NVIDIA"]', '机器人', '人形机器人公司，专注于具身智能研究');

-- 插入研究报告
INSERT OR IGNORE INTO research (id, title, summary, category, tags, author, read_time, published_at) VALUES
('res_1', '2026 AI 投资趋势报告：Agent 赛道成为新宠', '本报告分析了 2026 年 Q1 AI 领域的投资趋势，AI Agent 赛道融资额同比增长 128%。', '投资', '["投资", "趋势", "Agent"]', 'NewClaw Research', '15 分钟', ${Math.floor(Date.now()/1000) - 86400}),
('res_2', '大模型商业化深度分析：从 API 到垂直应用', '探讨大模型厂商的商业模式演进，以及垂直领域应用的机会与挑战。', '商业化', '["大模型", "商业化", "B2B"]', 'NewClaw Research', '20 分钟', ${Math.floor(Date.now()/1000) - 172800}),
('res_3', '具身智能：下一个万亿级市场', '人形机器人与具身智能的技术进展、市场规模预测和投资机会分析。', '机器人', '["机器人", "具身智能", "硬件"]', 'NewClaw Research', '25 分钟', ${Math.floor(Date.now()/1000) - 259200});
`;

async function init() {
  console.log("🚀 Initializing database...\n");

  try {
    // 执行初始化 SQL
    await client.executeMultiple(initSQL);
    console.log("✅ Tables created");

    // 插入示例数据
    await client.executeMultiple(seedSQL);
    console.log("✅ Sample data inserted");

    console.log("\n✨ Database initialized successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Initialization failed:", error);
    process.exit(1);
  }
}

init();
