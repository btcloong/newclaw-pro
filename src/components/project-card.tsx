import Image from "next/image";
import Link from "next/link";
import { ExternalLink, TrendingUp, Users, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, formatNumber } from "@/lib/utils";

interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  logo?: string;
  category: string;
  tags?: string[];
  stars?: number;
  forks?: number;
  upvotes?: number;
  source: "github" | "producthunt" | "other";
  url: string;
  isNew?: boolean;
  isTrending?: boolean;
  className?: string;
}

export function ProjectCard({
  id,
  name,
  description,
  logo,
  category,
  tags,
  stars,
  forks,
  upvotes,
  source,
  url,
  isNew,
  isTrending,
  className,
}: ProjectCardProps) {
  const sourceConfig = {
    github: { label: "GitHub", color: "bg-gray-900 text-white" },
    producthunt: { label: "Product Hunt", color: "bg-orange-500 text-white" },
    other: { label: "其他", color: "bg-muted text-muted-foreground" },
  };

  return (
    <div
      className={cn(
        "group relative p-5 rounded-xl bg-card border card-hover",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-muted flex-shrink-0">
          {logo ? (
            <Image src={logo} alt={name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-brand-500/10">
              <span className="text-lg font-bold text-brand-500">{name.charAt(0)}</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg truncate">{name}</h3>
            {isNew && <Badge variant="success" className="text-xs">NEW</Badge>}
            {isTrending && <Badge variant="warning" className="text-xs">🔥 趋势</Badge>}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {description}
          </p>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="secondary" className="text-xs">{category}</Badge>
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                sourceConfig[source].color
              )}
            >
              {sourceConfig[source].label}
            </span>
          </div>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {stars !== undefined && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                <span>{formatNumber(stars)}</span>
              </div>
            )}
            {forks !== undefined && (
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>{formatNumber(forks)}</span>
              </div>
            )}
            {upvotes !== undefined && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{formatNumber(upvotes)} 投票</span>
              </div>
            )}
          </div>
        </div>

        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 p-2 rounded-lg hover:bg-accent transition-colors"
        >
          <ExternalLink className="w-5 h-5 text-muted-foreground" />
        </Link>
      </div>
    </div>
  );
}
