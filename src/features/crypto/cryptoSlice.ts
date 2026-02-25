/**
 * Redux slice for dynamic cryptocurrency state (WebSocket updates)
 *
 * Architecture: Static data (logos, names) in RTK Query cache.
 * This slice holds only the latest price per coin for live display and chart tip.
 * Chart history comes from CoinGecko API (getMarketChart), not from this slice.
 *
 * Performance: Updates only when price actually changes (prevents unnecessary re-renders).
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface CryptoState {
  updatedPrices: Record<string, {
    price: number;
    priceChangePercent: number;
    timestamp: number;
  }>;
}

const initialState: CryptoState = {
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

      if (previousPrice !== price) {
        state.updatedPrices[coinId] = {
          price,
          priceChangePercent,
          timestamp,
        };
      }
    },
  },
});

export const { updatePrice } = cryptoSlice.actions;
export default cryptoSlice.reducer;
