/**
 * RTK Query API for Sentiment Analysis
 *
 * Fetches all sentiments in a single request and transforms to map structure
 * for efficient O(1) lookups by symbol. Triggers on-demand analysis for missing coins.
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ApiSentimentResponse, SentimentsMap, SentimentLabel, AnalyzeResponse } from '../../types/sentiment';
import {
  API_CONFIG,
  SENTIMENT_API_BASE_URL,
  ANALYSIS_BUFFER_MS,
  GLOBAL_ANALYSIS_THROTTLE_MS,
  RATE_LIMIT_MAX_JOBS,
  RATE_LIMIT_DURATION_MS,
} from '../../constants/api';
import { cryptoApi } from '../crypto/cryptoApi';
import { setLastAnalysisTrigger } from './sentimentSlice';
import { isStablecoin } from '../../constants/stablecoins';
import type { RootState } from '../../services/store';

export const sentimentApi = createApi({
  reducerPath: API_CONFIG.REDUCER_PATHS.SENTIMENT,
  baseQuery: fetchBaseQuery({
    baseUrl: SENTIMENT_API_BASE_URL,
  }),
  tagTypes: [API_CONFIG.TAG_TYPES.SENTIMENT],
  keepUnusedDataFor: API_CONFIG.CACHE.KEEP_UNUSED_DATA_FOR,
  refetchOnFocus: true,
  endpoints: (builder) => ({
    getAllSentiments: builder.query<SentimentsMap, void>({
      query: () => '/sentiment',

      transformResponse: (response: ApiSentimentResponse[]): SentimentsMap => {
        const map: SentimentsMap = {};
        response.forEach((item) => {
          map[item.symbol.toLowerCase()] = {
            symbol: item.symbol.toLowerCase(),
            score: item.score,
            sentiment: item.status.toLowerCase() as SentimentLabel,
            analysis: item.summary,
            timestamp: item.updatedAt,
          };
        });
        return map;
      },

      providesTags: [API_CONFIG.TAG_TYPES.SENTIMENT],

      async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
        const { data: sentimentsMap } = await queryFulfilled;
        const state = getState() as RootState;

        const now = Date.now();
        const lastTrigger = state.sentiment.lastGlobalAnalysisTrigger;
        if (now - lastTrigger < GLOBAL_ANALYSIS_THROTTLE_MS) return;

        const coinsData = cryptoApi.endpoints.getTopCryptos.select()(state)?.data;
        if (!coinsData?.entities) return;

        const allSymbols = Object.values(coinsData.entities).map((coin) => coin.symbol.toLowerCase());
        const missingSymbols = allSymbols.filter(
          (sym) => !sentimentsMap[sym] && !isStablecoin(sym)
        );
        console.log('missingSymbols', missingSymbols);
        if (missingSymbols.length > 0) {
          dispatch(setLastAnalysisTrigger());
          dispatch(sentimentApi.endpoints.triggerAnalysis.initiate(missingSymbols));
        }
      },
    }),

    triggerAnalysis: builder.mutation<AnalyzeResponse, string[]>({
      query: (symbols) => ({
        url: '/sentiment/analyze',
        method: 'POST',
        body: { symbols },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const queuedCount = data.queued.length;
          if (queuedCount > 0) {
            const estimatedTimeMs =
              (queuedCount / RATE_LIMIT_MAX_JOBS) * RATE_LIMIT_DURATION_MS + ANALYSIS_BUFFER_MS;
            await new Promise((resolve) => setTimeout(resolve, estimatedTimeMs));
            dispatch(sentimentApi.util.invalidateTags([API_CONFIG.TAG_TYPES.SENTIMENT]));
          }
        } catch {
          // Request failed — no invalidation
        }
      },
    }),
  }),
});

export const { useGetAllSentimentsQuery } = sentimentApi;
