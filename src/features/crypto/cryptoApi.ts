/**
 * RTK Query API for CoinGecko
 * 
 * Transforms response to optimized structure with O(1) map lookups instead of O(n) array searches.
 * Enriches data with Binance symbol mappings for WebSocket integration.
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  CoinGeckoCoin,
  CoinGeckoMarketChartResponse,
  CryptoCoin,
  CryptoCoinsData,
} from '../../types/crypto';
import type { ChartDataPoint } from '../../types/chart';
import { getBinanceSymbol } from '../../utils/symbolMapper';
import { formatTimeAxis } from '../../utils/dateUtils';
import { API_CONFIG, COINGECKO_BASE_URL } from '../../constants/api';

export const cryptoApi = createApi({
  reducerPath: API_CONFIG.REDUCER_PATHS.CRYPTO,
  baseQuery: fetchBaseQuery({
    baseUrl: COINGECKO_BASE_URL,
  }),
  tagTypes: [API_CONFIG.TAG_TYPES.CRYPTO],
  endpoints: (builder) => ({
    getMarketChart: builder.query<ChartDataPoint[], string>({
      query: (id) => `/coins/${id}/market_chart?vs_currency=usd&days=1`,
      transformResponse: (response: CoinGeckoMarketChartResponse): ChartDataPoint[] => {
        if (!response?.prices?.length) return [];
        return response.prices.map(([timestamp, price]) => ({
          timestamp,
          price,
          time: formatTimeAxis(timestamp),
        }));
      },
      keepUnusedDataFor: API_CONFIG.CACHE.CHART_KEEP_UNUSED_DATA_FOR,
    }),
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
      
      providesTags: [API_CONFIG.TAG_TYPES.CRYPTO],
    }),
  }),
});

export const { useGetTopCryptosQuery, useGetMarketChartQuery } = cryptoApi;
