/**
 * 爬虫系统测试脚本
 */

import { getSourcesStats, ALL_RSS_SOURCES, getSourcesByPriority } from '../src/lib/rss-sources';

console.log('=== NewClaw 爬虫系统测试 ===\n');

// 测试1: 统计信息
console.log('1. 数据源统计:');
const stats = getSourcesStats();
console.log(`   总计: ${stats.total} 个源`);
console.log(`   英文: ${stats.english} 个`);
console.log(`   中文: ${stats.chinese} 个`);
console.log(`   高频: ${stats.highPriority} 个`);
console.log(`   中频: ${stats.mediumPriority} 个`);
console.log(`   低频: ${stats.lowPriority} 个`);
console.log(`   按类型:`, stats.byType);

// 测试2: 按优先级获取
console.log('\n2. 按优先级获取:');
console.log(`   高频源: ${getSourcesByPriority('high').length} 个`);
console.log(`   中频源: ${getSourcesByPriority('medium').length} 个`);
console.log(`   低频源: ${getSourcesByPriority('low').length} 个`);

// 测试3: 显示前10个源
console.log('\n3. 前10个数据源:');
ALL_RSS_SOURCES.slice(0, 10).forEach((source, i) => {
  console.log(`   ${i + 1}. ${source.name} (${source.language}, ${source.priority})`);
});

// 测试4: 官方博客源
console.log('\n4. AI公司官方博客源:');
const officialSources = ALL_RSS_SOURCES.filter(s => s.type === 'official' && s.priority === 'high');
officialSources.slice(0, 10).forEach((source, i) => {
  console.log(`   ${i + 1}. ${source.name}`);
});

console.log('\n=== 测试完成 ===');
