import { cn, formatDate } from "@/lib/utils";

interface FlashNewsItemProps {
  id: string;
  title: string;
  content?: string;
  publishedAt: string;
  isImportant?: boolean;
  className?: string;
}

export function FlashNewsItem({
  id,
  title,
  content,
  publishedAt,
  isImportant,
  className,
}: FlashNewsItemProps) {
  return (
    <div
      className={cn(
        "group relative pl-6 pb-6 border-l-2 last:pb-0",
        isImportant ? "border-brand-500" : "border-muted",
        className
      )}
    >
      <div
        className={cn(
          "absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full border-2 bg-background",
          isImportant
            ? "border-brand-500 bg-brand-500"
            : "border-muted-foreground/30"
        )}
      />
      
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatDate(publishedAt)}</span>
          {isImportant && (
            <span className="text-brand-500 font-medium">重要</span>
          )}
        </div>
        
        <a
          href={`/news/${id}`}
          className="block font-medium hover:text-brand-500 transition-colors line-clamp-2"
        >
          {title}
        </a>
        
        {content && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {content}
          </p>
        )}
      </div>
    </div>
  );
}
