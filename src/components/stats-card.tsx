import { cn } from "../../lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function StatsCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  className,
}: StatsCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div
      className={cn(
        "p-5 rounded-xl bg-card border card-hover",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : isNegative ? (
                <TrendingDown className="w-4 h-4 text-red-500" />
              ) : (
                <Minus className="w-4 h-4 text-gray-400" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  isPositive && "text-green-500",
                  isNegative && "text-red-500",
                  !isPositive && !isNegative && "text-gray-500"
                )}
              >
                {isPositive ? "+" : ""}
                {change}%
              </span>
              {changeLabel && (
                <span className="text-xs text-muted-foreground">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
        
        {icon && (
          <div className="p-2 rounded-lg bg-brand-500/10 text-brand-500">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
