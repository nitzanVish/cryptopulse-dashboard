/**
 * Watchlist Slice
 * 
 * Uses Record<string, boolean> instead of array for O(1) lookups and
 * per-coin subscriptions, preventing re-renders when other coins are added/removed.
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface WatchlistState {
  /**
   * Map of coin IDs that are in the watchlist
   * Map structure: coinId -> true (if in watchlist)
   * This allows O(1) lookup and per-coin subscriptions
   */
  coinIds: Record<string, boolean>;
}
function loadWatchlistFromStorage(): Record<string, boolean> {
  try {
    const stored = localStorage.getItem('cryptopulse-watchlist');
    if (stored) {
      const coinIdsArray = JSON.parse(stored) as string[];
      return coinIdsArray.reduce((acc, coinId) => {
        acc[coinId] = true;
        return acc;
      }, {} as Record<string, boolean>);
    }
  } catch (error) {
    console.error('Failed to load watchlist from LocalStorage:', error);
  }
  return {};
}

const initialState: WatchlistState = {
  coinIds: loadWatchlistFromStorage(),
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    addToWatchlist: (state, action: PayloadAction<string>) => {
      const coinId = action.payload;
      if (!state.coinIds[coinId]) {
        state.coinIds[coinId] = true;
      }
    },
    
    removeFromWatchlist: (state, action: PayloadAction<string>) => {
      const coinId = action.payload;
      // Immutable update using destructuring
      const { [coinId]: _, ...rest } = state.coinIds;
      state.coinIds = rest;
    },
    
    toggleWatchlist: (state, action: PayloadAction<string>) => {
      const coinId = action.payload;
      if (state.coinIds[coinId]) {
        const { [coinId]: _, ...rest } = state.coinIds;
        state.coinIds = rest;
      } else {
        state.coinIds[coinId] = true;
      }
    },
  },
});

export const { addToWatchlist, removeFromWatchlist, toggleWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;

export const selectWatchlist = (state: { watchlist: WatchlistState }) => 
  Object.keys(state.watchlist.coinIds);

export const selectIsInWatchlist = (coinId: string) => (state: { watchlist: WatchlistState }) =>
  state.watchlist.coinIds[coinId] ?? false;
