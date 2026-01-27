/**
 * CryptoRow Component
 * 
 * Performance-optimized with React.memo - each row subscribes only to its own
 * price updates, preventing re-renders when other coins' prices change.
 */

import { memo } from 'react';
import type { CryptoCoin } from '@/types/crypto';
import { TableRow, TableCell } from '@/components/ui/table';
import {
  formatPercentage,
  formatCompactCurrency,
  getPriceChangeColor,
} from '@/features/crypto/cryptoUtils';
import { PriceTag } from './PriceTag';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { toggleWatchlist, selectIsInWatchlist } from '@/features/watchlist/watchlistSlice';
import { Star } from 'lucide-react';
import { TEXT } from '@/constants/text';

interface CryptoRowProps {
  coin: CryptoCoin;
  onSelect: (coin: CryptoCoin) => void;
}
export const CryptoRow = memo<CryptoRowProps>(({ coin, onSelect }) => {
  const dispatch = useAppDispatch();
  
  // Per-coin subscription: only re-renders when THIS coin's price changes
  const priceUpdate = useAppSelector((state) => state.crypto.updatedPrices[coin.id]);
  const isInWatchlist = useAppSelector(selectIsInWatchlist(coin.id));
  
  const handleToggleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleWatchlist(coin.id));
  };

  const handleRowClick = () => {
    onSelect(coin);
  };
  
  const currentPrice = priceUpdate?.price ?? coin.current_price;
  const priceChangePercent = priceUpdate?.priceChangePercent ?? coin.price_change_percentage_24h;

  return (
    <TableRow 
      onClick={handleRowClick}
      className="cursor-pointer hover:bg-muted/50 transition-colors"
    >
      <TableCell>
        <div className="flex items-center gap-3">
          <img
            src={coin.image}
            alt={coin.name}
            className="w-8 h-8 rounded-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="%23ccc"/></svg>';
            }}
          />
          <div className="flex flex-col">
            <span className="font-medium">{coin.name}</span>
            <span className="text-sm text-muted-foreground uppercase">{coin.symbol}</span>
          </div>
          <button
            onClick={handleToggleWatchlist}
            className="ml-auto p-1 hover:bg-muted rounded transition-colors"
            aria-label={isInWatchlist ? TEXT.watchlist.removeFromWatchlist : TEXT.watchlist.addToWatchlist}
            title={isInWatchlist ? TEXT.watchlist.removeFromWatchlist : TEXT.watchlist.addToWatchlist}
          >
            <Star
              className={`w-5 h-5 transition-colors ${
                isInWatchlist
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted-foreground hover:text-yellow-400'
              }`}
            />
          </button>
        </div>
      </TableCell>

      <TableCell>
        <PriceTag price={currentPrice} />
      </TableCell>

      <TableCell className="hidden sm:table-cell">
        <span className={getPriceChangeColor(priceChangePercent)}>
          {formatPercentage(priceChangePercent)}
        </span>
      </TableCell>

      <TableCell className="hidden md:table-cell">
        <span className="text-muted-foreground">
          {formatCompactCurrency(coin.market_cap)}
        </span>
      </TableCell>
    </TableRow>
  );
}, (prevProps, nextProps) => {
  // Custom comparison: only compare static props. Price updates trigger re-render
  // via useAppSelector regardless of this comparison.
  return (
    prevProps.coin.id === nextProps.coin.id &&
    prevProps.coin.name === nextProps.coin.name &&
    prevProps.coin.symbol === nextProps.coin.symbol &&
    prevProps.coin.image === nextProps.coin.image &&
    prevProps.coin.market_cap === nextProps.coin.market_cap
  );
});

CryptoRow.displayName = 'CryptoRow';
