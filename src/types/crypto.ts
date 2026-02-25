/**
 * TypeScript type definitions for cryptocurrency data
 * 
 * This file contains all the type definitions used throughout the application
 * for handling data from CoinGecko API and Binance WebSocket.
 */

/**
 * CoinGecko API market_chart response structure
 * Prices array of [timestamp_ms, price] for historical chart data
 */
export interface CoinGeckoMarketChartResponse {
  prices: [number, number][];
}

/**
 * CoinGecko API response structure
 * Represents a cryptocurrency coin from CoinGecko's /coins/markets endpoint
 */
export interface CoinGeckoCoin {
  id: string; // CoinGecko unique identifier (e.g., 'bitcoin')
  symbol: string; // Cryptocurrency symbol (e.g., 'btc')
  name: string; // Full name (e.g., 'Bitcoin')
  image: string; // URL to the coin's logo image
  current_price: number; // Current price in USD
  price_change_percentage_24h: number; // 24h price change percentage
  market_cap: number; // Market capitalization in USD
}

/**
 * Binance WebSocket ticker message structure
 * Represents real-time price updates from Binance WebSocket stream
 */
export interface BinanceTicker {
  s: string; // Symbol in Binance format (e.g., 'BTCUSDT')
  c: string; // Last price (as string)
  P: string; // Price change percent in 24h (as string)
  v: string; // Trading volume in 24h (as string)
}

/**
 * Extended coin interface combining CoinGecko and Binance data
 * This is the main type used throughout the application
 */
export interface CryptoCoin extends CoinGeckoCoin {
  binanceSymbol: string; // Binance trading pair symbol (e.g., 'BTCUSDT')
  lastUpdated?: number; // Timestamp of the last price update from WebSocket
}

/**
 * Optimized data structure for cryptocurrency data
 * Uses maps for O(1) lookups instead of O(n) array searches
 */
export interface CryptoCoinsData {
  /**
   * Array of coin IDs in order (for maintaining display order)
   */
  ids: string[];
  
  /**
   * Map of coinId -> CryptoCoin for O(1) lookup by ID
   */
  entities: Record<string, CryptoCoin>;
  
  /**
   * Map of binanceSymbol -> coinId for O(1) lookup by Binance symbol
   */
  binanceMap: Record<string, string>;
}

/**
 * Price change direction for animation states
 * Used in PriceTag component to determine visual feedback
 * 
 * Note: Values are defined in constants/styles.ts as PRICE_CHANGE_DIRECTION
 */
export type PriceChangeDirection = 'up' | 'down' | null;
