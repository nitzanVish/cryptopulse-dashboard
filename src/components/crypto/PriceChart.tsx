/**
 * PriceChart Component
 *
 * Hybrid chart: 24h history from CoinGecko API + live price at the last point from WebSocket.
 * Includes AI sentiment status row and insight panel when sentiment data is available.
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppSelector } from '@/hooks/redux';
import { useGetMarketChartQuery } from '@/features/crypto/cryptoApi';
import { useGetAllSentimentsQuery } from '@/features/sentiment/sentimentApi';
import { formatCurrency } from '@/features/crypto/cryptoUtils';
import type { PriceChartProps } from '@/types/components';
import { useChartData } from '@/hooks/useChartData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loading } from '@/components/ui/loading';
import { ChartTooltip } from './ChartTooltip';
import { ChartStatusRow } from './ChartStatusRow';
import { AIInsightPanel } from './AIInsightPanel';
import { StablecoinInfoPanel } from './StablecoinInfoPanel';
import { TEXT } from '@/constants/text';
import { isStablecoin } from '@/constants/stablecoins';
import {
  CHART_LINE_COLOR,
  CHART_GRID_STROKE,
  CHART_Y_DOMAIN_MARGIN_MIN,
  CHART_Y_DOMAIN_MARGIN_MAX,
  CHART_DOT_RADIUS,
} from '@/constants/chart';
import { Loader2 } from 'lucide-react';

export function PriceChart({ coin, open, onOpenChange }: PriceChartProps) {
  const { data: historyData, isLoading } = useGetMarketChartQuery(coin?.id ?? '', {
    skip: !coin || !open,
  });

  const { sentimentData, isLoading: sentimentLoading } = useGetAllSentimentsQuery(undefined, {
    skip: !open || !coin,
    selectFromResult: ({ data, isLoading }) => ({
      sentimentData: coin ? data?.[coin.symbol.toLowerCase()] : undefined,
      isLoading,
    }),
  });

  const currentPrice = useAppSelector((state) => {
    if (!coin) return undefined;
    const update = state.crypto.updatedPrices[coin.id];
    return update?.price ?? coin.current_price;
  });

  const { chartData, priceChange } = useChartData(historyData, currentPrice);

  if (!coin) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[95vw] max-w-5xl bg-slate-900 text-white border-slate-700 max-h-[90vh] overflow-y-auto"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-white text-lg sm:text-xl">
            {coin.name} ({coin.symbol.toUpperCase()}) Price Chart
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
        <ChartStatusRow
          price={currentPrice}
          priceChange={priceChange}
          sentimentScore={sentimentData?.score ?? null}
          sentimentLabel={sentimentData?.sentiment ?? null}
        />

        {isLoading ? (
          <div className="h-64 sm:h-80 lg:h-96 w-full flex items-center justify-center">
            <Loading message={TEXT.chart.loading} />
          </div>
        ) : chartData.length > 0 ? (
          <div className="w-full" style={{ height: 384 }}>
            <ResponsiveContainer width="100%" height={384}>
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_GRID_STROKE} opacity={0.5} />
                <XAxis
                  dataKey="time"
                  className="text-xs text-gray-400"
                  tick={{ fill: '#9ca3af' }}
                />
                <YAxis
                  width={90}
                  className="text-xs text-gray-400"
                  tick={{ fill: '#9ca3af' }}
                  tickFormatter={(value) => formatCurrency(value)}
                  domain={[
                    (dataMin: number) => dataMin * CHART_Y_DOMAIN_MARGIN_MIN,
                    (dataMax: number) => dataMax * CHART_Y_DOMAIN_MARGIN_MAX,
                  ]}
                />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="linear"
                  dataKey="price"
                  stroke={CHART_LINE_COLOR}
                  strokeWidth={3}
                  dot={({ cx, cy, index }) =>
                    index === chartData.length - 1 ? (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={CHART_DOT_RADIUS}
                        fill={CHART_LINE_COLOR}
                        className="animate-pulse"
                      />
                    ) : null
                  }
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 sm:h-80 lg:h-96 flex items-center justify-center text-gray-400">
            <p>{TEXT.chart.noData}</p>
          </div>
        )}

        <p className="text-xs text-gray-400 text-center">
          {TEXT.chart.footer}
        </p>

        {sentimentLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{TEXT.chart.loadingSentiment}</span>
          </div>
        )}
        {!sentimentLoading && sentimentData && (
          <AIInsightPanel
            analysis={sentimentData.analysis}
            timestamp={sentimentData.timestamp}
            score={sentimentData.score}
            sentiment={sentimentData.sentiment}
          />
        )}
        {!sentimentLoading && !sentimentData && coin && isStablecoin(coin.symbol) && (
          <StablecoinInfoPanel />
        )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
