"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  X, 
  Clock,
  TrendingUp,
  ChevronDown,
  Loader2
} from "lucide-react";
import Link from "next/link";

interface SearchResult {
  id: string;
  title: string;
  chineseTitle?: string;
  summary: string;
  aiSummary?: string;
  source: string;
  category: string;
  aiCategory?: string;
  publishedAt: string;
  isHot?: boolean;
  aiScores?: {
    overall: number;
  };
  image?: string;
}

interface Facets {
  categories: Array<{ name: string; count: number }>;
  sources: Array<{ name: string; count: number }>;
  tags: Array<{ name: string; count: number }>;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [facets, setFacets] = useState<Facets | null>(null);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // 执行搜索
  const performSearch = useCallback(async () => {
    if (!query.trim() && !selectedCategory && !selectedSource) {
      setResults([]);
      setTotal(0);
      return;
    }

    setLoading(true);
    
    try {
      const params = new URLSearchParams();
      if (query) params.append("q", query);
      if (selectedCategory) params.append("category", selectedCategory);
      if (selectedSource) params.append("source", selectedSource);
      
      const response = await fetch(`/api/search?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setResults(data.data.items);
        setTotal(data.data.total);
        setFacets(data.data.facets);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, [query, selectedCategory, selectedSource]);

  // 获取搜索建议
  const fetchSuggestions = useCallback(async (value: string) => {
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(value)}`);
      const data = await response.json();
      if (data.success) {
        setSuggestions(data.data);
      }
    } catch (error) {
      console.error("Suggestions error:", error);
    }
  }, []);

  // 防抖搜索建议
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, fetchSuggestions]);

  // 搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch();
    }, 500);

    return () => clearTimeout(timer);
  }, [performSearch]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) return `${hours}小时前`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}天前`;
    return date.toLocaleDateString("zh-CN");
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">搜索</h1>
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="搜索 AI 新闻、项目、话题..."
                className="pl-10 pr-20 h-12"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-1" />
                筛选
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>

              {/* Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-4 py-2 hover:bg-muted first:rounded-t-lg last:rounded-b-lg"
                      onClick={() => {
                        setQuery(suggestion);
                        setShowSuggestions(false);
                      }}
                    >
                      <Search className="w-4 h-4 inline mr-2 text-muted-foreground" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filters */}
            {showFilters && facets && (
              <div className="mt-4 p-4 bg-background rounded-lg border">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium">筛选条件</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedSource(null);
                    }}
                  >
                    <X className="w-4 h-4 mr-1" />
                    清除
                  </Button>
                </div>

                {facets.categories.length > 0 && (
                  <div className="mb-4">
                    <span className="text-sm text-muted-foreground mb-2 block">分类</span>
                    <div className="flex flex-wrap gap-2">
                      {facets.categories.map((cat) => (
                        <Badge
                          key={cat.name}
                          variant={selectedCategory === cat.name ? "default" : "secondary"}
                          className="cursor-pointer"
                          onClick={() => setSelectedCategory(
                            selectedCategory === cat.name ? null : cat.name
                          )}
                        >
                          {cat.name} ({cat.count})
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {facets.sources.length > 0 && (
                  <div>
                    <span className="text-sm text-muted-foreground mb-2 block">来源</span>
                    <div className="flex flex-wrap gap-2">
                      {facets.sources.slice(0, 10).map((src) => (
                        <Badge
                          key={src.name}
                          variant={selectedSource === src.name ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => setSelectedSource(
                            selectedSource === src.name ? null : src.name
                          )}
                        >
                          {src.name} ({src.count})
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Stats */}
            {total > 0 && (
              <p className="mt-4 text-sm text-muted-foreground">
                找到 {total} 条结果
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              {results.map((result) => (
                <Link key={result.id} href={`/news/${result.id}`}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {result.image && (
                          <div 
                            className="w-24 h-24 flex-shrink-0 rounded-lg bg-cover bg-center"
                            style={{ backgroundImage: `url(${result.image})` }}
                          />
                        )}
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {result.isHot && (
                              <Badge variant="destructive" className="text-xs">热门</Badge>
                            )}
                            <Badge variant="secondary" className="text-xs">
                              {result.aiCategory || result.category}
                            </Badge>
                            
                            {result.aiScores && (
                              <span className="text-xs text-yellow-600">
                                ★ {result.aiScores.overall.toFixed(1)}
                              </span>
                            )}
                          </div>
                          
                          <h3 className="font-semibold mb-1 hover:text-brand-500">
                            {result.chineseTitle || result.title}
                          </h3>
                          
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {result.aiSummary || result.summary}
                          </p>
                          
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <span>{result.source}</span>
                            <span>•</span>
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(result.publishedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">未找到相关结果</p>
              <p className="text-sm text-muted-foreground mt-2">
                尝试使用不同的关键词或清除筛选条件
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">输入关键词开始搜索</p>
              <p className="text-sm text-muted-foreground mt-2">
                支持搜索标题、摘要、来源、标签
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
