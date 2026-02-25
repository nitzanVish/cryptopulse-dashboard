/**
 * ChartTooltip Component
 *
 * Recharts tooltip for price chart: shows time and formatted price.
 */

import { formatCurrency } from '@/features/crypto/cryptoUtils';
import { formatTimeAxis } from '@/utils/dateUtils';
import type { ChartTooltipProps } from '@/types/chart';

export type { ChartTooltipPayloadItem, ChartTooltipProps } from '@/types/chart';

export function ChartTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0];
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-3">
      <p className="text-sm text-gray-400">
        {formatTimeAxis(data.payload.timestamp)}
      </p>
      <p className="text-lg font-semibold text-white">
        {formatCurrency(data.value)}
      </p>
    </div>
  );
}
