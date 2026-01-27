/**
 * PriceChart Component
 * 
 * Displays real-time price history chart. Single modal instance managed at table level.
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppSelector } from '@/hooks/redux';
import { formatCurrency } from '@/features/crypto/cryptoUtils';
import type { CryptoCoin } from '@/types/crypto';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PriceChartProps {
  coin: CryptoCoin | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { timestamp: number } }> }) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0];
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-3">
      <p className="text-sm text-gray-400">
        {formatTime(data.payload.timestamp)}
      </p>
      <p className="text-lg font-semibold text-white">
        {formatCurrency(data.value)}
      </p>
    </div>
  );
}

export function PriceChart({ coin, open, onOpenChange }: PriceChartProps) {
  if (!coin || !open) return null;

  // Real-time updates: subscribes only to this coin's price history
  const priceHistory = useAppSelector((state) => 
    state.crypto.priceHistory[coin.id] ?? []
  );

  const currentPrice = useAppSelector((state) => {
    const update = state.crypto.updatedPrices[coin.id];
    return update?.price ?? coin.current_price;
  });

  // No useMemo needed: small dataset (30 items) and modal resets on each open
  const chartData = priceHistory.map((entry) => ({
    timestamp: entry.timestamp,
    price: entry.price,
    time: formatTime(entry.timestamp),
  }));
  const firstPrice = chartData[0]?.price;
  const lastPrice = chartData[chartData.length - 1]?.price;
  const priceChange = chartData.length >= 2 && firstPrice
    ? {
        change: lastPrice - firstPrice,
        changePercent: ((lastPrice - firstPrice) / firstPrice) * 100,
      }
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-5xl bg-slate-900 text-white border-slate-700 max-h-[90vh] overflow-y-auto">
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
              {currentPrice ? formatCurrency(currentPrice) : 'N/A'}
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

        {chartData.length > 0 ? (
          <div className="h-64 sm:h-80 lg:h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.5} />
                <XAxis
                  dataKey="time"
                  className="text-xs text-gray-400"
                  tick={{ fill: '#9ca3af' }}
                />
                <YAxis
                  className="text-xs text-gray-400"
                  tick={{ fill: '#9ca3af' }}
                  tickFormatter={(value) => formatCurrency(value)}
                  domain={['auto', 'auto']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-96 flex items-center justify-center text-gray-400">
            <p>No price history available yet. Price updates will appear here as they arrive.</p>
          </div>
        )}

        <p className="text-xs text-gray-400 text-center">
          Showing last {chartData.length} price update{chartData.length !== 1 ? 's' : ''} from WebSocket
        </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
