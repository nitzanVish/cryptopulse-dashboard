/**
 * RTK Query API for CoinGecko
 * 
 * Transforms response to optimized structure with O(1) map lookups instead of O(n) array searches.
 * Enriches data with Binance symbol mappings for WebSocket integration.
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { CoinGeckoCoin, CryptoCoin, CryptoCoinsData } from '../../types/crypto';
import { getBinanceSymbol } from '../../utils/symbolMapper';

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

export const cryptoApi = createApi({
  reducerPath: 'cryptoApi',
  baseQuery: fetchBaseQuery({
    baseUrl: COINGECKO_API_BASE,
  }),
  tagTypes: ['Crypto'],
  endpoints: (builder) => ({
    getTopCryptos: builder.query<CryptoCoinsData, void>({
      query: () => 
        '/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1',
      
      // Transform to optimized structure: O(1) map lookups instead of O(n) array.find()
      transformResponse: (response: CoinGeckoCoin[]): CryptoCoinsData => {
        const entities: Record<string, CryptoCoin> = {};
        const binanceMap: Record<string, string> = {};
        const ids: string[] = [];
        
        response.forEach((coin) => {
          const binanceSymbol = getBinanceSymbol(coin.id, coin.symbol);
          const enrichedCoin: CryptoCoin = {
            ...coin,
            binanceSymbol,
          };
          
          entities[coin.id] = enrichedCoin;
          binanceMap[binanceSymbol] = coin.id;
          ids.push(coin.id);
        });
        
        return { ids, entities, binanceMap };
      },
      
      providesTags: ['Crypto'],
    }),
  }),
});

export const { useGetTopCryptosQuery } = cryptoApi;
