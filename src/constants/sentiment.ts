import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import type { ComponentType } from 'react';
import type { SentimentLabel } from '@/types/sentiment';

/** Slice name for Redux devtools */
export const SENTIMENT_SLICE_NAME = 'sentiment';

/** Initial lastGlobalAnalysisTrigger (0 = never triggered) */
export const SENTIMENT_INITIAL_LAST_TRIGGER = 0;

export const SENTIMENT_ICON_MAP: Record<SentimentLabel, ComponentType<{ className?: string }>> = {
  bullish: ArrowUp,
  bearish: ArrowDown,
  neutral: Minus,
} as const;
