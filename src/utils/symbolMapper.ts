/**
 * Symbol mapping utility for converting between CoinGecko and Binance symbols
 * 
 * This module handles the conversion between different symbol formats used by
 * CoinGecko API (lowercase, e.g., 'btc') and Binance WebSocket (uppercase + USDT, e.g., 'BTCUSDT').
 * 
 * Includes edge case handling for coins that don't follow the standard pattern.
 */

/**
 * Edge cases mapping: CoinGecko symbol -> Binance symbol
 * 
 * Some cryptocurrencies have different naming conventions between exchanges.
 * This map handles special cases that don't follow the standard pattern of
 * uppercase + 'USDT' suffix.
 */
const SYMBOL_MAP: Record<string, string> = {
  weth: 'ETHUSDT', // Wrapped ETH uses ETHUSDT on Binance (not WETHUSDT)
  matic: 'MATICUSDT', // Same name, but explicitly mapped for consistency
  // Add more edge cases as needed when discovered
};

/**
 * Converts CoinGecko symbol to Binance symbol format
 * 
 * @param coinGeckoSymbol - Lowercase symbol from CoinGecko (e.g., 'btc')
 * @returns Binance symbol format (e.g., 'BTCUSDT')
 * 
 * @example
 * coinGeckoToBinance('btc') // Returns 'BTCUSDT'
 * coinGeckoToBinance('weth') // Returns 'ETHUSDT' (edge case)
 */
export function coinGeckoToBinance(coinGeckoSymbol: string): string {
  const lowerSymbol = coinGeckoSymbol.toLowerCase();
  
  // Check edge cases first (e.g., WETH -> ETHUSDT)
  if (SYMBOL_MAP[lowerSymbol]) {
    return SYMBOL_MAP[lowerSymbol];
  }
  
  // Default pattern: convert to uppercase and append 'USDT'
  return `${coinGeckoSymbol.toUpperCase()}USDT`;
}

/**
 * Converts Binance symbol to CoinGecko symbol format
 * 
 * This is the reverse operation of coinGeckoToBinance.
 * Used when receiving WebSocket updates from Binance and need to find
 * the corresponding coin in our CoinGecko-based state.
 * 
 * @param binanceSymbol - Binance symbol (e.g., 'BTCUSDT')
 * @returns CoinGecko lowercase symbol (e.g., 'btc')
 * 
 * @example
 * binanceToCoinGecko('BTCUSDT') // Returns 'btc'
 * binanceToCoinGecko('ETHUSDT') // Returns 'eth' (or 'weth' if it was WETH)
 */
export function binanceToCoinGecko(binanceSymbol: string): string {
  // Remove 'USDT' suffix and convert to lowercase
  const symbol = binanceSymbol.replace(/USDT$/, '').toLowerCase();
  
  // Build reverse lookup map for edge cases
  // Maps Binance symbol -> CoinGecko symbol
  const reverseMap: Record<string, string> = {};
  Object.entries(SYMBOL_MAP).forEach(([key, value]) => {
    reverseMap[value] = key;
  });
  
  // Check if this Binance symbol has a special CoinGecko mapping
  if (reverseMap[binanceSymbol]) {
    return reverseMap[binanceSymbol];
  }
  
  return symbol;
}

/**
 * Gets the Binance symbol from a CoinGecko coin object
 * 
 * Convenience function that extracts the Binance symbol format
 * from CoinGecko coin data. Currently uses only the symbol, but
 * coinGeckoId is included for potential future use.
 * 
 * @param _coinGeckoId - CoinGecko ID (e.g., 'bitcoin') - reserved for future use
 * @param coinGeckoSymbol - CoinGecko symbol (e.g., 'btc')
 * @returns Binance symbol format (e.g., 'BTCUSDT')
 * 
 * @example
 * getBinanceSymbol('bitcoin', 'btc') // Returns 'BTCUSDT'
 */
export function getBinanceSymbol(_coinGeckoId: string, coinGeckoSymbol: string): string {
  return coinGeckoToBinance(coinGeckoSymbol);
}
