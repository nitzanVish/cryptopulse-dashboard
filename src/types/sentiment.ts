/**
 * Sentiment-related type definitions
 */

export type SentimentLabel = 'bullish' | 'bearish' | 'neutral';

/**
 * API response structure from GET /api/v1/sentiment
 * Note: API returns status as 'Bullish' | 'Bearish' | 'Neutral' (capitalized)
 */
export interface ApiSentimentResponse {
  symbol: string;
  status: 'Bullish' | 'Bearish' | 'Neutral';
  score: number; // 0-100
  summary: string;
  updatedAt: string; // ISO string
  lastArticleDate: string; // ISO string
}

/**
 * Sentiment data mapped for UI usage
 */
export interface SentimentData {
  symbol: string;
  score: number; // 1-100
  sentiment: SentimentLabel;
  analysis: string;
  timestamp: string;
}

/**
 * Map for O(1) lookups by symbol
 */
export type SentimentsMap = Record<string, SentimentData>;

/**
 * Props for SentimentBadge component
 */
export interface SentimentBadgeProps {
  symbol: string;
}

/** POST /api/v1/sentiment/analyze response */
export interface AnalyzeResponse {
  queued: string[];
  skipped: string[];
}
