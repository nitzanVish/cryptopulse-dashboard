/**
 * useChartData Hook
 *
 * Encapsulates hybrid chart merge logic: combines 24h history with live price at the last point.
 * Keeps PriceChart focused on presentation; data merging and price-change computation live here.
 * No useMemo: currentPrice changes frequently via WebSocket, so memoization adds overhead without benefit.
 */

import type { ChartDataPoint, PriceChangeInfo } from '@/types/chart';

export function useChartData(
  historyData: ChartDataPoint[] | undefined,
  currentPrice: number | undefined
) {
  let chartData: ChartDataPoint[] = [];
  if (historyData && historyData.length > 0) {
    chartData = [...historyData];
    if (currentPrice != null) {
      const lastIndex = chartData.length - 1;
      // Create a new object for the last point so we don't mutate the RTK Query cache
      chartData[lastIndex] = { ...chartData[lastIndex], price: currentPrice };
    }
  }

  const firstPrice = chartData[0]?.price;
  const lastPrice = chartData[chartData.length - 1]?.price;
  const priceChange: PriceChangeInfo | null =
    chartData.length >= 2 && firstPrice != null && lastPrice != null
      ? {
          change: lastPrice - firstPrice,
          changePercent: ((lastPrice - firstPrice) / firstPrice) * 100,
        }
      : null;

  return { chartData, priceChange };
}
