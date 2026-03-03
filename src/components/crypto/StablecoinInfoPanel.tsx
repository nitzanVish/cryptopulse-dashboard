import { ShieldCheck } from 'lucide-react';
import { TEXT } from '@/constants/text';
import { cn } from '@/lib/utils';
import type { StablecoinInfoPanelProps } from '@/types/components';

export function StablecoinInfoPanel({ className }: StablecoinInfoPanelProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-sky-700 bg-sky-950/50 p-4 space-y-3',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
        <h3 className="text-sm font-semibold text-sky-200">
          {TEXT.sentiment.stableInfoTitle}
        </h3>
      </div>
      <p className="text-sm leading-relaxed text-sky-300/80">
        {TEXT.sentiment.stableInfoBody}
      </p>
    </div>
  );
}
