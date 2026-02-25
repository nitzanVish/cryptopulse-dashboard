import { memo } from 'react';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useGetAllSentimentsQuery } from '@/features/sentiment/sentimentApi';
import { formatTimestamp } from '@/utils/dateUtils';
import { SENTIMENT_ICON_MAP } from '@/constants/sentiment';
import { NoSentimentBadge } from './NoSentimentBadge';
import type { SentimentBadgeProps } from '@/types/sentiment';

export const SentimentBadge = memo<SentimentBadgeProps>(({ symbol }) => {
  const symbolLower = symbol.toLowerCase();
  const { sentimentData, isLoading } = useGetAllSentimentsQuery(undefined, {
    selectFromResult: ({ data, isLoading }) => {
      return {
        sentimentData: data?.[symbolLower],
        isLoading,
      };
    },
  });

  if (isLoading) {
    return (
      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
    );
  }

  if (!sentimentData) {
    return <NoSentimentBadge />;
  }

  const { sentiment, score, timestamp, analysis } = sentimentData;
  const IconComponent = SENTIMENT_ICON_MAP[sentiment];
  const formattedTimestamp = formatTimestamp(timestamp);
  const sentimentDisplay = sentiment.charAt(0).toUpperCase() + sentiment.slice(1);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant={sentiment} className="gap-1 cursor-help">
          <IconComponent className="w-3 h-3" />
          {sentimentDisplay}
        </Badge>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs p-3">
        <div className="space-y-2">
          <p className="text-sm leading-relaxed">{analysis}</p>
          <div className="text-xs text-muted-foreground border-t pt-2 flex justify-between">
            <span>Score: {score}/100</span>
            <span>{formattedTimestamp}</span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
});

SentimentBadge.displayName = 'SentimentBadge';
