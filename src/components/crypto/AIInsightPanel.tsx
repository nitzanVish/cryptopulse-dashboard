/**
 * AIInsightPanel - Presentational panel showing AI sentiment analysis below the chart.
 * Title + icon, analysis text, and "Last updated" relative time.
 */

import { Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime } from '@/utils/dateUtils';
import { TEXT } from '@/constants/text';
import type { AIInsightPanelProps } from '@/types/components';
import { cn } from '@/lib/utils';

export function AIInsightPanel({
  analysis,
  timestamp,
  score,
  sentiment,
  className,
}: AIInsightPanelProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-slate-600 bg-slate-800/50 p-4 space-y-3',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
        <h3 className="text-sm font-semibold text-gray-200">
          {TEXT.chart.aiInsightTitle}
        </h3>
        <Badge variant={sentiment} className="ml-auto text-xs">
          {score}/100
        </Badge>
      </div>
      <p className="text-sm leading-relaxed text-gray-300">{analysis}</p>
      <p className="text-xs text-gray-500 border-t border-slate-600 pt-2">
        {TEXT.chart.lastUpdated}: {formatRelativeTime(timestamp)}
      </p>
    </div>
  );
}
