/**
 * Component prop interfaces
 *
 * Centralized type definitions for component props across the application.
 */

import type { CryptoCoin } from './crypto';
import type { PriceChangeInfo } from './chart';
import type { SentimentLabel } from './sentiment';

export interface CryptoRowProps {
  coin: CryptoCoin;
  onSelect: (coin: CryptoCoin) => void;
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface PriceChartProps {
  coin: CryptoCoin | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface PriceTagProps {
  price: number;
  className?: string;
}

export interface ChartStatusRowProps {
  price: number | undefined;
  priceChange: PriceChangeInfo | null;
  sentimentScore: number | null;
  sentimentLabel: SentimentLabel | null;
}

export interface AIInsightPanelProps {
  analysis: string;
  timestamp: string;
  score: number;
  sentiment: SentimentLabel;
  className?: string;
}

export interface NoSentimentBadgeProps {
  symbol?: string;
}

export interface StablecoinInfoPanelProps {
  className?: string;
}
