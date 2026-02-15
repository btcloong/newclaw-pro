/**
 * RSS 数据源配置
 * 包含 90+ Hacker News 顶级技术博客和中文科技媒体
 */

export interface RSSSource {
  name: string;
  xmlUrl: string;
  htmlUrl: string;
  language: "zh" | "en";
  category?: string;
}

// 90 个 Hacker News 顶级技术博客（源自 Andrej Karpathy 推荐）
export const HN_TOP_BLOGS: RSSSource[] = [
  {
    name: "Simon Willison",
    xmlUrl: "https://simonwillison.net/atom/everything/",
    htmlUrl: "https://simonwillison.net",
    language: "en",
  },
  {
    name: "Paul Graham",
    xmlUrl: "http://www.aaronsw.com/2002/feeds/pgessays.rss",
    htmlUrl: "https://paulgraham.com",
    language: "en",
  },
  {
    name: "Dan Abramov",
    xmlUrl: "https://overreacted.io/rss.xml",
    htmlUrl: "https://overreacted.io",
    language: "en",
  },
  {
    name: "Gwern",
    xmlUrl: "https://gwern.substack.com/feed",
    htmlUrl: "https://gwern.net",
    language: "en",
  },
  {
    name: "Krebs on Security",
    xmlUrl: "https://krebsonsecurity.com/feed/",
    htmlUrl: "https://krebsonsecurity.com",
    language: "en",
  },
  {
    name: "Antirez",
    xmlUrl: "http://antirez.com/rss",
    htmlUrl: "http://antirez.com",
    language: "en",
  },
  {
    name: "Daring Fireball",
    xmlUrl: "https://daringfireball.net/feeds/main",
    htmlUrl: "https://daringfireball.net",
    language: "en",
  },
  {
    name: "Troy Hunt",
    xmlUrl: "https://www.troyhunt.com/rss/",
    htmlUrl: "https://troyhunt.com",
    language: "en",
  },
  {
    name: "Mitchell Hashimoto",
    xmlUrl: "https://mitchellh.com/feed.xml",
    htmlUrl: "https://mitchellh.com",
    language: "en",
  },
  {
    name: "Steve Blank",
    xmlUrl: "https://steveblank.com/feed/",
    htmlUrl: "https://steveblank.com",
    language: "en",
  },
  {
    name: "Eli Bendersky",
    xmlUrl: "https://eli.thegreenplace.net/feeds/all.atom.xml",
    htmlUrl: "https://eli.thegreenplace.net",
    language: "en",
  },
  {
    name: "Fabien Sanglard",
    xmlUrl: "https://fabiensanglard.net/rss.xml",
    htmlUrl: "https://fabiensanglard.net",
    language: "en",
  },
  {
    name: "Jeff Geerling",
    xmlUrl: "https://www.jeffgeerling.com/blog.xml",
    htmlUrl: "https://jeffgeerling.com",
    language: "en",
  },
  {
    name: "Sean Goedecke",
    xmlUrl: "https://www.seangoedecke.com/rss.xml",
    htmlUrl: "https://seangoedecke.com",
    language: "en",
  },
  {
    name: "Eric Migicovsky",
    xmlUrl: "https://ericmigi.com/rss.xml",
    htmlUrl: "https://ericmigi.com",
    language: "en",
  },
  {
    name: "Idiallo",
    xmlUrl: "https://idiallo.com/feed.rss",
    htmlUrl: "https://idiallo.com",
    language: "en",
  },
  {
    name: "Pluralistic",
    xmlUrl: "https://pluralistic.net/feed/",
    htmlUrl: "https://pluralistic.net",
    language: "en",
  },
  {
    name: "Terence Eden",
    xmlUrl: "https://shkspr.mobi/blog/feed/",
    htmlUrl: "https://shkspr.mobi",
    language: "en",
  },
  {
    name: "Michal Zalewski",
    xmlUrl: "https://lcamtuf.substack.com/feed",
    htmlUrl: "https://lcamtuf.substack.com",
    language: "en",
  },
  {
    name: "Dynomight",
    xmlUrl: "https://dynomight.net/feed.xml",
    htmlUrl: "https://dynomight.net",
    language: "en",
  },
  {
    name: "Chris Siebenmann",
    xmlUrl: "https://utcc.utoronto.ca/~cks/space/blog/?atom",
    htmlUrl: "https://utcc.utoronto.ca/~cks",
    language: "en",
  },
  {
    name: "Xe Iaso",
    xmlUrl: "https://xeiaso.net/blog.rss",
    htmlUrl: "https://xeiaso.net",
    language: "en",
  },
  {
    name: "Raymond Chen",
    xmlUrl: "https://devblogs.microsoft.com/oldnewthing/feed",
    htmlUrl: "https://devblogs.microsoft.com/oldnewthing",
    language: "en",
  },
  {
    name: "Ken Shirriff",
    xmlUrl: "https://www.righto.com/feeds/posts/default",
    htmlUrl: "https://righto.com",
    language: "en",
  },
  {
    name: "Armin Ronacher",
    xmlUrl: "https://lucumr.pocoo.org/feed.atom",
    htmlUrl: "https://lucumr.pocoo.org",
    language: "en",
  },
  {
    name: "Skyfall",
    xmlUrl: "https://skyfall.dev/rss.xml",
    htmlUrl: "https://skyfall.dev",
    language: "en",
  },
  {
    name: "Gary Marcus",
    xmlUrl: "https://garymarcus.substack.com/feed",
    htmlUrl: "https://garymarcus.substack.com",
    language: "en",
  },
  {
    name: "Rachel by the Bay",
    xmlUrl: "https://rachelbythebay.com/w/atom.xml",
    htmlUrl: "https://rachelbythebay.com",
    language: "en",
  },
  {
    name: "Tim Sh",
    xmlUrl: "https://timsh.org/rss/",
    htmlUrl: "https://timsh.org",
    language: "en",
  },
  {
    name: "John D. Cook",
    xmlUrl: "https://www.johndcook.com/blog/feed/",
    htmlUrl: "https://johndcook.com",
    language: "en",
  },
  {
    name: "Giles Thomas",
    xmlUrl: "https://gilesthomas.com/feed/rss.xml",
    htmlUrl: "https://gilesthomas.com",
    language: "en",
  },
  {
    name: "matklad",
    xmlUrl: "https://matklad.github.io/feed.xml",
    htmlUrl: "https://matklad.github.io",
    language: "en",
  },
  {
    name: "Evan Hahn",
    xmlUrl: "https://evanhahn.com/feed.xml",
    htmlUrl: "https://evanhahn.com",
    language: "en",
  },
  {
    name: "Terrible Software",
    xmlUrl: "https://terriblesoftware.org/feed/",
    htmlUrl: "https://terriblesoftware.org",
    language: "en",
  },
  {
    name: "Rakhim",
    xmlUrl: "https://rakhim.exotext.com/rss.xml",
    htmlUrl: "https://rakhim.exotext.com",
    language: "en",
  },
  {
    name: "Joan Westenberg",
    xmlUrl: "https://joanwestenberg.com/rss",
    htmlUrl: "https://joanwestenberg.com",
    language: "en",
  },
  {
    name: "Xania",
    xmlUrl: "https://xania.org/feed",
    htmlUrl: "https://xania.org",
    language: "en",
  },
  {
    name: "Micah Lee",
    xmlUrl: "https://micahflee.com/feed/",
    htmlUrl: "https://micahflee.com",
    language: "en",
  },
  {
    name: "Nesbitt",
    xmlUrl: "https://nesbitt.io/feed.xml",
    htmlUrl: "https://nesbitt.io",
    language: "en",
  },
  {
    name: "Construction Physics",
    xmlUrl: "https://www.construction-physics.com/feed",
    htmlUrl: "https://construction-physics.com",
    language: "en",
  },
  {
    name: "Tedium",
    xmlUrl: "https://feed.tedium.co/",
    htmlUrl: "https://tedium.co",
    language: "en",
  },
  {
    name: "Susam",
    xmlUrl: "https://susam.net/feed.xml",
    htmlUrl: "https://susam.net",
    language: "en",
  },
  {
    name: "Hillel Wayne",
    xmlUrl: "https://buttondown.com/hillelwayne/rss",
    htmlUrl: "https://buttondown.com/hillelwayne",
    language: "en",
  },
  {
    name: "Dwarkesh Patel",
    xmlUrl: "https://www.dwarkeshpatel.com/feed",
    htmlUrl: "https://dwarkesh.com",
    language: "en",
  },
  {
    name: "Fernando Borretti",
    xmlUrl: "https://borretti.me/feed.xml",
    htmlUrl: "https://borretti.me",
    language: "en",
  },
  {
    name: "Where's Your Ed At",
    xmlUrl: "https://www.wheresyoured.at/rss/",
    htmlUrl: "https://wheresyoured.at",
    language: "en",
  },
  {
    name: "Jayd",
    xmlUrl: "https://jayd.ml/feed.xml",
    htmlUrl: "https://jayd.ml",
    language: "en",
  },
  {
    name: "Max Woolf",
    xmlUrl: "https://minimaxir.com/index.xml",
    htmlUrl: "https://minimaxir.com",
    language: "en",
  },
  {
    name: "George Hotz",
    xmlUrl: "https://geohot.github.io/blog/feed.xml",
    htmlUrl: "https://geohot.github.io",
    language: "en",
  },
  {
    name: "The Digital Antiquarian",
    xmlUrl: "https://www.filfre.net/feed/",
    htmlUrl: "https://filfre.net",
    language: "en",
  },
  {
    name: "Jim Nielsen",
    xmlUrl: "https://blog.jim-nielsen.com/feed.xml",
    htmlUrl: "https://blog.jim-nielsen.com",
    language: "en",
  },
  {
    name: "The Old New Thing",
    xmlUrl: "https://dfarq.homeip.net/feed/",
    htmlUrl: "https://dfarq.homeip.net",
    language: "en",
  },
  {
    name: "jyn",
    xmlUrl: "https://jyn.dev/atom.xml",
    htmlUrl: "https://jyn.dev",
    language: "en",
  },
  {
    name: "Geoffrey Litt",
    xmlUrl: "https://www.geoffreylitt.com/feed.xml",
    htmlUrl: "https://geoffreylitt.com",
    language: "en",
  },
  {
    name: "Downtown Doug Brown",
    xmlUrl: "https://www.downtowndougbrown.com/feed/",
    htmlUrl: "https://downtowndougbrown.com",
    language: "en",
  },
  {
    name: "brutecat",
    xmlUrl: "https://brutecat.com/rss.xml",
    htmlUrl: "https://brutecat.com",
    language: "en",
  },
  {
    name: "Abort Retry Fail",
    xmlUrl: "https://www.abortretry.fail/feed",
    htmlUrl: "https://abortretry.fail",
    language: "en",
  },
  {
    name: "Old VCR",
    xmlUrl: "https://oldvcr.blogspot.com/feeds/posts/default",
    htmlUrl: "https://oldvcr.blogspot.com",
    language: "en",
  },
  {
    name: "Bogdan The Geek",
    xmlUrl: "https://bogdanthegeek.github.io/blog/index.xml",
    htmlUrl: "https://bogdanthegeek.github.io",
    language: "en",
  },
  {
    name: "Hugo Tunius",
    xmlUrl: "https://hugotunius.se/feed.xml",
    htmlUrl: "https://hugotunius.se",
    language: "en",
  },
  {
    name: "Bert Hubert",
    xmlUrl: "https://berthub.eu/articles/index.xml",
    htmlUrl: "https://berthub.eu",
    language: "en",
  },
  {
    name: "Chad Nauseam",
    xmlUrl: "https://chadnauseam.com/rss.xml",
    htmlUrl: "https://chadnauseam.com",
    language: "en",
  },
  {
    name: "Simone",
    xmlUrl: "https://simone.org/feed/",
    htmlUrl: "https://simone.org",
    language: "en",
  },
  {
    name: "Dragas",
    xmlUrl: "https://it-notes.dragas.net/feed/",
    htmlUrl: "https://it-notes.dragas.net",
    language: "en",
  },
  {
    name: "Beej",
    xmlUrl: "https://beej.us/blog/rss.xml",
    htmlUrl: "https://beej.us",
    language: "en",
  },
  {
    name: "Paris",
    xmlUrl: "https://hey.paris/index.xml",
    htmlUrl: "https://hey.paris",
    language: "en",
  },
  {
    name: "Daniel Wirtz",
    xmlUrl: "https://danielwirtz.com/rss.xml",
    htmlUrl: "https://danielwirtz.com",
    language: "en",
  },
  {
    name: "Mat Duggan",
    xmlUrl: "https://matduggan.com/rss/",
    htmlUrl: "https://matduggan.com",
    language: "en",
  },
  {
    name: "Refactoring English",
    xmlUrl: "https://refactoringenglish.com/index.xml",
    htmlUrl: "https://refactoringenglish.com",
    language: "en",
  },
  {
    name: "Works on My Machine",
    xmlUrl: "https://worksonmymachine.substack.com/feed",
    htmlUrl: "https://worksonmymachine.substack.com",
    language: "en",
  },
  {
    name: "Philip Laine",
    xmlUrl: "https://philiplaine.com/index.xml",
    htmlUrl: "https://philiplaine.com",
    language: "en",
  },
  {
    name: "Bernstein Bear",
    xmlUrl: "https://bernsteinbear.com/feed.xml",
    htmlUrl: "https://bernsteinbear.com",
    language: "en",
  },
  {
    name: "Daniel Delaney",
    xmlUrl: "https://danieldelaney.net/feed",
    htmlUrl: "https://danieldelaney.net",
    language: "en",
  },
  {
    name: "Herman",
    xmlUrl: "https://herman.bearblog.dev/feed/",
    htmlUrl: "https://herman.bearblog.dev",
    language: "en",
  },
  {
    name: "Tom Renner",
    xmlUrl: "https://tomrenner.com/index.xml",
    htmlUrl: "https://tomrenner.com",
    language: "en",
  },
  {
    name: "Pixelmelt",
    xmlUrl: "https://blog.pixelmelt.dev/rss/",
    htmlUrl: "https://blog.pixelmelt.dev",
    language: "en",
  },
  {
    name: "Martin Alderson",
    xmlUrl: "https://martinalderson.com/feed.xml",
    htmlUrl: "https://martinalderson.com",
    language: "en",
  },
  {
    name: "Daniel Hooper",
    xmlUrl: "https://danielchasehooper.com/feed.xml",
    htmlUrl: "https://danielchasehooper.com",
    language: "en",
  },
  {
    name: "Simon Tatham",
    xmlUrl: "https://www.chiark.greenend.org.uk/~sgtatham/quasiblog/feed.xml",
    htmlUrl: "https://chiark.greenend.org.uk/~sgtatham",
    language: "en",
  },
  {
    name: "Grant Slatton",
    xmlUrl: "https://grantslatton.com/rss.xml",
    htmlUrl: "https://grantslatton.com",
    language: "en",
  },
  {
    name: "Experimental History",
    xmlUrl: "https://www.experimental-history.com/feed",
    htmlUrl: "https://experimental-history.com",
    language: "en",
  },
  {
    name: "Anil Dash",
    xmlUrl: "https://anildash.com/feed.xml",
    htmlUrl: "https://anildash.com",
    language: "en",
  },
  {
    name: "Aresluna",
    xmlUrl: "https://aresluna.org/main.rss",
    htmlUrl: "https://aresluna.org",
    language: "en",
  },
  {
    name: "Michael Stapelberg",
    xmlUrl: "https://michael.stapelberg.ch/feed.xml",
    htmlUrl: "https://michael.stapelberg.ch",
    language: "en",
  },
  {
    name: "Miguel Grinberg",
    xmlUrl: "https://blog.miguelgrinberg.com/feed",
    htmlUrl: "https://miguelgrinberg.com",
    language: "en",
  },
  {
    name: "Keygen",
    xmlUrl: "https://keygen.sh/blog/feed.xml",
    htmlUrl: "https://keygen.sh",
    language: "en",
  },
  {
    name: "Matthew Garrett",
    xmlUrl: "https://mjg59.dreamwidth.org/data/rss",
    htmlUrl: "https://mjg59.dreamwidth.org",
    language: "en",
  },
  {
    name: "Computer.rip",
    xmlUrl: "https://computer.rip/rss.xml",
    htmlUrl: "https://computer.rip",
    language: "en",
  },
  {
    name: "Ted Unangst",
    xmlUrl: "https://www.tedunangst.com/flak/rss",
    htmlUrl: "https://tedunangst.com",
    language: "en",
  },
  {
    name: "Entropic Thoughts",
    xmlUrl: "https://entropicthoughts.com/feed.xml",
    htmlUrl: "https://entropicthoughts.com",
    language: "en",
  },
];

