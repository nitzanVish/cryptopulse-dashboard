/**
 * Sentiment-related constants
 */

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { ComponentType } from 'react';
import type { SentimentLabel } from '@/types/sentiment';

/**
 * Mapping of sentiment labels to icon components
 */
export const SENTIMENT_ICON_MAP: Record<SentimentLabel, ComponentType<{ className?: string }>> = {
  bullish: TrendingUp,
  bearish: TrendingDown,
  neutral: Minus,
} as const;
