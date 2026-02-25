import { Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TEXT } from '@/constants/text';

/**
 * NoSentimentBadge Component
 * 
 * Displays a placeholder badge when sentiment data is not available.
 * Prevents empty cells in the table and provides user feedback.
 */
export const NoSentimentBadge = () => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Badge
        variant="outline"
        className="text-muted-foreground bg-transparent border-dashed cursor-not-allowed gap-1"
      >
        <Minus className="w-3 h-3" />
        {TEXT.sentiment.notAvailable}
      </Badge>
    </TooltipTrigger>
    <TooltipContent>
      <p>{TEXT.sentiment.notAvailableTooltip}</p>
    </TooltipContent>
  </Tooltip>
);
