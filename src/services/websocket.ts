/**
 * WebSocket Service for Binance Real-time Price Updates
 * 
 * Filters updates to only tracked coins and only dispatches when price actually changes.
 * Uses O(1) map lookups instead of O(n) array searches for performance.
 */

import type { BinanceTicker } from '@/types/crypto';
import { store } from './store';
import { updatePrice } from '@/features/crypto/cryptoSlice';
import { cryptoApi } from '@/features/crypto/cryptoApi';

const BINANCE_WS_URL = 'wss://stream.binance.com:9443/ws/!ticker@arr';

function getCoinIdFromBinanceSymbol(binanceSymbol: string): string | null {
  const state = store.getState();
  const coinsData = cryptoApi.endpoints.getTopCryptos.select()(state)?.data;
  
  if (!coinsData) return null;
  
  return coinsData.binanceMap[binanceSymbol] || null;
}

function getCurrentPrice(coinId: string): number | undefined {
  const state = store.getState();
  
  const wsUpdate = state.crypto.updatedPrices[coinId];
  if (wsUpdate) {
    return wsUpdate.price;
  }
  
  const coinsData = cryptoApi.endpoints.getTopCryptos.select()(state)?.data;
  const coin = coinsData?.entities[coinId];
  
  return coin?.current_price;
}

// Only dispatches if price actually changed (prevents unnecessary Redux dispatches)
function processTickerUpdate(ticker: BinanceTicker): void {
  const { s: symbol, c: lastPrice, P: priceChangePercent } = ticker;
  
  const coinId = getCoinIdFromBinanceSymbol(symbol);
  if (!coinId) return;
  
  const price = parseFloat(lastPrice);
  const priceChange = parseFloat(priceChangePercent);
  
  if (isNaN(price) || isNaN(priceChange)) {
    console.warn(`Invalid price data for ${symbol}:`, { lastPrice, priceChangePercent });
    return;
  }
  
  const previousPrice = getCurrentPrice(coinId);
  
  if (previousPrice === undefined || previousPrice !== price) {
    store.dispatch(updatePrice({
      coinId,
      price,
      priceChangePercent: priceChange,
    }));
  }
}

export function createBinanceWebSocket(
  onMessage?: (event: MessageEvent) => void,
  onError?: (event: Event) => void,
  onClose?: (event: CloseEvent) => void
): WebSocket {
  const ws = new WebSocket(BINANCE_WS_URL);
  
  ws.onmessage = (event) => {
    try {
      const tickers: BinanceTicker[] = JSON.parse(event.data);
      tickers.forEach(processTickerUpdate);
      onMessage?.(event);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };
  
  ws.onerror = (event) => {
    console.error('WebSocket error:', event);
    onError?.(event);
  };
  
  ws.onclose = (event) => {
    console.log('WebSocket closed:', event.code, event.reason);
    onClose?.(event);
  };
  
  return ws;
}
