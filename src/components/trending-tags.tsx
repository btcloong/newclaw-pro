import { cn } from "../../lib/utils";

interface TrendingTagsProps {
  tags: Array<{
    name: string;
    count?: number;
    trend?: "up" | "down" | "neutral";
  }>;
  className?: string;
}

export function TrendingTags({ tags, className }: TrendingTagsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag) => (
        <button
          key={tag.name}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium",
            "bg-secondary hover:bg-secondary/80 transition-colors",
            "border border-transparent hover:border-border"
          )}
        >
          <span>#{tag.name}</span>
          {tag.count && (
            <span className="text-xs text-muted-foreground">
              {tag.count > 1000 ? `${(tag.count / 1000).toFixed(1)}K` : tag.count}
            </span>
          )}
          {tag.trend && (
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                tag.trend === "up" && "bg-green-500",
                tag.trend === "down" && "bg-red-500",
                tag.trend === "neutral" && "bg-gray-400"
              )}
            />
          )}
        </button>
      ))}
    </div>
  );
}
