import Link from "next/link";
import { Twitter, Heart, Repeat2, MessageCircle, Eye, BadgeCheck } from "lucide-react";
import { cn, formatNumber, formatDate } from "../../lib/utils";
import type { Tweet } from "../../lib/db";

interface TweetCardProps {
  tweet: Tweet;
  className?: string;
}

export function TweetCard({ tweet, className }: TweetCardProps) {
  const sentimentColors = {
    positive: "border-l-green-500",
    neutral: "border-l-gray-400",
    negative: "border-l-red-500",
  };

  return (
    <div
      className={cn(
        "p-5 rounded-xl bg-card border border-l-4 card-hover",
        sentimentColors[tweet.sentiment || "neutral"],
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">
            {tweet.author.name.charAt(0)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold truncate">{tweet.author.name}</span>
            {tweet.author.verified && (
              <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500" />
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>@{tweet.author.username}</span>
            <span>•</span>
            <span>{formatDate(tweet.publishedAt)}</span>
          </div>
        </div>
        <Twitter className="w-5 h-5 text-blue-500 flex-shrink-0" />
      </div>

      {/* Content */}
      <p className="text-foreground leading-relaxed mb-4">{tweet.content}</p>

      {/* Hashtags */}
      {tweet.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tweet.hashtags.map((tag) => (
            <span
              key={tag}
              className="text-sm text-blue-500 hover:underline cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <MessageCircle className="w-4 h-4" />
          <span>{formatNumber(tweet.replies)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Repeat2 className="w-4 h-4" />
          <span>{formatNumber(tweet.retweets)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Heart className="w-4 h-4" />
          <span>{formatNumber(tweet.likes)}</span>
        </div>
        {tweet.views && (
          <div className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            <span>{formatNumber(tweet.views)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