// 中文科技媒体源
export const CHINESE_TECH_SOURCES: RSSSource[] = [
  {
    name: "TechCrunch 中国",
    xmlUrl: "https://techcrunch.com/category/artificial-intelligence/feed/",
    htmlUrl: "https://techcrunch.com",
    language: "zh",
  },
  {
    name: "The Verge",
    xmlUrl: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
    htmlUrl: "https://www.theverge.com",
    language: "zh",
  },
  {
    name: "MIT 科技评论",
    xmlUrl: "https://www.technologyreview.com/feed/",
    htmlUrl: "https://www.technologyreview.com",
    language: "zh",
  },
  {
    name: "机器之心",
    xmlUrl: "https://www.jiqizhixin.com/rss",
    htmlUrl: "https://www.jiqizhixin.com",
    language: "zh",
  },
  {
    name: "量子位",
    xmlUrl: "https://www.qbitai.com/feed",
    htmlUrl: "https://www.qbitai.com",
    language: "zh",
  },
  {
    name: "新智元",
    xmlUrl: "https://www.ainews.cn/rss",
    htmlUrl: "https://www.ainews.cn",
    language: "zh",
  },
  {
    name: "AI 科技评论",
    xmlUrl: "https://www.leiphone.com/rss",
    htmlUrl: "https://www.leiphone.com",
    language: "zh",
  },
  {
    name: "InfoQ 中国",
    xmlUrl: "https://www.infoq.cn/rss",
    htmlUrl: "https://www.infoq.cn",
    language: "zh",
  },
  {
    name: "36氪",
    xmlUrl: "https://36kr.com/feed",
    htmlUrl: "https://36kr.com",
    language: "zh",
  },
  {
    name: "虎嗅",
    xmlUrl: "https://www.huxiu.com/rss",
    htmlUrl: "https://www.huxiu.com",
    language: "zh",
  },
  {
    name: "品玩",
    xmlUrl: "https://www.pingwest.com/rss",
    htmlUrl: "https://www.pingwest.com",
    language: "zh",
  },
  {
    name: "Solidot",
    xmlUrl: "https://www.solidot.org/rss",
    htmlUrl: "https://www.solidot.org",
    language: "zh",
  },
  {
    name: "开源中国",
    xmlUrl: "https://www.oschina.net/rss",
    htmlUrl: "https://www.oschina.net",
    language: "zh",
  },
  {
    name: "CSDN",
    xmlUrl: "https://blog.csdn.net/rss",
    htmlUrl: "https://csdn.net",
    language: "zh",
  },
  {
    name: "掘金",
    xmlUrl: "https://juejin.cn/rss",
    htmlUrl: "https://juejin.cn",
    language: "zh",
  },
  {
    name: "知乎日报",
    xmlUrl: "https://www.zhihu.com/rss",
    htmlUrl: "https://www.zhihu.com",
    language: "zh",
  },
  {
    name: "阮一峰",
    xmlUrl: "https://www.ruanyifeng.com/blog/atom.xml",
    htmlUrl: "https://www.ruanyifeng.com",
    language: "zh",
  },
  {
    name: "张鑫旭",
    xmlUrl: "https://www.zhangxinxu.com/wordpress/feed/",
    htmlUrl: "https://www.zhangxinxu.com",
    language: "zh",
  },
  {
    name: "酷壳",
    xmlUrl: "https://coolshell.cn/feed",
    htmlUrl: "https://coolshell.cn",
    language: "zh",
  },
  {
    name: "架构师之路",
    xmlUrl: "https://www.54chen.com/rss",
    htmlUrl: "https://www.54chen.com",
    language: "zh",
  },
];

// 合并所有源
export const ALL_RSS_SOURCES: RSSSource[] = [
  ...HN_TOP_BLOGS,
  ...CHINESE_TECH_SOURCES,
];

// 按语言获取源
export function getSourcesByLanguage(lang: "zh" | "en" | "all"): RSSSource[] {
  if (lang === "all") return ALL_RSS_SOURCES;
  return ALL_RSS_SOURCES.filter((s) => s.language === lang);
}

// 获取源统计
export function getSourcesStats(): {
  total: number;
  english: number;
  chinese: number;
} {
  return {
    total: ALL_RSS_SOURCES.length,
    english: HN_TOP_BLOGS.length,
    chinese: CHINESE_TECH_SOURCES.length,
  };
}
