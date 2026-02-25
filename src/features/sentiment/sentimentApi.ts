/**
 * RTK Query API for Sentiment Analysis
 * 
 * Fetches all sentiments in a single request and transforms to map structure
 * for efficient O(1) lookups by symbol.
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ApiSentimentResponse, SentimentsMap, SentimentLabel } from '../../types/sentiment';
import { API_CONFIG, SENTIMENT_API_BASE_URL } from '../../constants/api';

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
    }),
  }),
});

export const { useGetAllSentimentsQuery } = sentimentApi;
