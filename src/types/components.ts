/**
 * Component prop interfaces
 *
 * Centralized type definitions for component props across the application.
 */

import type { CryptoCoin } from './crypto';

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
