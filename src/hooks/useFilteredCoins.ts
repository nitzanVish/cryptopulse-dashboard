/**
 * useFilteredCoins Hook
 *
 * Encapsulates table filtering business logic: search (debounced) and watchlist toggle.
 * Keeps CryptoTable focused on presentation; filtering and derived list live here.
 */

import { useState, useMemo } from 'react';
import { filterCoins } from '@/features/crypto/cryptoUtils';
import { useDebounce } from '@/hooks/useDebounce';
import { useAppSelector } from '@/hooks/redux';
import { SEARCH_DEBOUNCE_MS } from '@/constants/ui';
import type { CryptoCoinsData } from '@/types/crypto';

export function useFilteredCoins(coinsData: CryptoCoinsData | undefined) {
  const watchlistMap = useAppSelector((state) => state.watchlist.coinIds);
  const [searchTerm, setSearchTerm] = useState('');
  const [showWatchlistOnly, setShowWatchlistOnly] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_DEBOUNCE_MS);

  // useMemo: debounced search + stable deps avoid recompute on every keystroke (unlike useChartData where currentPrice changes every tick)
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

  return {
    filteredCoinIds,
    searchTerm,
    setSearchTerm,
    showWatchlistOnly,
    setShowWatchlistOnly,
    watchlistMap,
  };
}
