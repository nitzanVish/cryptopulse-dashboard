import { Minus, ShieldCheck, type LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TEXT } from '@/constants/text';
import { isStablecoin } from '@/constants/stablecoins';
import type { NoSentimentBadgeProps } from '@/types/components';

interface BadgeConfig {
  Icon: LucideIcon;
  label: string;
  tooltip: string;
  className: string;
}

export const NoSentimentBadge = ({ symbol }: NoSentimentBadgeProps) => {
  const stable = symbol ? isStablecoin(symbol) : false;

  const config: BadgeConfig = stable
    ? {
        Icon: ShieldCheck,
        label: TEXT.sentiment.stableBadge,
        tooltip: TEXT.sentiment.stableTooltip,
        className:
          'text-sky-600 border-sky-300 bg-sky-50 dark:bg-sky-950 dark:border-sky-700 dark:text-sky-400 cursor-help',
      }
    : {
        Icon: Minus,
        label: TEXT.sentiment.notAvailable,
        tooltip: TEXT.sentiment.notAvailableTooltip,
        className: 'text-muted-foreground bg-transparent border-dashed cursor-not-allowed',
      };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="outline" className={`gap-1 ${config.className}`}>
          <config.Icon className="w-3 h-3" />
          {config.label}
        </Badge>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>{config.tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};
