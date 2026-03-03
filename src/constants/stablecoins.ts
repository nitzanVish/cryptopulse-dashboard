/**
 * Known stablecoin symbols (lowercase).
 */
export const STABLECOIN_SYMBOLS = new Set([
  'usdt',
  'usdc',
  'dai',
  'busd',
  'tusd',
  'usdp',
  'frax',
  'usdd',
  'gusd',
  'lusd',
]);

export function isStablecoin(symbol: string): boolean {
  return STABLECOIN_SYMBOLS.has(symbol.toLowerCase());
}
