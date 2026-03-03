/**
 * CryptoTable Component
 * 
 * Performance-optimized "dumb" component that delegates real-time updates to individual rows.
 * Each CryptoRow subscribes only to its own price updates, preventing unnecessary re-renders
 * when other coins' prices change.
 */

import { useState, useCallback } from 'react';
import { useGetTopCryptosQuery } from '@/features/crypto/cryptoApi';
import { DataCard, TableSkeleton, ErrorMessage, EmptyState } from '@/components/ui';
import { Table, TableHeader, TableHead, TableBody, TableRow } from '@/components/ui/table';
import { CryptoRow } from './CryptoRow';
import { PriceChart } from './PriceChart';
import { SearchBar } from './SearchBar';
import { useFilteredCoins } from '@/hooks/useFilteredCoins';
import { Button } from '@/components/ui/button';
import { TEXT } from '@/constants/text';
import type { CryptoCoin } from '@/types/crypto';

export function CryptoTable() {
  const { data: coinsData, isLoading, error } = useGetTopCryptosQuery();
  const {
    filteredCoinIds,
    searchTerm,
    setSearchTerm,
    showWatchlistOnly,
    setShowWatchlistOnly,
    watchlistMap,
  } = useFilteredCoins(coinsData);
  const [selectedCoin, setSelectedCoin] = useState<CryptoCoin | null>(null);

  const handleSelectCoin = useCallback((coin: CryptoCoin) => {
    setSelectedCoin(coin);
  }, []);
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
                <TableHead className="sticky left-0 z-10 bg-white dark:bg-zinc-950 min-w-[180px]">{TEXT.tableHeaders.coin}</TableHead>
                <TableHead className="min-w-[110px]">{TEXT.tableHeaders.price}</TableHead>
                <TableHead className="min-w-[90px]">{TEXT.tableHeaders.change24h}</TableHead>
                <TableHead className="min-w-[100px]">{TEXT.tableHeaders.marketCap}</TableHead>
                <TableHead className="min-w-[100px]">{TEXT.tableHeaders.sentiment}</TableHead>
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
