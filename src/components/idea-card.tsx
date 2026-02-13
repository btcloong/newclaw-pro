import { cn } from "@/lib/utils";
import { Zap, Lightbulb, Wrench, BookOpen, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface IdeaCardProps {
  id: string;
  title: string;
  description: string;
  category: "创意" | "工具" | "案例" | "教程";
  tags: string[];
  difficulty: "入门" | "进阶" | "高级";
  estimatedTime?: string;
  likes: number;
  className?: string;
}

const categoryConfig = {
  创意: { icon: Lightbulb, color: "bg-amber-500/10 text-amber-500" },
  工具: { icon: Wrench, color: "bg-blue-500/10 text-blue-500" },
  案例: { icon: BookOpen, color: "bg-green-500/10 text-green-500" },
  教程: { icon: Zap, color: "bg-purple-500/10 text-purple-500" },
};

const difficultyConfig = {
  入门: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  进阶: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  高级: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export function IdeaCard({
  id,
  title,
  description,
  category,
  tags,
  difficulty,
  estimatedTime,
  likes,
  className,
}: IdeaCardProps) {
  const CategoryIcon = categoryConfig[category].icon;

  return (
    <div
      className={cn(
        "group p-5 rounded-xl bg-card border card-hover cursor-pointer",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={cn(
            "p-2 rounded-lg",
            categoryConfig[category].color
          )}
        >
          <CategoryIcon className="w-5 h-5" />
        </div>
        <Badge className={difficultyConfig[difficulty]}>{difficulty}</Badge>
      </div>

      <h3 className="font-semibold text-lg mb-2 group-hover:text-brand-500 transition-colors">
        {title}
      </h3>

      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-3">
          {estimatedTime && <span>⏱️ {estimatedTime}</span>}
          <span>❤️ {likes}</span>
        </div>
        <div className="flex items-center gap-1 text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity">
          <span>查看详情</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
