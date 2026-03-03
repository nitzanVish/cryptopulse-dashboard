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

/** Buffer (ms) added to dynamic delay estimate before invalidating sentiment cache */
export const ANALYSIS_BUFFER_MS = 5000;

/** Global throttle (ms) — no new analyze requests within this window after last trigger */
export const GLOBAL_ANALYSIS_THROTTLE_MS = 5 * 60 * 1000; // 5 minutes

/** Backend worker rate limit — matches cryptopulse-api WORKER_CONFIG.RATE_LIMIT */
export const RATE_LIMIT_MAX_JOBS = 4;
export const RATE_LIMIT_DURATION_MS = 60000;
