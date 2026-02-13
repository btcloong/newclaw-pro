import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate, truncate } from "@/lib/utils";

interface NewsCardProps {
  id: string;
  title: string;
  summary?: string;
  image?: string;
  source: string;
  sourceIcon?: string;
  publishedAt: string;
  category?: string;
  tags?: string[];
  viewCount?: number;
  isHot?: boolean;
  isFeatured?: boolean;
  className?: string;
}

export function NewsCard({
  id,
  title,
  summary,
  image,
  source,
  sourceIcon,
  publishedAt,
  category,
  tags,
  viewCount,
  isHot,
  isFeatured,
  className,
}: NewsCardProps) {
  if (isFeatured) {
    return (
      <Link
        href={`/news/${id}`}
        className={cn(
          "group block relative overflow-hidden rounded-xl bg-card border card-hover",
          className
        )}
      >
        <div className="aspect-[16/9] relative overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-500/20 to-brand-700/20 flex items-center justify-center">
              <span className="text-4xl font-bold text-brand-500/30">N</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute top-4 left-4 flex items-center gap-2">
            {isHot && <Badge variant="danger" className="animate-pulse">热门</Badge>}
            {category && <Badge variant="secondary">{category}</Badge>}
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 line-clamp-2">
              {title}
            </h3>
            {summary && (
              <p className="text-white/80 text-sm line-clamp-2 mb-3">
                {summary}
              </p>
            )}
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <div className="flex items-center gap-1.5">
                {sourceIcon ? (
                  <Image src={sourceIcon} alt={source} width={16} height={16} className="rounded" />
                ) : (
                  <div className="w-4 h-4 rounded bg-white/20" />
                )}
                <span>{source}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatDate(publishedAt)}</span>
              </div>
              {viewCount && (
                <div className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{viewCount}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/news/${id}`}
      className={cn(
        "group flex gap-4 p-4 rounded-xl bg-card border card-hover",
        className
      )}
    >
      {image && (
        <div className="relative w-24 h-24 md:w-32 md:h-24 flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          {isHot && <Badge variant="danger" className="text-xs">热门</Badge>}
          {category && <Badge variant="secondary" className="text-xs">{category}</Badge>}
        </div>
        
        <h3 className="font-semibold text-base line-clamp-2 mb-2 group-hover:text-brand-500 transition-colors">
          {title}
        </h3>
        
        {summary && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {truncate(summary, 100)}
          </p>
        )}
        
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            {sourceIcon ? (
              <Image src={sourceIcon} alt={source} width={14} height={14} className="rounded" />
            ) : (
              <div className="w-3.5 h-3.5 rounded bg-muted" />
            )}
            <span>{source}</span>
          </div>
          <span>•</span>
          <span>{formatDate(publishedAt)}</span>
          {viewCount && (
            <>
              <span>•</span>
              <span>{viewCount} 阅读</span>
            </>
          )}
        </div>
        
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowUpRight className="w-5 h-5 text-brand-500" />
      </div>
    </Link>
  );
}
