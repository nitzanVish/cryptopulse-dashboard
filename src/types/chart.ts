/**
 * Chart-related type definitions
 *
 * Types for price chart data, tooltip payload, and price change display.
 */

/** Single data point for the price line chart (Recharts) */
export interface ChartDataPoint {
  timestamp: number;
  price: number;
  time: string;
}

/** Price change over the chart period (first vs last point) */
export interface PriceChangeInfo {
  change: number;
  changePercent: number;
}

/** Tooltip payload item from Recharts (value = price, payload has timestamp) */
export interface ChartTooltipPayloadItem {
  value: number;
  payload: { timestamp: number };
}

/** Props passed to ChartTooltip by Recharts Tooltip */
export interface ChartTooltipProps {
  active?: boolean;
  payload?: ChartTooltipPayloadItem[];
}
