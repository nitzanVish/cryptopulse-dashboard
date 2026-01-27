/**
 * Redux slice for dynamic cryptocurrency state (WebSocket updates)
 * 
 * Architecture: Static data (logos, names) stored in RTK Query cache.
 * This slice handles only real-time updates requiring custom logic.
 * 
 * Performance optimizations:
 * - Updates only when price actually changes (prevents unnecessary re-renders)
 * - Limits history to 30 entries per coin (prevents memory leaks)
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { PriceHistory } from '../../types/crypto';

interface CryptoState {
  priceHistory: Record<string, PriceHistory[]>;
  updatedPrices: Record<string, {
    price: number;
    priceChangePercent: number;
    timestamp: number;
  }>;
}

const initialState: CryptoState = {
  priceHistory: {},
  updatedPrices: {},
};

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    updatePrice: (
      state,
      action: PayloadAction<{
        coinId: string;
        price: number;
        priceChangePercent: number;
      }>
    ) => {
      const { coinId, price, priceChangePercent } = action.payload;
      const timestamp = Date.now();
      const previousPrice = state.updatedPrices[coinId]?.price;
      
      // Only update if price actually changed (prevents unnecessary re-renders)
      if (previousPrice !== price) {
        state.updatedPrices[coinId] = {
          price,
          priceChangePercent,
          timestamp,
        };
        
        if (!state.priceHistory[coinId]) {
          state.priceHistory[coinId] = [];
        }
        
        state.priceHistory[coinId].push({ timestamp, price });
        // Keep only last 30 updates to prevent memory leaks
        state.priceHistory[coinId] = state.priceHistory[coinId].slice(-30);
      }
    },
    
    clearPriceHistory: (state, action: PayloadAction<string>) => {
      const coinId = action.payload;
      delete state.priceHistory[coinId];
      delete state.updatedPrices[coinId];
    },
  },
});

export const { updatePrice, clearPriceHistory } = cryptoSlice.actions;
export default cryptoSlice.reducer;
