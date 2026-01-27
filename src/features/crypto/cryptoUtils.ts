/**
 * Crypto Utilities
 * 
 * Utility functions for cryptocurrency data manipulation and formatting.
 * Keeps components clean by extracting reusable logic.
 */

import type { CryptoCoin } from '@/types/crypto';
import { TEXT } from '@/constants/text';

/**
 * Filters coins by search term (name or symbol)
 * Case-insensitive search
 * 
 * @param coinsData - CryptoCoinsData structure with entities and ids
 * @param searchTerm - Search term to filter by
 * @returns Filtered array of coin IDs
 */
export function filterCoins(
  coinsData: { ids: string[]; entities: Record<string, CryptoCoin> },
  searchTerm: string
): string[] {
  if (!searchTerm.trim()) {
    return coinsData.ids; // Return all IDs if no search term
  }

  const lowerSearchTerm = searchTerm.toLowerCase();
  return coinsData.ids.filter((coinId) => {
    const coin = coinsData.entities[coinId];
    return (
      coin.name.toLowerCase().includes(lowerSearchTerm) ||
      coin.symbol.toLowerCase().includes(lowerSearchTerm)
    );
  });
}

/**
 * Formats a number as currency (USD)
 * 
 * @param value - Number to format
 * @param options - Optional formatting options
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: options?.minimumFractionDigits ?? 2,
    maximumFractionDigits: options?.maximumFractionDigits ?? 6,
  }).format(value);
}

/**
 * Formats a number as compact currency (e.g., $1.2B for market cap)
 * 
 * @param value - Number to format
 * @returns Formatted compact currency string
 */
export function formatCompactCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Formats percentage change
 * 
 * @param value - Percentage value (can be null/undefined)
 * @returns Formatted percentage string (e.g., "+5.23%" or "-2.10%")
 */
export function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined) return TEXT.common.notAvailable;
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Gets Tailwind CSS color class based on price change
 * Green for positive changes, red for negative changes
 * 
 * @param change - Price change percentage (can be null/undefined)
 * @returns Tailwind CSS color class string
 */
export function getPriceChangeColor(change: number | null | undefined): string {
  if (change === null || change === undefined) return 'text-gray-500';
  return change >= 0 
    ? 'text-green-600 dark:text-green-400' 
    : 'text-red-600 dark:text-red-400';
}
