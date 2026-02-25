/**
 * API Configuration Constants
 */

export const API_CONFIG = {
  REDUCER_PATHS: {
    CRYPTO: 'cryptoApi',
    SENTIMENT: 'sentimentApi',
  },
  TAG_TYPES: {
    CRYPTO: 'Crypto',
    SENTIMENT: 'Sentiment',
  },
  CACHE: {
    KEEP_UNUSED_DATA_FOR: 600, // 10 minutes (sentiment)
    CHART_KEEP_UNUSED_DATA_FOR: 300, // 5 minutes (24h market chart)
  },
} as const;

export const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

export const SENTIMENT_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';
