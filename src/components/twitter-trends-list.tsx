import { TrendingUp, Hash } from "lucide-react";
import { cn, formatNumber } from "../../lib/utils";
import type { TwitterTrend } from "../../lib/db";

interface TwitterTrendsListProps {
  trends: TwitterTrend[];
  className?: string;
}

export function TwitterTrendsList({ trends, className }: TwitterTrendsListProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {trends.map((trend, index) => (
        <div
          key={trend.id}
          className="group flex items-center gap-4 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
        >
          <div
            className={cn(
              "w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0",
              index < 3
                ? "bg-blue-500 text-white"
                : "bg-muted text-muted-foreground"
            )}
          >
            {trend.rank}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-blue-500" />
              <span className="font-medium truncate group-hover:text-blue-500 transition-colors">
                {trend.name}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>{formatNumber(trend.tweetVolume)} 推文</span>
              </div>
              {trend.category && (
                <span className="px-2 py-0.5 rounded-full bg-muted">
                  {trend.category}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
