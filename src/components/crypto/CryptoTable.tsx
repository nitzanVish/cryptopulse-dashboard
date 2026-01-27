/**
 * CryptoTable Component
 * 
 * Performance-optimized "dumb" component that delegates real-time updates to individual rows.
 * Each CryptoRow subscribes only to its own price updates, preventing unnecessary re-renders
 * when other coins' prices change.
 */

import { useState, useMemo, useCallback } from 'react';
import { useGetTopCryptosQuery } from '@/features/crypto/cryptoApi';
import { filterCoins } from '@/features/crypto/cryptoUtils';
import { DataCard, TableSkeleton, ErrorMessage, EmptyState } from '@/components/ui';
import { Table, TableHeader, TableHead, TableBody, TableRow } from '@/components/ui/table';
import { CryptoRow } from './CryptoRow';
import { PriceChart } from './PriceChart';
import { SearchBar } from './SearchBar';
import { useDebounce } from '@/hooks/useDebounce';
import { useAppSelector } from '@/hooks/redux';
import { Button } from '@/components/ui/button';
import { TEXT } from '@/constants/text';
import type { CryptoCoin } from '@/types/crypto';
export function CryptoTable() {
  const { data: coinsData, isLoading, error } = useGetTopCryptosQuery();
  const watchlistMap = useAppSelector((state) => state.watchlist.coinIds);
  const [showWatchlistOnly, setShowWatchlistOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [selectedCoin, setSelectedCoin] = useState<CryptoCoin | null>(null);

  // Stable function reference prevents creating new function on each render
  const handleSelectCoin = useCallback((coin: CryptoCoin) => {
    setSelectedCoin(coin);
  }, []);

  // O(1) map lookup for watchlist filtering instead of O(n) array.includes()
  const filteredCoinIds = useMemo(() => {
    if (!coinsData) return [];
    
    let coinIdsToFilter = coinsData.ids;
    if (showWatchlistOnly) {
      coinIdsToFilter = coinIdsToFilter.filter((id) => watchlistMap[id] === true);
    }
    
    return filterCoins(
      { ids: coinIdsToFilter, entities: coinsData.entities },
      debouncedSearchTerm
    );
  }, [coinsData, showWatchlistOnly, watchlistMap, debouncedSearchTerm]);
  if (isLoading) {
    return (
      <DataCard title={TEXT.cryptoTable.title}>
        <TableSkeleton rowCount={10} />
      </DataCard>
    );
  }

  if (error) {
    return (
      <DataCard title={TEXT.cryptoTable.title}>
        <ErrorMessage 
          error={error}
          message={TEXT.cryptoTable.error}
        />
      </DataCard>
    );
  }

  if (!coinsData || coinsData.ids.length === 0) {
    return (
      <DataCard title={TEXT.cryptoTable.title}>
        <EmptyState message={TEXT.cryptoTable.empty} />
      </DataCard>
    );
  }

  // Main content - table with cryptocurrency data and search
  return (
    <DataCard title={TEXT.cryptoTable.title}>
      <div className="mb-4 flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
        <Button
          variant={showWatchlistOnly ? 'default' : 'outline'}
          onClick={() => setShowWatchlistOnly(!showWatchlistOnly)}
          className="whitespace-nowrap w-full sm:w-auto"
        >
          {showWatchlistOnly ? TEXT.watchlist.showAll : TEXT.watchlist.showWatchlist}
        </Button>
      </div>
      
      {filteredCoinIds.length === 0 ? (
        <EmptyState 
          message={
            showWatchlistOnly
              ? Object.keys(watchlistMap).length === 0
                ? TEXT.watchlist.empty
                : TEXT.watchlist.emptyWithSearch
              : TEXT.search.noResults
          } 
        />
      ) : (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">{TEXT.tableHeaders.coin}</TableHead>
                <TableHead className="min-w-[120px]">{TEXT.tableHeaders.price}</TableHead>
                <TableHead className="hidden sm:table-cell min-w-[100px]">{TEXT.tableHeaders.change24h}</TableHead>
                <TableHead className="hidden md:table-cell min-w-[120px]">{TEXT.tableHeaders.marketCap}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCoinIds.map((coinId) => {
                const coin = coinsData.entities[coinId];
                return (
                  <CryptoRow
                    key={coinId}
                    coin={coin}
                    onSelect={handleSelectCoin}
                  />
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
      
      <PriceChart
        coin={selectedCoin}
        open={selectedCoin !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedCoin(null);
          }
        }}
      />
    </DataCard>
  );
}
