/**
 * PriceChart Component
 *
 * Hybrid chart: 24h history from CoinGecko API + live price at the last point from WebSocket.
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppSelector } from '@/hooks/redux';
import { useGetMarketChartQuery } from '@/features/crypto/cryptoApi';
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
import { TEXT } from '@/constants/text';
import {
  CHART_LINE_COLOR,
  CHART_GRID_STROKE,
  CHART_Y_DOMAIN_MARGIN_MIN,
  CHART_Y_DOMAIN_MARGIN_MAX,
  CHART_DOT_RADIUS,
} from '@/constants/chart';

export function PriceChart({ coin, open, onOpenChange }: PriceChartProps) {
  const { data: historyData, isLoading } = useGetMarketChartQuery(coin?.id ?? '', {
    skip: !coin || !open,
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-400">Current Price</p>
            <p className="text-xl sm:text-2xl font-bold text-white">
              {currentPrice ? formatCurrency(currentPrice) : TEXT.common.notAvailable}
            </p>
          </div>
          {priceChange && (
            <div className="text-left sm:text-right">
              <p className="text-sm text-gray-400">Change</p>
              <p
                className={`text-lg sm:text-xl font-semibold ${
                  priceChange.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {priceChange.change >= 0 ? '+' : ''}
                {formatCurrency(priceChange.change)} ({priceChange.changePercent >= 0 ? '+' : ''}
                {priceChange.changePercent.toFixed(2)}%)
              </p>
            </div>
          )}
        </div>

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
                  width={80}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
