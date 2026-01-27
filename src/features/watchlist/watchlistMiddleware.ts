/**
 * Watchlist Middleware
 * 
 * Persists watchlist to LocalStorage automatically after watchlist actions.
 */

import type { Middleware } from '@reduxjs/toolkit';
import { saveWatchlistToStorage } from '@/utils/localStorage';
import type { WatchlistState } from './watchlistSlice';

export const watchlistMiddleware: Middleware<{}, { watchlist: WatchlistState }> = 
  (store) => (next) => (action) => {
    const result = next(action);
    
    if (typeof action === 'object' && action !== null && 'type' in action) {
      const actionType = String(action.type);
      if (actionType.startsWith('watchlist/')) {
        const state = store.getState();
        saveWatchlistToStorage(state.watchlist.coinIds);
      }
    }
    
    return result;
  };
