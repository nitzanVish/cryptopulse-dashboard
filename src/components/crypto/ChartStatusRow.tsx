import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/features/crypto/cryptoUtils';
import { TEXT } from '@/constants/text';
import type { ChartStatusRowProps } from '@/types/components';

export function ChartStatusRow({
  price,
  priceChange,
  sentimentScore,
  sentimentLabel,
}: ChartStatusRowProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <p className="text-sm text-gray-400">Current Price</p>
        <p className="text-xl sm:text-2xl font-bold text-white">
          {price != null ? formatCurrency(price) : TEXT.common.notAvailable}
        </p>
      </div>
      <div className="flex items-center gap-4">
        {priceChange && (
          <div className="text-left sm:text-right">
            <p className="text-sm text-gray-400">Change</p>
            <p
              className={`text-lg sm:text-xl font-bold ${
                priceChange.change >= 0 ? 'text-green-300' : 'text-red-300'
              }`}
            >
              {priceChange.change >= 0 ? '+' : ''}
              {formatCurrency(priceChange.change)} (
              {priceChange.changePercent >= 0 ? '+' : ''}
              {priceChange.changePercent.toFixed(2)}%)
            </p>
          </div>
        )}
        {sentimentScore != null && sentimentLabel != null && (
          <div className="flex flex-col items-end">
            <p className="text-sm text-gray-400">AI Sentiment</p>
            <Badge variant={sentimentLabel} className="text-sm font-semibold px-3 py-1">
              {sentimentScore}/100
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}
