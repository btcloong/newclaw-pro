import { cn } from "../../lib/utils";
import { Building2, DollarSign, Calendar, Users } from "lucide-react";
import { Badge } from "../../components/ui/badge";

interface FundingCardProps {
  id: string;
  companyName: string;
  logo?: string;
  amount: string;
  round: string;
  date: string;
  investors: string[];
  category: string;
  description?: string;
  className?: string;
}

export function FundingCard({
  id,
  companyName,
  logo,
  amount,
  round,
  date,
  investors,
  category,
  description,
  className,
}: FundingCardProps) {
  return (
    <div
      className={cn(
        "group p-5 rounded-xl bg-card border card-hover",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
            {logo ? (
              <img src={logo} alt={companyName} className="w-8 h-8 rounded" />
            ) : (
              <Building2 className="w-6 h-6 text-brand-500" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{companyName}</h3>
            <Badge variant="secondary" className="text-xs">{category}</Badge>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-xl font-bold text-brand-500">
            <DollarSign className="w-5 h-5" />
            {amount}
          </div>
          <div className="text-sm text-muted-foreground">{round}</div>
        </div>
      </div>

      {description && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">{date}</span>
        </div>

        <div className="flex items-start gap-2 text-sm">
          <Users className="w-4 h-4 text-muted-foreground mt-0.5" />
          <div className="flex flex-wrap gap-1">
            {investors.map((investor) => (
              <span
                key={investor}
                className="px-2 py-0.5 rounded-full bg-muted text-xs"
              >
                {investor}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
