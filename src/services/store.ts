/**
 * Redux store configuration
 * 
 * This file sets up the Redux store with:
 * - Crypto slice reducer (for managing dynamic price updates and history)
 * - RTK Query API reducer (for API calls and caching initial coin data)
 * - RTK Query middleware (required for RTK Query to work)
 */

import { configureStore } from '@reduxjs/toolkit';
import { cryptoApi } from '../features/crypto/cryptoApi';
import cryptoReducer from '../features/crypto/cryptoSlice';
import watchlistReducer from '../features/watchlist/watchlistSlice';
import { watchlistMiddleware } from '../features/watchlist/watchlistMiddleware';

/**
 * Redux store instance
 * 
 * Configured with:
 * - crypto: Manages dynamic state (price updates from WebSocket, price history for charts)
 * - watchlist: Manages user's favorite coins (persisted to LocalStorage)
 * - cryptoApi: Handles RTK Query API calls and caching (stores initial coin data from CoinGecko)
 */
export const store = configureStore({
  reducer: {
    // Crypto slice for managing dynamic state:
    // - Real-time price updates from WebSocket
    // - Price history for chart visualization
    crypto: cryptoReducer,
    
    // Watchlist slice for managing user's favorite coins
    watchlist: watchlistReducer,
    
    // RTK Query API reducer (dynamically uses reducerPath from cryptoApi)
    // This allows RTK Query to manage its own cache and API state
    [cryptoApi.reducerPath]: cryptoApi.reducer,
  },
  
  // Middleware configuration
  // RTK Query requires its middleware to handle API calls and caching
  // Watchlist middleware persists watchlist to LocalStorage
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cryptoApi.middleware, watchlistMiddleware),
});

/**
 * TypeScript type for the root state
 * Used for typed selectors throughout the application
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * TypeScript type for the dispatch function
 * Used for typed dispatch calls throughout the application
 */
export type AppDispatch = typeof store.dispatch;
