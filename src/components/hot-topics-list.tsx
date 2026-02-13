import { cn } from "@/lib/utils";
import { TrendingUp, ArrowRight } from "lucide-react";

interface HotTopic {
  rank: number;
  title: string;
  heat: number;
  change: number;
  category: string;
}

interface HotTopicsListProps {
  topics: HotTopic[];
  className?: string;
}

export function HotTopicsList({ topics, className }: HotTopicsListProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {topics.map((topic, index) => (
        <div
          key={topic.title}
          className="group flex items-center gap-4 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
        >
          <div
            className={cn(
              "w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0",
              index < 3
                ? "bg-brand-500 text-white"
                : "bg-muted text-muted-foreground"
            )}
          >
            {topic.rank}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium truncate group-hover:text-brand-500 transition-colors">
                {topic.title}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground flex-shrink-0">
                {topic.category}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>{topic.heat.toLocaleString()} 热度</span>
              </div>
              {topic.change !== 0 && (
                <span
                  className={cn(
                    topic.change > 0 ? "text-green-500" : "text-red-500"
                  )}
                >
                  {topic.change > 0 ? "+" : ""}
                  {topic.change}%
                </span>
              )}
            </div>
          </div>

          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ))}
    </div>
  );
}
